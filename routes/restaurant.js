var express = require('express');
var router = express.Router();
let restaurantModel = require('./../models/restaurantModel');
let restaurantDetailsModel = require('./../models/restaurantDetailsModel');

/* GET users listing. */
router.get('/restaurant', function(req, res, next) {
    // restaurantModel.aggregate([
    //     {
    //         $lookup : {
    //             from : 'restaurantdetails',
    //             localField: 'restaurantID',
    //             foreignField: 'restaurantID',
    //             as: 'restaurantSpecifics'
    //         }
    //     }
    // ])
    // .exec((err, restaurantDetails)=>{
    //     if(err) res.send({'error' : err});
    //     else{
    //         res.json(restaurantDetails);
    //     } 
    // })

    restaurantDetailsModel.find({})
        .populate('restaurantSpecifics')
            .exec((err, restaurantDetails)=>{
                if(err) res.send({'error' : err});
                else{
                    res.json(restaurantDetails);
                } 
            })
});

router.get('/restaurantDetails', function(req, res, next) {
    restaurantDetailsModel.find()
        .skip(1)
        .sort({restaurantID: "asc"})
        .limit(10)
        .exec((err, restaurantDetails)=>{
            if(err) res.send({'error' : err});
            else res.json(restaurantDetails);
        })
});

router.get('/restaurantDetails/:id', function(req, res, next) {
    restaurantDetailsModel.aggregate([
            {
                $match: {restaurantID: req.params.id}
            },
            {
                $lookup: {
                    from : 'restaurants',
                    localField: 'restaurantID',
                    foreignField: 'restaurantID',
                    as: 'restaurantSpecifics'
                }
            }
        ])
        .exec((err, restaurantDetails)=>{
            if(err) res.send({'error' : err});
            else{
                //console.dir(restaurantDetails.getCoords());
                res.json(restaurantDetails);
            } 
        })
});

router.get('/restaurantDetailsByCity', function(req, res, next) {
    let city = req.query.city;
    console.log('city: ' + city);
    restaurantDetailsModel.findByCity(city, (err, restaurantDetails)=>{
        if(err) res.send({'error' : err});
        else res.json(restaurantDetails);
    })
});

router.get('/restaurantDesp/:id', (req, res, next)=>{
    // restaurantModel.aggregate([
    //     {
    //         $match: {restaurantID : req.params.id}
    //     },
    //     {
    //         $lookup:{
    //             from: 'restaurantdetails',
    //             localField: 'restaurantID',
    //             foreignField: 'restaurantID',
    //             as: 'restaurantSpecifics'
    //         }
    //     }
    // ])
    // .exec((err, data)=>{
    //     if(err){
    //         res.send({'error': err});
    //     } else{
    //         res.json(data)
    //     }
    // })

    restaurantDetailsModel.find({restaurantID : req.params.id})
        .populate('restaurantSpecifics')
            .exec((err, restaurantDetails)=>{
                if(err) res.send({'error' : err});
                else{
                    res.json(restaurantDetails);
                } 
            })
})

router.get('/virtuals', (req, res)=>{
    restaurantDetailsModel.find()
        .exec((err, data)=>{
            // data.coords = {
            //     lat: 100,
            //     long: 200
            // };
            res.json(data);
        })
});

router.get('/methods', (req, res)=>{
    restaurantDetailsModel.findOne()
        .exec((err, data)=>{
            res.json(data);
        })
});

router.get('/statics', (req, res)=>{
    restaurantDetailsModel.findByCity("Mandaluyong City", (err, data)=>{
            res.json(data);
        })
});

router.get('/restaurant/:long/:lat', function(req, res, next) {
    let long = req.params.long;
    let lat = req.params.lat;
    restaurantDetailsModel.find({location: {
        $near: {
            $geometry : {
                type: "Point",
                coordinates: [long, lat],
            },
            $maxDistance: 5000,
        }
    }})
        .populate('restaurantSpecifics')
            .exec((err, restaurantDetails)=>{
                if(err) res.send({'error' : err});
                else{
                    res.json(restaurantDetails);
                } 
            })
});

module.exports = router;
