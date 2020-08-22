module.exports = {
    formCapListEmbed:function(Discord, cappedMembers) {

        const capListEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Capped List');

        for (let user of cappedMembers) {
            if (user.verified) {
                capListEmbed.addField(`Name: ${user.rsn}`, `Verified: :white_check_mark:\nVerified by: ${user.recordedBy}`);
            } else if (!user.verified && user.rsn) {
                capListEmbed.addField(`Name: ${user.rsn}`, `Verified: :no_entry_sign:\nRequested by: ${user.recordedBy}`);
            } else {
                capListEmbed.addField(`Name: ${user.recordedBy}`, 'Verified: :no_entry_sign:\nRequested by: Self');
            }
        }

        return capListEmbed;
    }
}