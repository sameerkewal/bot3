const {getRegisteredUserInfo, updateDiscordTokens} = require("../../APIS/firebase");
const {refreshDiscToken, refreshAllTokensFinal
} = require("../../APIS/discord");
const {getRecentlyPlayed} = require("../../APIS/getCurrentSong");

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

            const {newSpotifyToken, errorResponse} = await refreshAllTokensFinal(userid)
            if(errorResponse){
                interaction.editReply(errorResponse.message)
                return;
            }
            const {songName} = await getRecentlyPlayed(newSpotifyToken);
            await interaction.editReply({content: ` ${songName}`})

            const endTime = Date.now();
            const responseTime = endTime - startTime;
            console.log(`the response time is ${responseTime}`)
        }

        }


}
