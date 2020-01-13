let lib = {};
// function getRestaurantObj(str){
//     let restaurantObj = {}
//     let cuisine = str.match(/"[a-z, ]+"/gi);
//     if(cuisine != null){
//         cuisine = cuisine.toString().replace(/\"/gi, "")
//     }
//     str = str.replace(/"[a-z, ]+"\,/gi, "");
//     let strArr = str.split(',');
//     restaurantObj.restaurantID=strArr[0]
//     restaurantObj.restaurantName=strArr[1]
//     restaurantObj.cuisine=(cuisine!=null)? cuisine : strArr[2];
//     restaurantObj.averageCostForTwo=(cuisine!=null)? strArr[2]: strArr[3];
//     restaurantObj.currency=(cuisine!=null)? strArr[3]: strArr[4];
//     restaurantObj.hasTableBooking=(cuisine!=null)? strArr[4]: strArr[5];
//     restaurantObj.hasOnlineDelivery=(cuisine!=null)? strArr[5]: strArr[6];
//     restaurantObj.aggregateRating=(cuisine!=null)? strArr[6]: strArr[7];
//     restaurantObj.ratingColor=(cuisine!=null)? strArr[7]: strArr[8];
//     restaurantObjratingText=(cuisine!=null)? strArr[8]: strArr[9];
//     restaurantObj.votes=(cuisine!=null)? strArr[9]: strArr[10];
//     return restaurantObj;
// }

lib.sliceTillComma = function(str){
    if(str.match(/(".+?"|.+?)?,/g) != null){
        let match = str.match(/,|(".+?"|.+?)?,/g)[0];
        let slicedMatch = match.slice(0, match.length-1);
        str = str.slice(match.length, str.length);
        return [slicedMatch, str];
    } else{
        return [str, str];
    }
}
//let str = '6304287,Izakaya Kikufuji,Japanese,1200,Botswana Pula(P),Yes,No,4.5,Dark Green,Excellent,591';
//let str = '6318506,Ooma,"Japanese, Sushi",1500,Botswana Pula(P),No,No,4.9,Dark Green,Excellent,365';
//console.log(getRestaurantObj(str));

// let restaurantID ='';
// let countryCode = '';
// let city = '';
// let address = '';
// let locality = '';
// let localityVerbose = '';
// let longitude = '';
// let latitude = '';
// let str = '6301290,162,Pasay City,"Building B, By The Bay, Seaside Boulevard, Mall of Asia Complex (MOA), Pasay City","SM by the Bay, Mall of Asia Complex, Pasay City","SM by the Bay, Mall of Asia Complex, Pasay City, Pasay City",120.9793333,14.54';
// [restaurantID, str] = [...sliceTillComma(str)];
// [countryCode, str] = [...sliceTillComma(str)];
// [city, str] = [...sliceTillComma(str)];
// [address, str] = [...sliceTillComma(str)];
// [locality, str] = [...sliceTillComma(str)];
// [localityVerbose, str] = [...sliceTillComma(str)];
// [longitude, str] = [...sliceTillComma(str)];
// [latitude, str] = [...sliceTillComma(str)];

// console.log(`${restaurantID}, ${countryCode}, ${city}, ${address}, ${locality}, ${localityVerbose}, ${longitude}, ${latitude}`);
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
let str = '17284211,Pearly\'s Famous Country Cookng,,0,Dollar($),No,No,3.4,Orange,Average,36';
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

module.exports = lib;