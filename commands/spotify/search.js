const {searchFunction, getNewAccessToken} = require("../../APIS/getCurrentSong");
const {getRefreshToken, setRefreshToken} = require("../../utils/storage");
const {mapToSearchTracks, createSearchEmbed} = require("../../utils/Builder");
const {ApplicationCommandOptionType} = require('discord.js');
const {getTokens, addTokens} = require("../../APIS/firebase");
const {refreshAllTokensFinal} = require("../../APIS/discord");
module.exports={
    name: 'search',
    description: 'testing this!',
    options: [{
        name: 'song-name',
        description: 'Provide the song name duh',
        type: ApplicationCommandOptionType.String,
        required: true
    },
        {
            name: 'artist-name',
            description: 'the artist that made the song name',
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name:'years',
            description: 'You can filter on a single year or a range (e.g. 1955-1960).',
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'genre',
            description: 'You can filter by genre(s)',
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'display-options',
            description: 'preview/album cover',
            type: ApplicationCommandOptionType.String,
            required: false,
            choices:[
                {
                    name:'preview',
                    value:'preview'
                },
                {
                    name:'album-cover',
                    value:'album-cover'
                }
            ]
        }
],


    callback: async(client, interaction)=>{
        if(interaction.commandName === 'search') {
            const songName = interaction.options.getString('song-name');
            const artistName = interaction.options.getString('artist-name');
            const yearRange = interaction.options.getString('years');
            const genre = interaction.options.getString('genre')
            const display = interaction.options.getString('display-options')
            const options = {'songName': songName, 'artistName': artistName, 'yearRange': yearRange,
            'genre': genre}
            interaction.deferReply()
            const userid = "165464938012344320"
            const {newSpotifyToken} = await refreshAllTokensFinal(userid)
            const result = await searchFunction(options, newSpotifyToken)
            if(result.tracks.total===0){
                interaction.editReply('No song with that name found unfortunately the Spotify search is not the best :(')
                return;
            }
            const searchedResult = await mapToSearchTracks(result);
         /*   console.log(searchedResult[0])*/

            if(display === 'preview'){
                interaction.editReply({
                    content: searchedResult[0].external_urls
                })
            } else {
                const {embed, row} = await createSearchEmbed(searchedResult[0])
                interaction.editReply({embeds: [embed], components:[row]})
            }



        }
}
}
