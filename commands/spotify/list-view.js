const {getNewAccessToken, getRecentlyTenPlayed} = require("../../APIS/getCurrentSong");
const {getRefreshToken, setRefreshToken} = require("../../utils/storage");
const {createListEmbed} = require("../../utils/Builder");
const {getTokens, addTokens} = require("../../APIS/firebase");
const {refreshAllTokensFinal} = require("../../APIS/discord");
module.exports={
    name: 'list-view',
    description: 'list view',

    callback: async(client, interaction)=>{
        if(interaction.commandName === 'list-view'){
            interaction.deferReply()
            const userid = interaction.member.user.id
            let userInfo;
            const {newSpotifyToken, errorResponse} = await refreshAllTokensFinal(userid);

            if(errorResponse){
                interaction.editReply(errorResponse.message)
                return;
            }



            const lists = await getRecentlyTenPlayed(newSpotifyToken);
            const embed = await createListEmbed(lists);
            interaction.editReply({embeds: [embed]});
        }
    }
}
