const {getRegisteredUserInfo, updateDiscordTokens} = require("../../APIS/firebase");
const {refreshDiscToken, refreshAllTokensFinal
} = require("../../APIS/discord");
const {getRecentlyPlayed} = require("../../APIS/getCurrentSong");
const {puppetteerMethod} = require("../../APIS/genius");

require('dotenv').config();
module.exports={
    name: "get-user-info",
    description: "gets your user info idk not much to explain",

    callback: async (client, interaction)=>{
        if(interaction.commandName === 'get-user-info'){
            interaction.deferReply();
            const startTime = Date.now();

         const userid = interaction.member.user.id
            let userInfo;

            const lyrics = await puppetteerMethod();
            await interaction.editReply({content: `ekek`})

            const endTime = Date.now();
            const responseTime = endTime - startTime;
            console.log(`the response time is ${responseTime}`)
        }

        }


}
