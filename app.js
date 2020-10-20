const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect('mongodb://localhost/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema)

const item1 = new Item ({
    name: "Welcome!"
})

const item2 = new Item ({
    name: "Eat Food"
})
const item3 = new Item ({
    name: "That's important"
})

const defaultItems = [item1, item2, item3]


app.get("/", (req, res) => {
    

    Item.find(function(err, foundItem){
        
        console.log(foundItem);
        if(foundItem.length === 0){
            Item.insertMany(defaultItems, err=>{if(err){console.log(err)}})
            res.redirect("/");
        }else{
            res.render("list", { listTitle: "Today", items: foundItem });
        }

    })
})

app.post("/", (req, res)=>{
    

    const itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    })

    item.save();

    
    res.redirect("/");
})

app.post("/delete", (req, res)=>{
    console.log(req.body);
    const delItemId = req.body.checkbox;
    Item.deleteOne({_id: delItemId}, err=>console.log(err))
    res.redirect("/")
})


app.get("/work", (req, res)=> {
    res.render("list", { listTitle: "Work list", items: workItems });
})
app.get("/about", (req, res)=>{
    res.render("about");
})

app.listen(3000, () => {
    console.log("server run on 3000");
})
