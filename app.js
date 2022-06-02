const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

const app=express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public/'))
app.set("view engine","ejs")

mongoose.connect("mongodb+srv://vm270400:qwe123@cluster0.aljel.mongodb.net/urlDB?retryWrites=true&w=majority",{ useNewUrlParser: true})

const urlSchema={
    shortUrl:String,
    longUrl:String
}

const Url = mongoose.model("Url",urlSchema)


app.get('/',function (req,res) {
    const emptyurl = ''
    res.render("index",{shortUrl:emptyurl})
  })

app.post("/",function (req,res) {
    const longurl = req.body.longUrl
    if (longurl.length==0){
        res.redirect('/')
    }else{
        const shorturl = 'http://localhost:8080/'+generateUrl()
        const newUrlPair = new Url({
            shortUrl:shorturl,
            longUrl:longurl
        })
        newUrlPair.save()
        res.render("index",{shortUrl:shorturl})
    }
  })

app.get('/:shortUrl',function (req,res) {
    const reqUrl = 'http://localhost:8080/'+req.params.shortUrl
    Url.findOne({shortUrl:reqUrl},function (err,foundUrlPair) {
        if(err){
            console.log(err)
        }
        else{
            res.redirect(foundUrlPair.longUrl)
        }
      })
  })

function generateUrl() {
    const string = 'qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNM'
    var result = ''
    for (var i=0;i<6;i++){
        result += string[Math.floor(Math.random()*62)]
    }
    return result
  }

app.listen(8080,function () { 
    console.log("Server Started")
 })