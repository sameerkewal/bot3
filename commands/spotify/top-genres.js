const {getTopTracks, getNewAccessToken, getAllTopTracks, mapToArtists, getArtistGenres, getAllTopArtists,
    getAllTopArtistsAndTheirGenres
} = require("../../APIS/getCurrentSong");
const {getRefreshToken, setRefreshToken} = require("../../utils/storage");
const {countGenres} = require("../../utils/Builder");
const {ApplicationCommandOptionType} = require("discord.js");
const {getTokens, addTokens} = require("../../APIS/firebase");
const {refreshAllTokensFinal} = require("../../APIS/discord");
module.exports= {
        name: 'top-genres',
        description: 'get my top genres from the entirety of having my spotify account',
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

        callback: async (client, interaction) => {
                if (interaction.commandName === 'top-genres') {
                        const genresArray = []
                        interaction.deferReply('doesnt work probably never will looks complicated')
                    const chosenOption = interaction.options.getString('timeframe')
                    const userid = interaction.member.user.id
                    const {newSpotifyToken, errorResponse} = await refreshAllTokensFinal(userid)

                    if(errorResponse){
                        interaction.editReply(errorResponse.message)
                        return;
                    }

                    /*const topTracks = await getAllTopTracks(access_token);
                         const mapped = await mapToArtists(topTracks);
                         for (const id of mapped) {
                                 const genre = await getArtistGenres(id, access_token)
                                 genresArray.push(genre)
                         }*/




                    const topArtists = await getAllTopArtistsAndTheirGenres(newSpotifyToken, chosenOption)
                    const topGenres = countGenres(topArtists)

                    let onlyNamesOfGenres=[];
                    for(let i =0; i < topGenres.length; i++){
                        onlyNamesOfGenres.push(topGenres[i][0])
                    }

                    let returnString = onlyNamesOfGenres.toString().replace(/,/g, '\n');
                    console.log(returnString)
                    interaction.editReply({content: `*Note: There are in no particular order, however the first one is probably definitely the first one(retrieved by ${chosenOption}):*\n${returnString}`})

                 }
                }



}



