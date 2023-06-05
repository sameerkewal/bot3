const {getAllTopTracks, getNewAccessToken} = require("../../APIS/getCurrentSong");
const {getRefreshToken, setRefreshToken} = require("../../utils/storage");
const {ApplicationCommand} = require("discord.js");
const {ApplicationCommandOptionType} = require("discord.js");
const {getTokens, addTokens} = require("../../APIS/firebase");
const {refreshAllTokensFinal} = require("../../APIS/discord");
module.exports={
    name: 'top-tracks',
    description: 'my top 10 tracks uwu',
    options: [{
        name: 'timeframe',
        description: 'Like as in the last 4 weeks/6 months or all time',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [{
            name: '4 weeks',
            value: 'short_term'
        },
            {
                name: '6 months',
                value: 'medium_term'
            },
            {
                name: 'all time',
                value: 'long_term'
            }]

    }],



    callback: async(client, interaction)=>{
        if(interaction.commandName==='top-tracks'){
            interaction.deferReply()
            const chosenOption = interaction.options.getString(`timeframe`)

            const userid = interaction.member.user.id
            const {newSpotifyToken, errorResponse} = await refreshAllTokensFinal(userid)

            if(errorResponse){
                interaction.editReply(errorResponse.message)
                return;
            }

            let topTracks = []
            const tracks = await getAllTopTracks(newSpotifyToken, chosenOption)
            tracks.forEach((track)=>{
                topTracks.push(track.name)
            })

            topTracks = topTracks.splice(0, 10)
            topTracks = topTracks.toString().replace(/,/g, '\n');;
            interaction.editReply(`Here are my top 10 tracks in terms of ${chosenOption}:\n${topTracks}`)
        }
    }
}
