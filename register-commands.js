require('dotenv').config();
const{REST, Routes, Client, GatewayIntentBits, ApplicationCommandOptionType} = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const commands=[


    {
        name:"my-recently-played",
        description: "returns the last song played",
        options: [{
            name: 'display-options',
            description: 'preview/bigass album cover',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'preview',
                    value: 'preview'
                },
                {
                    name: 'album-cover',
                    value: 'album-cover'
                }
            ]
        }]
    },
    {
        name:"secret-command",
        description: "dont execute unless you want to die"
    },
    {
        name:"list-view",
        description: "Retrieves list view of MY last 20 played songs!! Slayyy!"
    },




];

client.on("ready", async()=>{
    console.log('logged in as ' + client.user.tag)
})

const rest = new REST({version: 9}).setToken(process.env.DISCORD_TOKEN);

async function registrateSlashCommandsInNimcoChamber(){
    try{
        console.log('Registering Slash Commands...')
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID_CHAMBER),
            {body: commands}
        )
        console.log('Slash Commands Registered successfully in nimcompoop chamber!!')
    }
    catch(error){
        console.log(`There was an error: ${error}`)
    }
}

async function registrateSlashCommandsInTestServer(){
    try{
        console.log('Registering Slash Commands...')
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {body: commands}
        )
        console.log('Slash Commands Registered successfully in test server(ss)!!')
    }
    catch(error){
        console.log(`There was an error: ${error}`)
    }
}


/*(async()=>{
    /!*await registrateSlashCommandsInNimcoChamber();*!/
    await registrateSlashCommandsInTestServer()
})()*/




(async()=>{
    rest.get(Routes.applicationGuildCommands(process.env.CLIENT_ID, '1102350189982920736'))
        .then(data => {
            const promises = [];
            for (const command of data) {
                const deleteUrl = `${Routes.applicationGuildCommands(process.env.CLIENT_ID, '1102350189982920736')}/${command.id}`;
                promises.push(rest.delete(deleteUrl));
            }
            return Promise.all(promises);
        });


})()
