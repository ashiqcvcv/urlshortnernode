const express = require('express');
const bodyparser = require('body-parser');
var cors = require('cors')
const app = express();
const MongoClient = require('mongodb');
const url='mongodb+srv://ashiqcv:19851055181@cluster0-lkvm8.mongodb.net/test?retryWrites=true&w=majority';

const link = 'https://urliq.herokuapp.com/search/';

app.use(cors());
app.use(bodyparser.json());

app.set('port',process.env.PORT);

//to create create short url

app.post('/create', function(req, res) {
    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        console.log("entered db");
        var db = client.db("marketDB");
        db.collection('shorturl').findOne({ name : req.body.name },(err,result) => {
            if(err) throw err;
            if(result==null){
                let extender = Math.floor(Math.random() * 1000);
                let output = req.body;
                output.extender = extender;
                output.link = link + extender;
                db.collection('shorturl').insertOne(output, (err, result) => {
                if (err) throw err;
                client.close();
                console.log("data inserted");
            res.send({
                'url' : link + extender
            })
        })
            }else{
                res.send({
                    'url' : link + result.extender
                })
            }
        })
        
        
    })
})

//to get catogory details
app.get('/list', function(req, res) {
    console.log(req.body);
    MongoClient.connect(url, (err, client) => {
        if (err) return console.log(err);
        var db = client.db("marketDB");
        var userCursor =    db.collection('shorturl').find().toArray();
         userCursor.then(function(data){
             res.json(data);
             client.close();
         })
    })
})

//to route to original website
app.get("/search/:id",function(req,res){
    var name=parseInt(req.params.id);
    MongoClient.connect(url,function(err,client){
        if(err) throw err;
        var db = client.db("marketDB");
       db.collection("shorturl").findOne({extender : name},function(err,data){
            if(err) throw err;
            client.close();
            console.log(data.longUrl);
            res.redirect(data.longUrl);
        })

   })
})


app.listen(app.get('port'), function() {
    console.log("port is running");
})