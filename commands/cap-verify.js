const discordUtils = require('../utilities/utils');

module.exports = {
    name: 'cap-verify',
    description: 'Verifies a capped member',
    syntax: '!cap-verify (RSN/Discord Tag from cap-list)',
    displayHelp: true,
    async execute(message, Discord, args) {
        const cappedMembersRef = db.collection('capped-members');
        const snapshot = await cappedMembersRef.where('server-id', '==', message.guild.id).limit(1).get();
        let guildObject = snapshot.docs[0].data();
        let adminRoles = guildObject['admin-role-id'];

        let access = false;
        for (let role of adminRoles) {
            if (message.member.roles.cache.has(role)) {
                access = true;
                break;
            }
        }

        if (!access) {
            await message.channel.send(`Only an admin can access this command`);
            return;
        }

        if (args.length === 1) {
            let userName = args[0];

            const cappedMembersRef = db.collection('capped-members');
            const snapshot = await cappedMembersRef.where('server-id', '==', message.guild.id).limit(1).get();
            let documentId = snapshot.docs[0].id;
            let cappedObject = snapshot.docs[0].data();
            let cappedMembers = cappedObject['capped-members'];

            for (let user of cappedMembers) {
                if (!user.rsn && user.recordedBy === userName && !user.verified) {
                    user.rsn = userName;
                    user.verified = true;
                    user.recordedBy = message.author.username;
                    break;
                } else if (user.rsn && user.rsn === userName && !user.verified) {
                    user.verified = true;
                    user.recordedBy = message.author.username;
                    break;
                } else if ((user.verified && !user.rsn && user.recordedBy === userName) || (user.verified && user.rsn && user.rsn === userName)) {
                    await message.channel.send(`${userName} is already verified!`);
                    return;
                }
            }

            await cappedMembersRef.doc(documentId).update({'capped-members': cappedMembers});

            const capListEmbed = discordUtils.formCapListEmbed(Discord, cappedMembers);
            await message.channel.send(`${userName} has been verified for the cap list!`, capListEmbed);

        } else {
            await message.channel.send('Please include the RSN/Discord name of who you want verified!');
        }
    },
};