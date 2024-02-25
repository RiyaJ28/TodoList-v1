import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "ToDo",
  password: "1234",
  port: 5432,
});

db.connect();

const app = express();
const port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//var listName = "Today's List";
const d = new Date();
let date = d.toDateString();

app.get("/", async (req, res) => {
  const result = await db.query("select * from items");
  //console.log(result);
  var ListItems = [];
  result.rows.forEach((item) => {
    ListItems.push(item);
  });
  //console.log(ListItems);
  res.render("index.ejs", {
    date: date,
    //listName : listName,
    ListItems: ListItems,
  });
});

app.post("/listItem", async (req, res) => {
  try {
    var newItem = req.body["NewListItem"];

    const r = await db.query("select count(*) from items where item = $1", [
      newItem,
    ]);
    //console.log(r.rows[0].count);
    if (r.rows[0].count == 0) {
      db.query("insert into items (item) values ($1)", [newItem]);
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/deleteItem", async (req, res) => {
  const id = req.body["id"];
  console.log(id);
  db.query("delete from items where id = $1" ,  [id]);
  res.redirect("/");
});

app.post("/updateItem", async (req, res) => {
  const id = req.body["id"];
  const item = req.body["item"];
  console.log(id);

  db.query("update items SET  item =  $1  WHERE id = $2" , [item , id]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
