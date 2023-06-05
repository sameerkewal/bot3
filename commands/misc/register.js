module.exports={
    name: "register",
    description: "registers user",
    devOnly: true,

    callback: async(client, interaction)=>{
        if(interaction.commandName === 'register'){
            interaction.reply('https://testing-7c5bf.web.app.com')
        }
    }
}
