import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
var listName = "Today's List";
const d = new Date();
let date = d.toDateString();
var ListItems = []; 

app.get("/", (req, res)=>{
    
    res.render("index.ejs",{
        date: date,
        listName : listName,
        ListItems : ListItems,
    });   // res.render("qr-code.ejs", {imagePath: p, altText: "Image Description", url : url,});
});
app.post("/Listname" , (req, res) =>{
    listName = req.body["NewListName"];
    res.render("index.ejs", {
        date: date,
        listName : listName,
        ListItems : ListItems,
    });
})

app.post("/listItem" , (req, res)=>{
    if (ListItems.includes(req.body["NewListItem"])){
        res.render("index.ejs", {
            date: date,
            listName : listName,
            ListItems : ListItems,
        });
    }
    else {
        ListItems.push(req.body["NewListItem"]);
        res.render("index.ejs", {
            date: date,
            listName : listName,
            ListItems : ListItems,
        });
    }
    
    
})
app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`);
});