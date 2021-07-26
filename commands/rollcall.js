var path = require("path");
const fileName = '../config.json';
var pathToJson = path.resolve(__dirname, fileName);
const file = require(pathToJson);

const activeRoleID = file.activeRole;
const sunbaeRoleID = file.sunbaeRole;
const rollCallID = file.rollcallRole;

module.exports = {
    commands: 'rollcall',
    callback:  async (message) => {


        if (message.author.bot) return
        const { content, channel } = message
        let text = content;

        var members = message.guild.members.cache;
        var rollcalled = 0;
        var activeMembers = 0;

        for (const [member, memberInfo] of members.entries()) {
            if(memberInfo.user.bot){
                continue;
            }


            if(!memberInfo.roles.cache.get(activeRoleID) && !memberInfo.roles.cache.get(sunbaeRoleID)){
                console.log([rollCallID]);
                memberInfo.roles.add([rollCallID]);
                rollcalled++;
            }
            else{
                activeMembers++;
            }
        }
        return channel.send(`Rollcall done. ${rollcalled} are in roll call. ${activeMembers} active members.`);
    }
}