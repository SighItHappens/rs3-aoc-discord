module.exports = {
    name: 'anon',
    description: 'Send an anonymous message to the venting channel!',
    displayHelp: false,
    execute(message, Discord, args) {

        let replyMessage = ''
        for (const arg in args) {
            replyMessage += arg + ' '
        }
        client.channels.cache.get('779499900706226226').send(replyMessage);

        message.channel.send('Your message has been posted!');
    },
};