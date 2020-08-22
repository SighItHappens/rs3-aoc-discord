module.exports = {
    name: 'ping',
    description: 'Ping!',
    displayHelp: false,
    execute(message, Discord, args) {
        message.channel.send('Pong.');
    },
};