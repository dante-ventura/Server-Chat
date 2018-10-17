var mongoose = require('mongoose');

var accountSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
    profileImage: String  
});

accountSchema.statics.register = function(user, pass, profileImage, callback){
    var acc = new dbAccount({
        username: user,
        password: pass,
        profileImage: profileImage
    })

    acc.save((err) => {
        if(!err){
            callback(true);
        }
        else{
            callback(false);
        }
    })
}

accountSchema.statics.verify = function(user, pass, callback){
    dbAccount.countDocuments({ username: user, password: pass }, function (err, count) {
        if(!err && count > 0)
            callback(true);
        else
            callback(false);
    });
}


module.exports = dbAccount = gamedb.model('account', accountSchema);
