const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect('mongodb://localhost/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = {
    name: String
};

const listSchema = {
    name: String,
    items: [itemSchema]
};

const Item = mongoose.model("Item", itemSchema)
const List = mongoose.model("List", listSchema);


const defaultItems = [
    new Item({
        name: "Welcome!"
    }),
    
    new Item({
        name: "Eat Food"
    }),
    new Item({
        name: "That's important"
    })
]



app.get("/", (req, res) => {
    const list = new List({
        name: date.getDate(),
        items: defaultItems
    })

    List.findOne({ name:  date.getDate() }, (err, results) => {
        if (!err) {
            if (!results) {
                list.save();
                res.redirect("/");
            }
            else {
                res.render("list", { listTitle: date.getDate(), items: results.items})
            }
        }
    })
})

app.post("/", (req, res) => {

    const newItemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: newItemName
    })

    if (listName === date.getDate()) {
        List.findOne({ name: date.getDate() }, (err, foundList) => {
            if(!err){
                foundList.items.push(item);
                foundList.save();
                res.redirect("/");
            }
        })
    } else {
        List.findOne({ name: listName }, (err, foundList) => {
            if(!err){
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + foundList.name);
            }
        })
    }
})


app.post("/delete", (req, res) => {
    const delItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === date.getDate()) {
        List.findOneAndUpdate({name: listName}, {$pull: {items:{_id: delItemId}}}, (err, foundList)=>{
            if(!err){
                res.redirect('/');
            }
        })
    } else {
        List.findOneAndUpdate({name:listName}, {$pull:{items:{_id: delItemId}}}, (err, foundList)=>{
            if(!err){
                res.redirect('/' + listName);
            }
        })
    }
})


app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    const list = new List({
        name: customListName,
        items: defaultItems
    })

    List.findOne({ name: customListName }, (err, results) => {
        if (!err) {
            if (!results) {
                list.save();
                res.redirect("/" + customListName);
            }
            else {
                res.render("list", { listTitle: customListName, items: results.items })
            }
        }
    })
})


app.listen(8000, () => {
    console.log("server run on 8000");
})
