const {ApplicationCommandOptionType, PermissionFlagsBits} = require('discord.js')

module.exports={
    name:'ban',
    description:'bans a member!!!',
    /* devOnly:Boolean
     testOnly:Boolean*/
    options:[{
        name: 'target-user',
        description: 'the user u wanna ban',
        required: true,
        type: ApplicationCommandOptionType.Mentionable
    },
        {
            name: 'reason',
            description: 'reason for ban',
            required: false,
            type: ApplicationCommandOptionType.String
        }
        ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],


callback: (client, interaction)=> {
    interaction.reply(`banned!`)
}
}