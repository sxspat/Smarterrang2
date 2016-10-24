"use strict";
var express = require('express');
var api = express.Router();
var User = require('../model/user');
var Comments = require('../model/comments');
var Experiences = require('../model/experiences');
var ExperiencesAdvertise = require('../model/experiences_advertise');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var async = require('async');
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport")
exports.api = api;

var smtpTransport = nodemailer.createTransport(smtpTransport({
    host : "smtp.gmail.com",
    secureConnection : false,
    port: 587,
    auth : {
        user : "smarterexperiences@gmail.com",
        pass : "savetheplanet"
    }
}));

// api.get('/', function(req, res) {
//     //  res.render('search_experiences.html',{cate:"Alle Kategorien", search:''});
//
// });

var obj= function(id,place){
    this.id = id;
    this.city = place;
}



api.get('/getplaces',function(req,res){
    // Experiences.find().select({"city":1}).exec(function(err,result){
        var arrVals=[];
        var search_term = req.query.q.replace(/\s+$/, '');
        var s_regex=new RegExp("^"+search_term,"i");;
        /*[ {'$match': { $or: [{ catplace: s_regex },{city:s_regex} ]}},
                                   {"$group": { "_id": { city: "$city" },item: { $push:  { country: "$country",lon: "$lon",specSpecCategory:"$specSpecCategory",city:"$city",lon:"$lon",lat:"$lat",catplace:'$catplace' } } }},  { $skip : 0 },{$limit:5}]*/

        Experiences.aggregate([ {'$match':   { city: s_regex }},
                                   {"$group": { "_id": { city: "$city" },item: { $push:  { country: "$country",lon: "$lon",specSpecCategory:"$specSpecCategory",city:"$city",lon:"$lon",lat:"$lat",catplace:'$catplace' } } }},  { $skip : 0 },{$limit:5}]).exec(function(err,result){
        if(err){
            console.error('Unable to fetch places..'+err);
        }
        if(result){

            for(var i=0; i<result.length; i++){

                if(result[i]!='' && result[i]!=undefined){
                       var item= result[i].item[0];
                       arrVals.push({city: item.city ,country: item.country,lon: item.lon,lat: item.lat,specspeccat:item.specSpecCategory,catplace:item.catplace,is_city:true,"placename":item.city});
                }

            }




                Experiences.aggregate([ {'$match':  { catplace: s_regex }},
                                   {"$group": { "_id": { city: "$city" },item: { $push:  { country: "$country",lon: "$lon",specSpecCategory:"$specSpecCategory",city:"$city",lon:"$lon",lat:"$lat",catplace:'$catplace' } } }},  { $skip : 0 },{$limit:5}]).exec(function(err,result1){


                                   for(var i=0; i<result1.length; i++){

                                        if(result1[i]!='' && result1[i]!=undefined){
                                               var item= result1[i].item[0];
                                               arrVals.push({city: item.city ,country: item.country,lon: item.lon,lat: item.lat,specspeccat:item.specSpecCategory,catplace:item.catplace,is_city:false,"placename":item.catplace});
                                        }

                                    }

                                     res.json(arrVals);



                 });





             //res.json(arrVals);



        }

    })
})

api.post('/saveWishlist', function(req, res){
  console.log(req.body.userId + 'test')

Experiences.findByIdAndUpdate(req.body.recId, {
      "$addToSet": {
          "wishlist": req.body.userId
      },
  }, function(err, data) {
      if (err) return res.json(err);
          res.json(data);
      });


});
api.post('/load',function(req,res){
    var f_query= req.body;
    var query = generateQuery(req.body);

    var miles = Number(req.body.miles) || 20;
    var maxDistance=20;
    var minDistance=0;
        if(miles == 20){
            maxDistance= 20 * 1000; //20km
            minDistance=0;
        }
        else if(miles == 50){

            maxDistance= 50 * 1000; //50km
            minDistance= 0;
        }
        else if(miles == 100){

            maxDistance= 100 * 1000; //100km
            minDistance=0;
        }
        else if(miles == 200){

            maxDistance= 10000 * 1000; //10000km
            minDistance=0;
        }
        delete query.city;
        delete query.specspeccat;
        delete query.spec;


     if(f_query.item){

             if(f_query.item.is_city){
                        if(f_query.item.lon != 0 || f_query.item.lat != 0){
                                delete query.city;
                                if(f_query.spec.length > 0 && f_query.category != "Alle Kategorien")
                                query.category=f_query.category;

                                if(f_query.spec.length > 0 && f_query.spec != "Unterkategorie")
                                 query.specCategory=f_query.spec;



                                query.loc= {
                                         $near: {
                                             $geometry: {
                                                 type: "Point",
                                                 coordinates: [parseFloat(f_query.item.lon),parseFloat(f_query.item.lat)]
                                             },
                                             $minDistance:minDistance,
                                             $maxDistance: maxDistance
                                         }
                                     }
                           }

             }
              if(f_query.item.is_city == false){

            //    query.specSpecCategory=f_query.item.specspeccat;
                query.city=f_query.item.city;
            }

            if(req.body.city!='' && req.body.specspeccat!=='')
                query.specSpecCategory=req.body.specspeccat;


     }

    var sortquery = {};
    var specSpecCat=[];

    if(req.body.stPrice > 0 || req.body.endPrice >0)
        query.price={};
    if(req.body.stPrice>0 )
        query.price.$gte =  parseInt(req.body.stPrice);
    if(req.body.endPrice>0)
            query.price.$lte =  parseInt(req.body.endPrice);


    if(req.body.price!="" || req.body.price==-1)
        sortquery.price = req.body.price;

        if(req.body.price == 1 || req.body.price == 0){
        Experiences.find(query).sort(sortquery).limit(req.body.limit).lean().exec(function (err, docs_accommo) {
          // console.log(docs_accommo[0].loc.coordinates + " $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

        if(!docs_accommo)
            console.log('Error at loading records Ali: '+err);
        else
            Experiences.find(query).lean().exec(function (err, rec) {
                if(err)
                    console.log('Error at counting records: '+err);
                else {
                    if(req.body.city!='' && req.body.specspeccat=='') {
                        for(var i=0; i<rec.length; i++){
                            if(specSpecCat.indexOf(rec[i].specSpecCategory)==-1)
                                specSpecCat.push(rec[i].specSpecCategory)
                        }
                    }
                    sendExperiences(req, res, query, docs_accommo, rec.length,specSpecCat);
                }
            })
        });
    }
    if(req.body.price == -1){

    Experiences.find({$and:[query,{"review":{$gt:0}}]}).sort([['review', 'descending']]).limit(req.body.limit).lean().exec(function (err, docs_accommo) {

    if(err)
        console.log('Error at loading records: '+err);
    else
        Experiences.find({$and:[query,{"review":{$gt:0}}]}).lean().exec(function (err, rec) {
            if(err)
                console.log('Error at counting records: '+err);
            else {
                var filter = Object.assign({}, query);

                filter.review = {$gt:0};

                if(req.body.city!='' && req.body.specspeccat=='') {
                        for(var i=0; i<rec.length; i++){
                            if(specSpecCat.indexOf(rec[i].specSpecCategory)==-1)
                                specSpecCat.push(rec[i].specSpecCategory)
                        }
                    }
                sendExperiences(req, res, filter, docs_accommo, rec.length,specSpecCat);
                // sendExperiences(req, res, filter, docs_accommo, rec.length);
            }
        })
    });


    }
});

api.get('/load',function(req,res){
    var place="";
    console.log('Redirect');
    res.redirect('/api/load/Alle Kategorien/'+place);
})

api.get('/load/:category', function(req, res) {
    console.log('Initiation');
    var query = {};
    if(req.params.category!="Alle Kategorien")
        query.category =  req.params.category;
    if(req.params.city!="undefined" && req.params.city!=undefined)
        query.city=req.params.city;
    console.log(query);
    Experiences.find(query).limit(10).exec(function(err, docs_accommo) {
        Experiences.find(query).lean().exec(function(err,rec){
           res.json({records:docs_accommo, count:rec.length});

        })
    });
});

api.get('/load/:category/:city', function(req, res) {
    console.log('Initiation');
    var query = {};


    if(req.params.category!="Alle Kategorien")
        query.category =  req.params.category;




    if(req.params.city!="undefined" && req.params.city!=undefined)
        query.city=req.params.city;



    Experiences.find(query).limit(10).exec(function(err, docs_accommo) {
        Experiences.find(query).lean().exec(function(err,rec){
          res.json({records:docs_accommo, count:rec.length});

        })
    });

});

api.post('/loadAdvertise', function (req, res) {
    var query = generateQuery(req.body);

    ExperiencesAdvertise.find(query).limit(req.body.limit).lean().exec(function (err, docs_accommo) {
        if (err) {
            console.log('Error at loading records: ' + err);
        } else {
            ExperiencesAdvertise.count(query, function (err, count) {
                if (err) {
                    console.log('Error at counting records: ' + err);
                } else {
                    res.json({records: docs_accommo, count: count});
                }
            })
        }
    });
});

api.get('/loadAdvertise',function(req,res){
    var place="";
    res.redirect('/api/loadAdvertise/Alle Kategorien/'+place);
})




api.post('/loadAdvertise', function(req, res) {
    var query = {};
    if(req.body.category!="Alle Kategorien")
        query.category =  req.body.category;
    ExperiencesAdvertise.find(query).limit(5).lean().exec(function(err, docs_accommo) {
        ExperiencesAdvertise.find(query).lean().exec(function(err,rec){
            res.send({records:docs_accommo, count:rec.length});
        })
    });

});

api.post('/postReviewTotal', function(req, res){

    Comments.aggregate([

        {$group: {
            _id: '$_roomID',
            sum: {$sum: '$star'},
            count: {$sum: 1},

        }}
    ], function (err, result) {


        if(result != ''){
            var calAvgReview = result[0].sum / result[0].count;

            Experiences.update({'_id': req.body.objectID}, {"review":calAvgReview}).lean().exec( function(err, data) {
                console.log(data);
            });
        }
        res.end(JSON.stringify(result));

    });
});


api.get('/getCommentsSum', function(req, res){
    Comments.aggregate([

        {$group: {
            _id: '$_roomID',
            sum: {$sum: '$star'},
            count: {$sum: 1},

        }}
    ], function (err, result) {
        //console.log(result);
        res.end(JSON.stringify(result));
    });

});


api.get('/getComments', function(req, res){
    Comments.find({}).sort({'star':-1}).lean().exec(function(err, comments){
        //console.log(comments);
        /*
         for(key in comments){
         console.log(key);
         console.log(comments[key]._id);

         }*/

        res.send(comments);

    });


});

api.post('/comments', function(req, res){

        //if (objIDIsValid) {

            var currentDate = new Date()
            var day = currentDate.getDate()
            var month = currentDate.getMonth() + 1
            var year = currentDate.getFullYear()
            var full = day + '/'+ month + '/' + year;

            var comments = new Comments({
                _creator : req.body.token,
                _roomID : req.body.objectID,
                comment : req.body.commentsData,
                star : req.body.star,
                namePerson : req.body.namePerson,
                created_at : currentDate,
                updated_at : currentDate

            });

            comments.save(function(err, comments) {
                if (err)
                    return console.error(err);
                console.log(comments);
                res.json(comments);
            });
        //}
    //});
});

api.get('/getMinMax', function(req, res) {
    var sortquery = {};
    var max=0;
    var min=0;
    sortquery.price=-1;
    Experiences.findOne().sort(sortquery).lean().exec(function (err, docs_accommo) {
        if(err)
            console.log('err for min max'+err);
        if(docs_accommo)
            max = docs_accommo.price;
        sortquery.price=1
        Experiences.findOne().sort(sortquery).lean().exec(function (err, docs_accommo) {
            if(docs_accommo)
                min = docs_accommo.price;
            res.json({'max':max, 'min':min});
        })
    })


});

api.get('/countPost', function(req, res) {
    Experiences.aggregate([

        {$group: {
            _id: '$category',
            sum: {$sum: '$star'},
            count: {$sum: 1},


        }}
    ], function (err, result) {
        //console.log(result);
        res.end(JSON.stringify(result));

    });

});

api.get('/countComment', function(req, res) {

    Comments.count({}).lean().exec(function(err, comm) {
        if (err)
            res.send(err);

        res.json(comm);
    });


});

api.post('/sendMessage',function(req,res){

  var mailOptions = {
    from: "smarterexperiences@gmail.com",
    to: req.body.email,
    subject: req.body.grund,
    generateTextFromHTML: true,
    html: "Hallo, sie haben eine Nachricht von: "+req.body.email+"<br><br>Betreff: "+req.body.grund+"<br><br>Nachricht: "+req.body.nachricht// html text body
  };

  smtpTransport.sendMail(mailOptions, function(error, response){
          if(error){
              console.log(error);
              res.end("error");
          }else{
              console.log(response.response.toString());
              console.log("Message sent: " + response.message);
              res.json("success");
          }
      });

              res.json("success");

});

function generateQuery(filter) {
    var query = {};

    if (filter.category && filter.category != 'Alle Kategorien') {
        query.category = filter.category;
    }

    if (filter.city) {
        query.city = filter.city;
    }

    if (filter.spec && filter.spec != 'Unterkategorie') {
        query.specCategory = filter.spec;
    }

    return query;
}

function sendExperiences(req, res, query, docs, count,specspecval) {
    var response = {records: docs, count: count, specspecval:specspecval};

        if (req.body.priceBoundaries) {
            getPriceBoundaries(query, function (err, priceBoundaries) {
                if (err) {
                    res.send(err);
                } else {
                    response.priceBoundaries = priceBoundaries;

                    res.send(response);
                }
            });
        } else {
            res.send(response);
        }

}


function getPriceBoundaries(filter, callback) {
    var query = {};
    var geoquery={};
    var gquery=[];

    ['city', 'category', 'specCategory', 'review',"specSpecCategory"].forEach(function (key) {
        if (filter[key]) {
            query[key] = filter[key];
        }
    });

    // is loc has in array remove city and add geoNear filter
    if(filter["loc"]){
        var near = filter.loc.$near;
        var geometry= near.$geometry;

       // console.log(filter["loc"],filter.loc.$near.$geometry,"query");
       geoquery= { near: { type: geometry.type, coordinates:geometry.coordinates }, minDistance: near.$minDistance,maxDistance: near.$maxDistance ,distanceField: "dist.calculated",spherical: true,num:100000000};
        delete  query["city"];
            gquery= [
             {$geoNear:geoquery},
             {$match: query},

            {
                $group: {
                    _id: null,
                    min: {$min: '$price'},
                    max: {$max: '$price'}
                }
            }
        ];
    }
    else{

               delete  query["category"];
               delete  query["loc"];
               delete  query["specSpecCategory"];
               delete  query["specCategory"];
              gquery= [

                         {$match: query},

                        {
                            $group: {
                                _id: null,
                                min: {$min: '$price'},
                                max: {$max: '$price'}
                            }
                        }
                    ];
    }





    Experiences.aggregate(gquery, function (err, results) {
        callback(err, results[0] || {min: 0, max: 0});
    });
}

// function isObjectId(n) {
//     return true;
//     //return mongoose.Types.ObjectId.isValid(n);
// }



module.exports = api;
