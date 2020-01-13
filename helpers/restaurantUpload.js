let fs = require('fs');
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/restaurantApp');
let db = mongoose.connection;
db.on('error',(err)=> console.log('connection error'));
db.on('open',()=> console.log('mongodb connected'))

let restaurantSchema = mongoose.Schema({
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
let restaurantModel = mongoose.model('restaurant', restaurantSchema);

fs.readFile(__dirname + '/../docs/restaurants.csv', 'utf8', (err, data)=>{
    let totalData = data.split('\r\n').toString();
    let jsonDatas = totalData.split('\n');
    let headerRemovedJsonData = jsonDatas.slice(1, jsonDatas.length);
    for(let jsonData of headerRemovedJsonData){
        //console.log('data -----' + jsonData);
        if(jsonData != null && jsonData != ''){
            let cuisine = '';
            let jsonArrWithoutCuisine = '';
            let jsonArr = [];
            if((/\"([a-z\,].*)\"/gi).test(jsonData)){
                cuisine = jsonData.match(/\"([a-z\,].*)\"/gi).toString();
                cuisine = cuisine.replace(/\"/gi, "");
                jsonArrWithoutCuisine = jsonData.replace(/\,\"([a-z\,].*)\"/gi, "");
                jsonArr = jsonArrWithoutCuisine.split(',');
            } else{
                jsonArr = jsonData.split(',');
                cuisine = jsonArr.splice(2, 1).join('');
            }
            
            
            let jsonObj = new restaurantModel({
                restaurantID: jsonArr[0],
                restaurantName: jsonArr[1],
                cuisine: cuisine,
                averageCostForTwo: jsonArr[2],
                currency : jsonArr[3],
                hasTableBooking: (jsonArr[4] == 'Yes') ? true : false,
                hasOnlineDelivery: (jsonArr[5] == 'Yes') ? true : false,
                aggregateRating: jsonArr[6],
                ratingColor: jsonArr[7],
                ratingText: jsonArr[8],
                votes: jsonArr[9]
            });
            jsonObj.save((err, data)=>{
                if(err){
                    console.log('error saving data', err);
                } else{
                    console.log('data saved' + data);
                }
            });
        }
    }
})