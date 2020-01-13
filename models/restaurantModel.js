let mongoose = require('mongoose');
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
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

module.exports = mongoose.model('restaurant', restaurantSchema);