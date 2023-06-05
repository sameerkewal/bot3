const {getNewAccessToken, getRecentlyPlayed} = require("../../APIS/getCurrentSong");
const {getRefreshToken, setRefreshToken} = require("../../utils/storage");
const {createLastPlayed, formatDate} = require("../../utils/Builder");
const {ApplicationCommandOptionType} = require("discord.js");
const {addTokens, getTokens} = require("../../APIS/firebase");
const {refreshAllTokensFinal} = require("../../APIS/discord");

module.exports={

    name:"my-recently-played",
        description: "returns the last song played by me!",
    options: [{
    name: 'display-options',
    description: 'preview/bigass album cover',
    type: ApplicationCommandOptionType.String,
    required: true,
    choices: [
        {
            name: 'preview',
            value: 'preview'
        },
        {
            name: 'album-cover',
            value: 'album-cover'
        }
    ]
}],
    callback: async(client, interaction)=>{
        if(interaction.commandName==='my-recently-played'){
            interaction.deferReply()
            const userid = interaction.member.user.id
            const {newSpotifyToken, errorResponse} = await refreshAllTokensFinal(userid)


            if(errorResponse){
                interaction.editReply(errorResponse.message)
                return;
            }

            let {albumName, songName, uri, played_at, albumCover} = await getRecentlyPlayed(newSpotifyToken);
            const chosenOption = interaction.options.getString('display-options')


            if (chosenOption === 'album-cover') {
                const {embed, row} = await createLastPlayed(albumName, songName, uri, played_at, albumCover);
                interaction.editReply(({embeds: [embed], components: [row]}))
            } else {
                let formattedDate = formatDate(played_at);
                interaction.editReply(`Listened at ${formattedDate}: ${uri}`)
            }
        }
    }


}
