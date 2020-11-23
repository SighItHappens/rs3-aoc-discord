module.exports = {
    name: 'hydrate',
    description: 'Remind the clan to hydrate!',
    syntax: '!hydrate (#channel-name)',
    displayHelp: true,
    execute(message, Discord, args) {
        if (args.length != 1) {
            message.channel.send('Please tag a channel you want to send this message to!');
            return;
        }

        let channelName = args[0];
        channelName = channelName.substr(2, channelName.length - 3);
        console.log(channelName);

        client.channels.cache.get(channelName).send('Remember to hydrate! :cup_with_straw:');

    },
};