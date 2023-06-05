const {getNewAccessToken, getTopArtists} = require("../../APIS/getCurrentSong");
const {getRefreshToken, setRefreshToken} = require("../../utils/storage");
const {ApplicationCommandOptionType} = require("discord.js");
const {getTokens, addTokens} = require("../../APIS/firebase");
const {refreshAllTokensFinal} = require("../../APIS/discord");
module.exports={
    name:'top-artists',
    description: 'retrieves my top artists!',
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
        if(interaction.commandName === 'top-artists'){
            interaction.deferReply();
            let topArtists = [];

            const userid = interaction.member.user.id
            const {newSpotifyToken, errorResponse} = await refreshAllTokensFinal(userid)

            if(errorResponse){
                interaction.editReply(errorResponse.message)
                return;
            }

            const chosenOption = interaction.options.getString('timeframe')
            const {data} = await getTopArtists(newSpotifyToken, 0, chosenOption)
            const items = data.items;
            items.forEach((item)=>{
                topArtists.push(item.name)
            })
 topArtists = topArtists.slice(0, 10)
            topArtists = topArtists.toString().replace(/,/g, '\n');
            interaction.editReply((`Here are my top 10 artists in terms of ${chosenOption}:\n${topArtists}`))
        }
    }
}
