module.exports= {
    name: 'pong',
    description: 'ping-pong',
    /* devOnly:Boolean
     testOnly:Boolean*/
    //options:[]


    callback: async (client, interaction) => {
        await interaction.deferReply();
        const reply = await interaction.fetchReply();

        const ping = reply.createdTimestamp - interaction.createdTimestamp;


        interaction.editReply(`Pong! ${ping}ms | WebSocket: ${client.ws.ping}`)
    },

}
