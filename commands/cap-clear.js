const storage = require('node-persist');

module.exports = {
    name: 'cap-clear',
    description: 'Clears list of capped members',
    async execute(message, Discord, args) {
        if (args.length == 1) {
            let userName = args[0];
            let cappedMembers = await storage.getItem('cappedMembers');

            for (let user of cappedMembers) {
                if (user.verified && user.rsn == userName) {
                    cappedMembers.splice(cappedMembers.indexOf(user), 1);
                } else if (!user.verified && user.recordedBy == userName) {
                    cappedMembers.splice(cappedMembers.indexOf(user), 1);
                }
            }
            await storage.setItem('cappedMembers', cappedMembers);

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
            await storage.setItem('cappedMembers', []);
            message.channel.send('The list of capped members has been cleared');
        }
    },
};