const discordUtils = require('../utilities/utils');

module.exports = {
    name: 'cap-list',
    description: 'Displays list of capped members',
    syntax: '!cap-list',
    displayHelp: true,
    async execute(message, Discord, args) {
        console.log(message);
        const cappedMembersRef = db.collection('capped-members');
        const snapshot = await cappedMembersRef.where('server-id', '==', message.guild.id).limit(1).get();
        let cappedObject = snapshot.docs[0].data();
        let cappedMembers = cappedObject['capped-members'];

        const capListEmbed = discordUtils.formCapListEmbed(Discord, cappedMembers);
        await message.channel.send(capListEmbed);
    },
};