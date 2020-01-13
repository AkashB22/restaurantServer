let fs = require('fs');
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/restaurantApp');
let db = mongoose.connection;
db.on('error',(err)=> console.log('connection error'));
db.on('open',()=> console.log('mongodb connected'))

let restaurantDetailsSchema = mongoose.Schema({
    restaurantID: {type : String, unquie : true},
    countryCode: String,
    city: String,
    address: String,
    locality: String,
    localityVerbose : String,
    longitude: Number,
    latitude: Number,
});
let restaurantDetailsModel = mongoose.model('restaurantDetails', restaurantDetailsSchema);

fs.readFile(__dirname + '/restaurant_addc9a1430.csv', 'utf8', (err, data)=>{
    let totalData = data.split('\r\n').toString();
    let jsonDatas = totalData.split('\n');
    let headerRemovedJsonData = jsonDatas.slice(1, jsonDatas.length);
    for(let jsonData of headerRemovedJsonData){
        //console.log('data -----' + jsonData);
        if(jsonData != null && jsonData != ''){
            let restaurantID = '';
            let countryCode = '';
            let city = '';
            let locality = '';
            let localityVerbose = '';
            let longitude = 0;
            let latitude = 0;
            let address = '';
            //console.log(jsonData);       
            let strArr = jsonData.match(/\"[^\"]*\"/gi);
            if(strArr.length == 3){
                address = strArr[0].replace(/\"/gi, "");
                locality = strArr[1].replace(/\"/gi, "");
                localityVerbose = strArr[2].replace(/\"/gi, "");
                let strWithoutAdd = jsonData.replace(/\,\"[^\"]*\"/gi, "");
                let strArrWithoutAdd = strWithoutAdd.split(',');
                restaurantID = strArrWithoutAdd[0];
                countryCode = strArrWithoutAdd[1];
                city = strArrWithoutAdd[2];
                longitude = strArrWithoutAdd[3];
                latitude = strArrWithoutAdd[4];
            } else if(strArr.length == 2){
                address = strArr[0].replace(/\"/gi, "");
                localityVerbose = strArr[1].replace(/\"/gi, "");
                let strWithoutAdd = jsonData.replace(/\,\"[^\"]*\"/gi, "");
                let strArrWithoutAdd = strWithoutAdd.split(',');
                restaurantID = strArrWithoutAdd[0];
                countryCode = strArrWithoutAdd[1];
                city = strArrWithoutAdd[2];
                locality = strArrWithoutAdd[3];
                longitude = strArrWithoutAdd[4];
                latitude = strArrWithoutAdd[5];
            } 

            let jsonObj = new restaurantDetailsModel({
                restaurantID: restaurantID,
                countryCode: countryCode,
                city: city,
                address: address,
                locality: locality,
                localityVerbose : localityVerbose,
                longitude: longitude,
                latitude: latitude,
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