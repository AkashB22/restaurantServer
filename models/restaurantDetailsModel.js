let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let pointSchema = new Schema({
    type:{
        type: String,
        enum: ['Point'],
        required: true
    }, 
    coordinates: {
        type: [Number],
        required: true
    }
});

let restaurantDetailsSchemaOptions = {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}

let restaurantDetailsSchema = new Schema({
    restaurantID: {type : String, unquie : true},
    countryCode : Number, 
    city : String, 
    address : String, 
    locality : String, 
    localityVerbose : String, 
    location : {
        type: pointSchema,
        required: true
    },
    restaurantSpecifics: {type: Schema.Types.ObjectId, ref: 'restaurant'}
}, restaurantDetailsSchemaOptions);

let restaurantDetailsSchemaVirtual = restaurantDetailsSchema.virtual('coords');

restaurantDetailsSchemaVirtual.get(function(){
    return `${this.location.coordinates[0]}, ${this.location.coordinates[1]}`;
});

restaurantDetailsSchemaVirtual.set(function(coords){
    this.location.coordinates[0] = coords.lat;
    this.location.coordinates[1] = coords.long;
    return `${this.location.coordinates[0]}, ${this.location.coordinates[1]}`;
});

restaurantDetailsSchema.methods.getCoords = function(){
    return `methods ------ ${this.location.coordinates[0]}, ${this.location.coordinates[1]}`;
}


//Difference betwee virtual and method is, virtuals creates an actual fields on our data and methods are just functions attached to our schema
// restaurantDetailsSchema.method('getCoords', function(){
//     return `${this.latitude}, ${this.longitude}`;
// })

//statics works on our entire model whereas methods works on a single document
restaurantDetailsSchema.statics.findByCity = function(city, cb){
    this.find({city}, cb);
}

module.exports = mongoose.model('restaurantDetail', restaurantDetailsSchema);