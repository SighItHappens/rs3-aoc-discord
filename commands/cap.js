const Tesseract = require('tesseract.js');

module.exports = {
    name: 'cap',
    description: 'Checking capping',
    async execute(message, Discord, args) {
        let cappedUser = {};
        let capForOthers = false;

        if (message.attachments.size > 0) {
            for (let entry of message.attachments.entries()) {
                let imageUrl = entry[1].url;
                try {
                    await Tesseract.recognize(
                        imageUrl,
                        'eng',
                        {}
                    ).then(({data: {text}}) => {
                        cappedUser.verified = true;
                        cappedUser.recordedBy = message.author.username;
                        cappedUser.rsn = text.substring(text.indexOf('Clan System') + 12, text.indexOf('has capped') - 1);
                    });
                } catch (e) {
                    cappedUser.verified = false;
                    cappedUser.recordedBy = message.author.username;

                    if (args.length > 0) {
                        cappedUser.rsn = args[0];
                        capForOthers = true;
                    }
                }
            }
        } else {
            cappedUser.verified = false;
            cappedUser.recordedBy = message.author.username;

            if (args.length > 0) {
                cappedUser.rsn = args[0];
                capForOthers = true;
            }
        }

        const cappedMembersRef = db.collection('capped-members');
        const snapshot = await cappedMembersRef.where('server-id', '==', message.guild.id).limit(1).get();
        let documentId = snapshot.docs[0].id;
        let cappedObject = snapshot.docs[0].data();

        let cappedList = cappedObject['capped-members'];
        let addToList = true;

        for (let user of cappedList) {
            if (capForOthers && user.rsn == cappedUser.rsn) {
                addToList = false;
                break;
            } else if (!capForOthers && user.recordedBy == cappedUser.recordedBy && user.rsn == cappedUser.rsn) {
                addToList = false;
                break;
            }
        }

        if (addToList) {
            cappedList.push(cappedUser);
            await cappedMembersRef.doc(documentId).update({'capped-members': cappedList});

            if (cappedUser.verified) {
                message.channel.send(`<@${message.author.id}>, thank you for capping! Capping has been verified for RSN: ${cappedUser.rsn}!`);
            } else if (capForOthers && !cappedUser.verified && cappedUser.rsn) {
                message.channel.send(`<@${message.author.id}>, capping has been recorded for RSN: ${cappedUser.rsn}!`);
            } else if (!cappedUser.verified && cappedUser.rsn) {
                message.channel.send(`<@${message.author.id}>, thank you for capping! Capping has been recorded for RSN: ${cappedUser.rsn}!`);
            } else {
                message.channel.send(`<@${message.author.id}>, thank you for capping!`);
            }
        } else {
            if (cappedUser.verified || (!cappedUser.verified && cappedUser.rsn)) {
                message.channel.send(`<@${message.author.id}>, a cap request has already been received for RSN: ${cappedUser.rsn}!`);
            } else {
                message.channel.send(`<@${message.author.id}>, a cap request for you has already been received!`);
            }
        }
    },
};