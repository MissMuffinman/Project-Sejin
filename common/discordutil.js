const got = require('got');

module.exports = {

    getMemberByUsername(message, username){
        var members = message.guild.members.cache;
        var user = message.client.users.cache.find(u => u.tag === username);
        console.log(`yes its me, user ${user}`);
        if(!user){
            return message.reply(`User ${username} not found`);
        }
        userID = user.id;
        return members.get(userID);
    },


    openFileAndDo(url, aFunction, message) {
        (async () => {
            try {
                const response = await got(url);
                console.log(response.body);
                var csv = response.body;
                var usernames = csv.split("\r\n");
                usernames.forEach(username => {
                    console.log(username);
                    var member = module.exports.getMemberByUsername(message, username);
                    aFunction(member);
                });
            } catch (error) {
                console.log(error.response.body);
            }
        })();
    }
};
