const Log = require('./models/log');

const query = {}

query.log = (aUser) => {
    Log.findOne({"telegram_id" : aUser.telegram_id}, (err, foundUser) => {
        if(err){
            console.log(`error: ${err}`);     
        } else {
            if(foundUser) {
                console.log(`A known user (@${foundUser.username}) has made a request: update log`);
                foundUser.username = aUser.username;
                foundUser.last_use = new Date();
                foundUser.save();
            } else {
                 Log.create(aUser, (err, newUser) => {
                    if(err) {
                        console.log(`error: ${err}`);
                    } else {
                        console.log(`A new user used the bot (@${newUser.username})`);
                    }
                });
            }     
        }
    });   
};

query.getUserNumber = () => {   
    return Log.find({}).exec();
};

module.exports = query;