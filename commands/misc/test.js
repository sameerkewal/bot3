const {getGeniusToken, getSong} = require('../../APIS/genius')
const {getActualLyrics} = require("../../APIS/genius");
const {getSongOnGenius} = require("../../APIS/genius");
const {getResult} = require("../../APIS/scraper")

module.exports={
    name: 'test',
    description: 'test',

    callback: async(client,interaction)=>{
        if(interaction.commandName==='test'){
            await interaction.deferReply()
            const result = await getResult()
            console.log(result)
            await interaction.editReply(result)

        }
    }
}
