module.exports={
    name: 'count',
    description:'counting',

    callback: async(client, interaction)=>{



        if(interaction.commandName===`count`){
            let counter = 0;
            let allMessages = [];
            const channel = client.channels.cache.get('877949844453470249');
            let before = '1107848296988426322';

            while(true) {
                const messages = await channel.messages.fetch({limit: 100, before})
                if (messages.size === 0) {
                    break;
                }

                messages.forEach((message)=>{
                    if(message.content.includes('lmfao'))  {
                        console.log(message.content)
                    }
                })
                before = messages.last().id
                counter++

              /*  allMessages = [...allMessages, ...Array.from(messages.values())]
                console.log(allMessages)

*/
            }





            allMessages.forEach(message=>{
                if(message.content.contains('lmao')){
                    console.log(message.content)
                }
            })
        }
}
}