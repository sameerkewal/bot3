const {ActionRowBuilder, ButtonBuilder} = require("discord.js");
const {getRoles} = require("../../utils/Builder");
module.exports= {
    name: 'roles',
    description: 'roles-testinggg',

    callback: async (client, interaction) => {


            if (interaction.commandName === 'roles') {
                try {
                    const channel = await client.channels.cache.get('1102711105840754789')
                    if (!channel) return
                    interaction.reply('right channel!')
                    const row = new ActionRowBuilder();
                    let roles = getRoles()
                    roles.forEach((role) => {
                        row.components.push(
                            new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle('Primary')
                        )
                    })
                    await channel.send({
                        content: 'claim or remove role below',
                        components: [row]
                    });
                } catch (error) {
                    console.log(error)
                }
            }

        }



}