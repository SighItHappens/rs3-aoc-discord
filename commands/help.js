module.exports = {
    name: 'help',
    description: 'Get help on commands!',
    syntax: '!help (optional command name)',
    displayHelp: false,
    async execute(message, Discord, args) {
        if (args.length === 0) {

            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Commands List')

            client.commands.forEach((details, command) => {
                if (details.displayHelp) {
                    helpEmbed.addField(`!${details.name}`, `${details.description}\n\`${details.syntax}\`\n${details.warnings?'_'+details.warnings+'_':''}`);
                }
            })

            await message.channel.send(helpEmbed);
            return;
        }

        let commandName = args[0];

        if (!client.commands.has(commandName)) {
            await message.channel.send(`Please enter a valid command name!`);
            return;
        }

        const helpEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${commandName} Help`)
            .addField(`!${client.commands.get(commandName).name}`, `${client.commands.get(commandName).description}\n${client.commands.get(commandName).syntax}`);
        await message.channel.send(helpEmbed);

    },
};