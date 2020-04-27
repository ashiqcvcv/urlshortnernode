const express = require('express');
const bodyparser = require('body-parser');
var cors = require('cors')
const app = express();
const MongoClient = require('mongodb');
const url='mongodb+srv://ashiq:19851055181@shorturl-fzgzn.mongodb.net/test?retryWrites=true&w=majority';

const link = 'http://localhost:3000/search/:';

app.use(cors());
app.use(bodyparser.json());

app.set('port',process.env.PORT);

//to create create short url

app.post('/create', function(req, res) {
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
        if (err) return console.log(err);
        console.log("entered db");
        var db = client.db("marketDB");
        db.collection('shorturl').findOne({ "name" : req.body.name },(err,result) => {
            if(err) throw err;
            if(result==null){
                console.log("same db not found");
                let extender = Math.floor(Math.random() * 1000);
                // let extenderUnique = 2;
                // // while(extenderUnique == 2){
                // //     db.collection('shorturl').findOne({'extender':extender },(err,checking) =>{
                // //         if(err) throw err;
                // //         if(checking != null){
                // //             extender = Math.floor(Math.random() * 1000);
                // //             console.log("match found");
                // //         }else{
                // //             extenderUnique = 3;
                // //             console.log("loop closed");
                // //         }
                // //         console.log("enterted near while");
                // //         extenderUnique = 6;
                // //     })
                // // }
                let output = req.body;
                output['extender'] = extender;
                output['link'] = link + extender;
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
                    'url' : 'http://localhost:3000/search/:' + result.extender
                })
            }
        })
        
        
    })
})

//to get catogory details
app.get('/list', function(req, res) {
    console.log(req.body);
    MongoClient.connect(url,{ useUnifiedTopology: true }, (err, client) => {
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
app.put('/:id', function(req, res) {
    console.log("i got the call");
    var id = req.param('id');
    console.log(req.body);
    MongoClient.connect(url,{ useUnifiedTopology: true }, (err, client) => {
        if (err) return console.log(err);
        db.collection('shorturl').findOne({ "extender" : id },(err,result) => {
            if(err) throw err;
            if(result==null){
                res.redirect(result.link);
                console.log("redirected");
                client.close();
            }
        })
    })
})


app.listen(app.get('port'), function() {
    console.log("port is running");
})