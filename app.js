

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://admin-aditya:Aditya555@cluster0.mrqkzsx.mongodb.net/todolistDB")
const app = express();
const _ = require('lodash')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))


// MMmmmooooonnnngooosssse

const itemSchema = {
    name: String
}
const Item = mongoose.model('Item', itemSchema);
const item1 = new Item({
    name: "Welcome to our todolist",
})
const item2 = new Item({
    name: "Hit the + button to add a new item",
})
const item3 = new Item({
    name: "<-- Hit this to delete an item",
})
const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model('List', listSchema)


app.get("/:customNameList", (req,res)=>{
    const customNameList = _.capitalize(req.params.customNameList); 
    List.findOne({name:customNameList}, (err,foundlist)=>{
        if (!err) {
            if (!foundlist) {
                const list = new List({
                    name: customNameList,
                    items: defaultItems
                   });
                      list.save();
                      res.redirect('/' + customNameList)
            }else{
                res.render('list',{listTitle: foundlist.name, newListItems: foundlist.items})
            }
        }
    })



    

});


const items = ["Buy Food","Cook Food","Eat Food"];
// const workItems = []

app.get("/", (req,res)=>{
    
    Item.find({},(err, foundItems)=>{
        if(foundItems.length === 0){
            Item.insertMany(defaultItems, (err)=>{
              if (err){
                console.log(err);
              }else{
                console.log("saved successfully");
              }
            })
            res.redirect('/')
        }else{
            
            res.render('list',{listTitle: 'Today', newListItems: foundItems
        });
        }
    });
});





app.post("/delete", (req,res)=>{

 const checkedItemId = req.body.checkbox;
const listName = req.body.listName;
if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, (err)=>{
    if (!err){
        console.log("successfully deleted that item");
    }
    res.redirect('/')
    })

}else{
    List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkedItemId}}}, (err)=>{
if (!err){
    res.redirect("/" + listName)
}
    })
}


})





app.post("/",(req,res)=>{
    const itemName = req.body.newItem;
    const listName = req.body.list;

const item = new Item({
    name: itemName
});
if(listName === 'Today'){
    item.save();
    res.redirect("/");
}else{
    List.findOne({name: listName}, (err , foundlist)=>{
        foundlist.items.push(item);
        foundlist.save();
        res.redirect("/" + listName)
    })
}
})

  



 
// app.get('/work', (req,res)=>{
//     res.render('list',{listTitle: "work List", newListItems: workItems});
// })

    


app.listen(3000,()=>{
    console.log("server is runing on port 3000");
})