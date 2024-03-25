const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const ejs = require("ejs")
const mongoose = require("mongoose")
const app = express()
const port = 3000
var _ = require('lodash');

//Some Content varibles
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
var posts=[]

//The necessary Statments For Better Functionality
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine","ejs")
app.use(express.static("static"))
//Database scripts --->
main().catch(error=>{console.log(error)})
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/blogsiteDB')
    //creating posts schema
    const postSchema= new mongoose.Schema({
        name:String,
        content:String
    })
    const Post = mongoose.model("Post",postSchema)
//The Actual Scripts & Routs Of The Site
app.get("/",(req,res)=>{
    Post.find().then(results=>{
    posts=results
    res.render("home",{home_content:homeStartingContent,postItems:posts})
    }).catch(error=>{})
})

app.get("/about",(req,res)=>{
    res.render("about",{about_us:aboutContent})
})

app.get("/contact",(req,res)=>{
    res.render("contact",{contact_us:contactContent})
})

app.get("/compose",(req,res)=>{
    res.render("compose")
})

var mypost=[]
app.get("/posts/:postid",(req,res)=>{
    let postid= req.params.postid
    //using For Each Loop
    Post.findOne({_id:postid}).then(results=>{
        mypost=results
        res.redirect("/posts")
        // res.render("posts",{postId:results.name,postContent:results.content})
    })
    // posts.forEach((items)=>{
    //     const post_id=items._id
    //     console.log(post_id)
    //     const post_content= items.content 
    //     if(post_id===postid)
    //     {   
    //         res.render("posts",{postId:items.title,postContent:post_content})
    //     }
        /*Here When you put else statement that goes to the same page of if condtion
        It will throws an error headers are already Sent cannot send them again
        so when you put a else condtion it may should redirect you to some other page */
})

app.get("/posts",(req,res)=>{
    res.render("posts",{postId:mypost.name,postContent:mypost.content})
})

//Now Handling Post requests
app.post("/compose",(req,res)=>{
    var pName= req.body.postTitle
    var pContent = req.body.postBody

    const post = new Post({
        name:pName,
        content:pContent
        })
    post.save()
    res.redirect("/")
    }
    // const post={
    // title:req.body.postTitle,
    // content:req.body.postBody}
    // posts.push(post)
    // res.redirect("/")   
)

}//end of async func main()
//App Is Listening on The Port
app.listen(process.env.PORT || port,(req,res)=>{
    console.log("BlogSite is Running on port :"+ port)
})