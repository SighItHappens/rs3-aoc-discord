module.exports = {
    name: 'cap-clear',
    description: 'Clears list of capped members',
    async execute(message, Discord, args) {
        if (args.length == 1) {
            let userName = args[0];

            const cappedMembersRef = db.collection('capped-members');
            const snapshot = await cappedMembersRef.where('server-id', '==', message.guild.id).limit(1).get();
            let documentId = snapshot.docs[0].id;
            let cappedObject = snapshot.docs[0].data();

            let cappedMembers = cappedObject['capped-members'];

            for (let user of cappedMembers) {
                if (!user.rsn && user.recordedBy == userName) {
                    cappedMembers.splice(cappedMembers.indexOf(user), 1);
                } else if (user.rsn && user.rsn == userName) {
                    cappedMembers.splice(cappedMembers.indexOf(user), 1);
                }
            }

            await cappedMembersRef.doc(documentId).update({'capped-members': cappedMembers});

            const vosEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Capped List');

            for (let user of cappedMembers) {
                if (user.verified) {
                    vosEmbed.addField(`RSN: ${user.rsn}`, 'Verified: :white_check_mark:\nVerified by: Screenshot');
                } else if (!user.verified && user.rsn) {
                    vosEmbed.addField(`RSN: ${user.rsn}`, `Verified: :no_entry_sign:\nRequested by: ${user.recordedBy}`);
                } else {
                    vosEmbed.addField(`Discord: ${user.recordedBy}`, 'Verified: :no_entry_sign:\nRequested by: Self');
                }
            }

            await message.channel.send(`${userName} has been cleared for the cap list!`, vosEmbed );

        } else {
            const cappedMembersRef = db.collection('capped-members');
            const snapshot = await cappedMembersRef.where('server-id', '==', message.guild.id).limit(1).get();
            await cappedMembersRef.doc(snapshot.docs[0].id).update({'capped-members': []});
            message.channel.send('The list of capped members has been cleared');
        }
    },
};