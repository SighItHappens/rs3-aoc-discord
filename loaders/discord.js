const fs = require('fs');
const cron = require("node-cron");
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync(process.cwd() + '/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Discord Connection Ready!');
});

client.on('message', message => {
    const prefix = process.env.PREFIX;
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, Discord, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }

});

const command = require('../cron/vos-alert');
client.commands.set(command.name, command);

cron.schedule("2 * * * *", function() {
    try {
        client.commands.get('vos-alert').execute(client);
    } catch (error) {
        console.error(error);
    }
});

client.login(process.env.DISCORD_TOKEN);