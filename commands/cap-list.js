module.exports = {
    name: 'cap-list',
    description: 'Clears list of capped members',
    async execute(message, Discord, args) {
        const cappedMembersRef = db.collection('capped-members');
        const snapshot = await cappedMembersRef.where('server-id', '==', message.guild.id).limit(1).get();
        let cappedObject = snapshot.docs[0].data();
        let cappedList = cappedObject['capped-members'];

        const vosEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Capped List');

        for (let user of cappedList) {
            if (user.verified) {
                vosEmbed.addField(`RSN: ${user.rsn}`, 'Verified: :white_check_mark:\nVerified by: Screenshot');
            } else if (!user.verified && user.rsn) {
                vosEmbed.addField(`RSN: ${user.rsn}`, `Verified: :no_entry_sign:\nRequested by: ${user.recordedBy}`);
            } else {
                vosEmbed.addField(`Discord: ${user.recordedBy}`, 'Verified: :no_entry_sign:\nRequested by: Self');
            }
        }

        await message.channel.send(vosEmbed);
    },
};