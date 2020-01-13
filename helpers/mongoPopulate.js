let fs = require('fs');
let lib = require('./regexSplit');
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/restaurantOneToOneApp');
let db = mongoose.connection;
db.on('error',(err)=> console.log('connection error'));
db.on('open',()=> console.log('mongodb connected'));
let Schema = mongoose.Schema;
let restaurantSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    restaurantID: {type : String, unquie : true},
    restaurantName: String,
    cuisine: String,
    averageCostForTwo: Number,
    currency : String,
    hasTableBooking: Boolean,
    hasOnlineDelivery: Boolean,
    aggregateRating: Number,
    ratingColor: String,
    ratingText: String,
    votes: String
});

let pointSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

let restaurantDetailsSchema = mongoose.Schema({
    restaurantID: {type : String, unquie : true},
    countryCode: String,
    city: String,
    address: String,
    locality: String,
    localityVerbose : String,
    location : {
        type: pointSchema,
        required: true
    },
    restaurantSpecifics: {type: Schema.Types.ObjectId, ref: 'restaurant'}
});

let restaurantModel = mongoose.model('restaurant', restaurantSchema);
let restaurantDetailsModel = mongoose.model('restaurantDetail', restaurantDetailsSchema);


// let restaurantDoc = new restaurantModel({
//     _id: new mongoose.Types.ObjectId,
//     restaurantID: '23786547',
//     restaurantName: 'thalapakati',
//     cuisine: 'Indian',
//     averageCostForTwo: 400,
//     currency : 'rupees',
//     hasTableBooking: true,
//     hasOnlineDelivery: false,
//     aggregateRating: 4.8,
//     ratingColor: 'green',
//     ratingText: 'excellent',
//     votes: '1092',
// });

// restaurantDoc.save((err, data)=>{
//     if(err) throw err;
//     else{
//         let restaurantDetailsDoc = new restaurantDetailsModel({
//             restaurantSpecifics: restaurantDoc._id,
//             restaurantID: '23786547',
//             countryCode: 'INR',
//             city: 'Coimbatore',
//             address: 'Avinashi road',
//             locality: 'Hope college',
//             localityVerbose : 'Hope college, peelamedu',
//             location : {
//                 type: 'Point',
//                 coordinates: [-111, 50]
//             }
//         });

//         restaurantDetailsDoc.save((err, data)=>{
//             if(err) throw err;
//             else{
//                 console.log('one to one mapping is done successfully');
//             }
//         })
//     }
// })

// const colorado = {
//     type: 'Polygon',
//     coordinates: [[
//         [-109, 41],
//         [-102, 41],
//         [-102, 37],
//         [-109, 37],
//         [-109, 41]
//     ]]
// };
// restaurantDetailsModel.find({
//     location : {
//         $geoWithin : {
//             $geometry: colorado
//         }
//     }
// })
//     .populate('restaurantSpecifics')
//         .exec()
//             .then(data=>{
//                 console.log(data);
//             })
//             .catch(err=> {
//                 throw err;
//             })


async function getFileData(fileName){
    return new Promise((resolve, reject)=>{
        fs.readFile(__dirname + '/../docs/' + fileName, 'utf8', (err, data)=>{
            if(err)reject(err);
            else resolve(data);
        })
    })
}

async function main(){
    let restaurantCsvData = await getFileData('restaurants.csv');
    //console.log(restaurantCsvData);
    let restaurantDetailsCsvData = await getFileData('restaurantsDetails.csv')
    //console.log(restaurantDetailsCsvData);

    let restaurantCsvDataList = restaurantCsvData.split('\r\n')[0].split('\n');
    restaurantCsvDataList.shift();
    restaurantCsvDataList.pop();
    // console.log(restaurantCsvDataList[0]);
    // console.log(restaurantCsvDataList[restaurantCsvDataList.length - 1]);

    let restaurantDetailsCsvDataList = restaurantDetailsCsvData.split('\r\n');
    restaurantDetailsCsvDataList.shift();
    restaurantDetailsCsvDataList.pop();
    // console.log(restaurantDetailsCsvDataList[0]);
    // console.log(restaurantDetailsCsvDataList[restaurantCsvDataList.length - 1]);
    let i = 0;
    restaurantCsvDataList.forEach(restaurant=>{
        let restaurantID = '';
        let restaurantName = '';
        let cuisine = '';
        let averageCostForTwo = '';
        let currency = '';
        let hasTableBooking = '';
        let hasOnlineDelivery = '';
        let aggregateRating = '';
        let ratingColor = '';
        let ratingText = '';
        let votes = '';
        let str = restaurant;
        [restaurantID, str] = lib.sliceTillComma(str);
        [restaurantName, str] = lib.sliceTillComma(str);
        [cuisine, str] = lib.sliceTillComma(str);
        [averageCostForTwo, str] = lib.sliceTillComma(str);
        [currency, str] = lib.sliceTillComma(str);
        [hasTableBooking, str] = lib.sliceTillComma(str);
        [hasOnlineDelivery, str] = lib.sliceTillComma(str);
        [aggregateRating, str] = lib.sliceTillComma(str);
        [ratingColor, str] = lib.sliceTillComma(str);
        [ratingText, str] = lib.sliceTillComma(str);
        [votes, str] = lib.sliceTillComma(str);

        restaurantDetailsCsvDataList.forEach(restaurantDetail=>{
            let str = restaurantDetail;
            let restaurantDetailsID = '';
            [restaurantDetailsID, str] = lib.sliceTillComma(str);
            if(restaurantID == restaurantDetailsID){
                // console.log(restaurantID, restaurantDetailsID);
                let countryCode = '';
                let city = '';
                let address = '';
                let locality = '';
                let localityVerbose = '';
                let longitude = '';
                let latitude = '';
                [countryCode, str] = lib.sliceTillComma(str);
                [city, str] = lib.sliceTillComma(str);
                [address, str] = lib.sliceTillComma(str);
                [locality, str] = lib.sliceTillComma(str);
                [localityVerbose, str] = lib.sliceTillComma(str);
                [longitude, str] = lib.sliceTillComma(str);
                [latitude, str] = lib.sliceTillComma(str);

                let restaurantDoc = new restaurantModel({
                    _id: new mongoose.Types.ObjectId,
                    restaurantID: restaurantID,
                    restaurantName: restaurantName,
                    cuisine: cuisine,
                    averageCostForTwo: parseFloat(averageCostForTwo),
                    currency : currency,
                    hasTableBooking: (hasTableBooking == 'Yes')? true : false,
                    hasOnlineDelivery: (hasOnlineDelivery == 'Yes')? true : false,
                    aggregateRating: parseFloat(aggregateRating),
                    ratingColor: ratingColor,
                    ratingText: ratingText,
                    votes: votes,
                });

                restaurantDoc.save((err, data)=>{
                    if(err) throw err;
                    else{
                        let restaurantDetailsDoc = new restaurantDetailsModel({
                            restaurantSpecifics: restaurantDoc._id,
                            restaurantID: restaurantDetailsID,
                            countryCode: countryCode,
                            city: city,
                            address: address,
                            locality: locality,
                            localityVerbose : localityVerbose,
                            location : {
                                type: 'Point',
                                coordinates: [longitude, latitude]
                            }
                        });

                        restaurantDetailsDoc.save((err, data)=>{
                            if(err) throw err;
                            else{
                                i++;
                                console.log(i + ' one to one mapping is done successfully');
                            }
                        })
                    }
                })
            }
        });
    });



}

main();