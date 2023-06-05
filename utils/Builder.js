const { Client, GatewayIntentBits, Partials, EmbedBuilder, AttachmentBuilder,
    ActionRowBuilder, ButtonBuilder, ActivityType
} = require('discord.js');



async function createLastPlayed(albumName, songName, uri, played_at, albumCover){
    const row = new ActionRowBuilder();
    row.addComponents(new ButtonBuilder().setLabel("Open in Spotify").
        setStyle('Link').setURL(uri))
    let formattedDate = formatDate(played_at);
    const embed = new EmbedBuilder();
    embed.setTitle(songName).setImage(albumCover.url)
        .setDescription(albumName);
    embed.addFields({
    name: 'listened-at',
        value: formattedDate,
        inline: true
    },
        {
            name:'url',
            value: uri,
            inline: false
        }
)
    return {embed, row};
}

async function createListEmbed(data){
    const embed = new EmbedBuilder();
    embed.setTitle('List View').setDescription('last 20 songs played');
    embed.setColor("Blurple")
   data.forEach((info)=>{
        embed.addFields({
            name: `${info.trackAndArtistName}`,
            value: `from ${info.albumName}`,
        })
   })

    return embed;

}


function formatDate(played_at){
    const date = new Date(played_at)
    date.setHours(date.getHours()-3)
    const formattedDate = date.toLocaleString('en-US',{
        month: '2-digit',
        day: '2-digit',
        year: "numeric",
        hour: '2-digit',
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: 'short',
    }).replace(', GMT-03:00', '');
    return formattedDate;

}


function createRoles() {
    const roles =[
        {
            id:  '1103886768912216165',
            label: 'Red'
        },
        {
            id:  '1103886845764444190',
            label: 'Green'
        },
        {
            id:  '1103886895215292417',
            label: 'Blue'
        },

    ]

    return roles;
}

function createStatus() {
        const arr=[/*{
            name: 'you',
            type: ActivityType.Watching
        },
            {
                name: 'uhmmm',
                type:ActivityType.Playing
            },
            { name: 'you!',
                type: ActivityType.Listening    ,
            }*/,
            {
                name: '^_^',
            }]

    return arr;
}


function countGenres(genres){
    let genreCount ={};
    const flattedGenres = genres.flat()

    flattedGenres.forEach((genre)=>{
        const trimmedGenre = genre.trim();

        if(trimmedGenre.length ===0){
            return;
        }

        if(genreCount[trimmedGenre]){
            genreCount[trimmedGenre] = genreCount[trimmedGenre] + 1;
        } else {
            genreCount[trimmedGenre] = 1;
        }
    })


    let sortedGenres = Object.entries(genreCount).sort(function(a, b){
        if(a[1]>b[1]){
            return -1
        }
        if(a[1]<b[1]){
            return 1
        }
        return 0;
    })
    sortedGenres = sortedGenres.slice(0,10);
    return sortedGenres




}

async function mapData(data){
    const arr = []
    data.forEach((data)=>{
        let names='';
        const albumName = data.track.album.name
        const trackName = data.track.name
        const artistName = data.track.artists
        const playedAt = data.played_at;

        const formattedDate = formatDate(playedAt);
        artistName.forEach((artist, index)=>{
            names = names + artist.name
            if(index < artistName.length - 1){
                names = names + ', '
            }
        })
        arr.push({'trackAndArtistName': `${trackName}(${names}) played at ${formattedDate}`, 'albumName':albumName})
    })
    return arr;

}


async function mapToArtists(allTracks) {
    const newArr = []
    allTracks.forEach((topTrack) => {
        topTrack.artists.forEach((artist) => {
            newArr.push(artist.id)
        })

    })


    return newArr;
}


async function mapToSearchTracks(data){
    const returningArray=[]
    const tracksArray = data.tracks.items;
   /* console.log(tracksArray[0])*/
    tracksArray.forEach((track)=>{
        let artistArray=[]
        track.artists.forEach((artist)=>{
            artistArray.push(artist.name)
        })

        returningArray.push({trackName: track.name, artists: artistArray.toString(), albumName: track.album.name,
            external_urls: track.external_urls.spotify, albumCover: track.album.images[0].url, released: track.album.release_date,
        uri: track.uri})
    })

    return returningArray;
}


async function createSearchEmbed(data){

    const embed = new EmbedBuilder();
    const row = new ActionRowBuilder();
    row.addComponents(new ButtonBuilder().setLabel(`open in Spotify!`).setStyle('Link').setURL(data.external_urls))
    row.addComponents(new ButtonBuilder().setLabel(`Add to my playlist`).setStyle('Primary').setCustomId(data.uri))
    row.addComponents(new ButtonBuilder().setLabel('Lyrics').setStyle('Primary').setCustomId('lyrics'))
    embed.setTitle(`${data.trackName}`).setDescription(`from\n**${data.artists}**`)
        embed.addFields({
            name: `album: ${data.albumName}`,
            value: `released on ${data.released}`
        },
            {
                name: `url`,
                value: data.external_urls
            })
        .setImage(data.albumCover);
    embed.setColor("Blurple")


    return {'embed':embed, 'row': row};

}


async function testEmbed(){
    const embed = new EmbedBuilder()
    const row = new ActionRowBuilder();
    row.addComponents(new ButtonBuilder().setLabel('nya!').setCustomId('testing').setStyle('Primary'));
    embed.setTitle('tets').setDescription('lmfaotest')
    return {embed, row};
}


exports.testEmbed = testEmbed;
exports.createListEmbed = createListEmbed;
exports.createLastPlayed = createLastPlayed;
exports.formatDate = formatDate;
exports.getRoles = createRoles;
exports.countGenres = countGenres;
exports.createStatus = createStatus;
exports.mapData = mapData;
exports.mapToArtists = mapToArtists;
exports.mapToSearchTracks = mapToSearchTracks
exports.createSearchEmbed = createSearchEmbed;