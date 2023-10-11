const express = require("express");
const app = express();
const date = require(__dirname+"/views/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");


const bodyParser = require("body-parser");
const homeItems=["buy groceries","buy lambo","buy a pizza"];
const workItems=[];

 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

mongoose.connect();

const itemsSchema = mongoose.Schema({
    name:String
});

const Item = mongoose.model("item",itemsSchema);

const item1 = new Item({name:"this is your to do list"});
const item2 = new Item({name:"click + to add new item"});
const item3 = new Item({name:"<-- click to remove item"});

const document = [item1,item2,item3];

const listSchema = mongoose.Schema({
    name:String,
    list:[itemsSchema]
});

const List = mongoose.model("list",listSchema);

app.get("/",function(req,res){
    let day = date.getDate();
    Item.find().then(function(docs){
        if(docs.length==0){
            Item.insertMany(document).then(function(){console.log("successfull");}).catch(function(err){console.log(err);});
            res.redirect("/");
        }
        else{
        res.render("lists",{listTitle:"Today", item:docs});
        }
    }).catch(function(err){console.log(err);});
    

});

app.get("/:customListName", function(req,res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name:customListName}).then(function(foundlist){
        if(foundlist){
            res.render("lists",{listTitle:foundlist.name, item:foundlist.list});
        }
        else{
            console.log("not exist");
            const list = new List({
                name:customListName,
                list:document
            });
            list.save();
            res.redirect("/"+customListName);
        }
    }).catch((err)=>{console.log(err);});

    
    
})

app.post("/",function(req,res){
    let itemName = req.body.todo;
    let listName = req.body.button;
    const item = new Item({
        name:itemName
    })
    if(listName === "Today"){
        
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName}).then(function(foundlist){
            foundlist.list.push(item);
            foundlist.save();
            res.redirect("/"+listName);
        }).catch((err)=>{console.log(err)});
    }

});

app.post("/delete",function(req,res){
    const deleteitemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName == "Today"){
        Item.findByIdAndRemove(deleteitemId).then(()=>{console.log("deleted");res.redirect("/");
    
    }).catch((err)=>console.log(err));
    }
    else{
        List.findOneAndUpdate({name:listName},{$pull:{list: {_id:deleteitemId}}}).then(function(foundlist){
            res.redirect("/"+listName);
        }).catch((err)=>console.log(err));
    }
    
});

// app.get("/work",function(req,res){
//     res.render("lists",{listTitle:"Work List", item:workItems});
// });

// app.post("/work",function(req,res){
//     let item=req.body.todo;
//     workItems.push(item);
//     res.redirect("/work");
// })

app.get("/about",function(req,res){
    res.render("about");
});

app.listen(3000,function(){
    console.log("server started on port 3000");
});

