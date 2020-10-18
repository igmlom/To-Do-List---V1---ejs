const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = ["Buy Food","Eat Food"];

app.get("/", (req, res) => {
    var today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    var currentDay = today.toLocaleDateString("en-US", options)
    res.render("list", { currentDay: currentDay, items: items });
})

app.post("/", (req, res)=>{
    var item = req.body.new;
    items.push(item);
    res.redirect('/');
})

app.listen(3000, () => {
    console.log("server run on 3000");
})
