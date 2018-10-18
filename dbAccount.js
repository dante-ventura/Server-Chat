var mongoose = require('mongoose');

var accountSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
    profileImage: {type: String, default: "https://bulma.io/images/placeholders/128x128.png"}
});

accountSchema.statics.register = function(user, pass, profileImage, callback){
    var acc = new dbAccount({
        username: user,
        password: pass
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
    dbAccount.findOne({ username: user, password: pass }, function (err, acc) {
        if(!err && acc)
            callback(true, acc);
        else
            callback(false, null);
    });
}

accountSchema.statics.setProfileImage = function(user, pass, link, callback){
    dbAccount.findOne({ username: user, password: pass }, function (err, acc) {
        if(!err && acc){
            acc.profileImage = link;
            acc.save((err) => {
                if(!err)
                    callback(true);
                else
                    callback(false);
            })
        }
        else
            callback(false);
    });
}


module.exports = dbAccount = gamedb.model('account', accountSchema);
