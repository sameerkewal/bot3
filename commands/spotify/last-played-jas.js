const {main} = require("../../APIS/buddylist");
module.exports={

    name:"last-played",
    description: "returns the last song played",

    callback: async (client, interaction) => {
        if (interaction.commandName === 'last-played') {
            await interaction.deferReply()
            let {date, trackName, uri} = await main();
            await interaction.editReply({
                content: `last played at ${date}: https://open.spotify.com/track/${uri}`,
                ephemeral: false
            })
        }

    }

}
