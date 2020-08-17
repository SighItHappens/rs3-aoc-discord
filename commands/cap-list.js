const storage = require('node-persist');

module.exports = {
    name: 'cap-list',
    description: 'Clears list of capped members',
    async execute(message, Discord, args) {
        let cappedList = await storage.getItem('cappedMembers');

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