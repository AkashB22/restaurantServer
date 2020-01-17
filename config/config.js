let env = process.env.NODE_ENV || 'development';
let config = require('./config.json');
let envConfig = config[env];
Object.keys(envConfig).forEach(key=>{
    process.env[key]= envConfig[key];
})

//"MONGODB_URI": "mongodb+srv://akash:Rajibalu@cluster0-6l2ig.mongodb.net/restaurantOneToOneApp?retryWrites=true&w=majority",