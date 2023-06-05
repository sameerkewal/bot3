// Requirements and Variables
require('dotenv').config();
const keepAlive = require(`./server`);

const { Client, GatewayIntentBits, Partials, EmbedBuilder, AttachmentBuilder,
ActionRowBuilder, ButtonBuilder, ActivityType, Activity
} = require('discord.js');
const {getRecentlyPlayed, getNewAccessToken, getRecentlyTenPlayed, getTopArtists, addToPlaylist} = require("./APIS/getCurrentSong");
const {setAccessToken, getAccessToken, setRefreshToken, getRefreshToken} = require("./utils/storage");
const {createLastPlayed, formatDate, createListEmbed, getRoles, createStatus, testEmbed} = require("./utils/Builder");
const eventHandler=require('./handlers/eventHandler')
const {getSongOnGenius} = require("./APIS/genius");
const {getActualLyrics} = require("./APIS/genius");
const {getSong} = require("./APIS/genius");
const {getMoreTokens} = require("./APIS/firebase");

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

eventHandler(client);



client.on("ready", function(c) {
    console.log(`${c.user.username} is online`)
        /*let random = Math.floor(Math.random() * createStatus().length)*/
       client.user.setActivity({name: 'around',  type:ActivityType.Streaming, url: 'https://youtu.be/dQw4w9WgXcQ'});

})

/*client.on('messageCreate', (message) => {
    if(message.author.bot){
        return;
    }


})*/

client.on('interactionCreate', async (interaction) => {
   /* console.log(interaction)*/
   /* if (!interaction.isChatInputCommand()) return;*/







  /*  if(interaction.isButton()){
        try {

            const role = interaction.guild.roles.cache.get(interaction.customId);
            await interaction.deferReply({ephemeral: true})
            if (!role) {
                interaction.editReply({
                    content: "I could not find that role",
                })
                return;
            }
            const hasRole = interaction.member.roles.cache.has(role.id)
            if (hasRole) {
                await interaction.member.roles.remove(role);
                await interaction.editReply(`The role ${role}has been removed`)
                return;
            }
            await interaction.member.roles.add(role);
            await interaction.editReply(`The role ${role}has been added`)

        }catch(error){
            console.log(error)
        }
    }*/

    if(interaction.isButton()){

       if(interaction.customId.includes('spotify')){
           interaction.deferReply()
           let {access_token, refresh_token} = await getNewAccessToken(getRefreshToken());
           setRefreshToken(refresh_token);
           let results = await addToPlaylist([interaction.customId], access_token)
           interaction.editReply(results);
       }

       if(interaction.customId === 'lyrics'){

           interaction.deferReply()
           /*const {embed, row} = await testEmbed();
           interaction.update({embeds: [embed], components:[row]})*/


           const releaseDate = interaction.message.embeds[0].fields[0].value.replace('released on ', '')
           const songName = interaction.message.embeds[0].data.title
           const artistName = interaction.message.embeds[0].data.description.replace('from\n', '').replace(/\*/g, '')
          /* console.log(`artistName is ${artistName} and is ${artistName.length}`)*/
           const albumName = interaction.message.embeds[0].fields[0].name.replace('album: ', '')

           const id = await getSongOnGenius({songName, artistName,  albumName, releaseDate})
           const url = await getSong(id)
           const lyrics = await getActualLyrics(url)

           const maxLength = 1994;
           let startIndex = 0;

          while(startIndex < lyrics.length){
              const messagePart = lyrics.slice(startIndex, startIndex + maxLength)
              if(startIndex === 0){
                  await interaction.editReply('```'+ messagePart + '```');
                  startIndex = startIndex + maxLength;
              } else {
                  await interaction.followUp('```'+ messagePart + '```');
                  startIndex = startIndex + maxLength;
              }


          }



       }


    }

})

// Bot Login
client.login(getMoreTokens().discord_token);
keepAlive();


