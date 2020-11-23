module.exports = {
    name: 'hydrate',
    description: 'Remind the clan to hydrate!',
    syntax: '!hydrate (#channel-name)',
    displayHelp: true,
    execute(message, Discord, args) {
        print(message);
        message.channel.send('Remember to hydrate! <:cup_with_straw:780312397936066600:>');
    },
};