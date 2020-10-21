const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const e = require("express");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect('mongodb://localhost/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema)

const item1 = new Item({
    name: "Welcome!"
})

const item2 = new Item({
    name: "Eat Food"
})
const item3 = new Item({
    name: "That's important"
})

const defaultItems = [item1, item2, item3]


const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", (req, res) => {


    Item.find(function (err, foundItem) {

        if (foundItem.length === 0) {
            Item.insertMany(defaultItems, err => { if (err) { console.log(err) } })
            res.redirect("/");
        } else {
            res.render("list", { listTitle: "Today", items: foundItem });
        }

    })
})

app.post("/", (req, res) => {


    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    })


    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, (err, foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + foundList.name);
        })
    }
})

app.post("/delete", (req, res) => {
    const delItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.deleteOne({ _id: delItemId }, err => {
            if (!err) {
                res.redirect('/')
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
