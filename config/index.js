exports.DB = {
    connection:`mongodb://localhost:27017/${ENV.DB.NAME}?retryWrites=true&w=majority`,
    options:{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //useCreateIndex: true,
    }
},

exports.ALLOWD = {
    Origin : '*',
    Methods : 'GET, POST, PUT, DELETE, OPTIONS',
    Headers : 'X-Requested-With, Content-Type, X-Token-Auth, Authorization, x-csrf-token'
}