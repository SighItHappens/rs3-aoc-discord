const discordUtils = require('../utilities/utils');

module.exports = {
    name: 'cap-edit',
    description: 'Edits the name of a capped member',
    syntax: '!cap-clear (current name) (new name)',
    displayHelp: true,
    async execute(message, Discord, args) {
        if (args.length === 2) {
            let oldName = args[0];
            let newName = args[1];

            const cappedMembersRef = db.collection('capped-members');
            const snapshot = await cappedMembersRef.where('server-id', '==', message.guild.id).limit(1).get();
            let documentId = snapshot.docs[0].id;
            let cappedObject = snapshot.docs[0].data();
            let cappedMembers = cappedObject['capped-members'];

            let found = false;
            for (let user of cappedMembers) {
                if (!user.rsn && user.recordedBy === oldName && !user.verified) {
                    user.recordedBy = newName;
                    found = true;
                    break;
                } else if (user.rsn && user.rsn === oldName && !user.verified) {
                    user.rsn = newName;
                    found = true;
                    break;
                }
            }

            if(!found) {
                await message.channel.send(`A cap request was not found for: ${oldName}`);
                return;
            }

            await cappedMembersRef.doc(documentId).update({'capped-members': cappedMembers});

            const capListEmbed = discordUtils.formCapListEmbed(Discord, cappedMembers);
            await message.channel.send(`${oldName} has been changed to ${newName} in the cap list!`, capListEmbed);

        } else {
            await message.channel.send('Please use the right syntax for this command.\n\n!cap-edit [existing name] [new name]');
        }
    },
};