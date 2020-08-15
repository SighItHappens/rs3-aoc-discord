module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(message, Discord, args) {
        message.channel.send('Pong.');
    },
};