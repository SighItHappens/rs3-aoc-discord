const { createWorker } = require('tesseract.js');

module.exports = {
    name: 'cap',
    description: 'Raise a cap request',
    syntax: '!cap (optional RSN)',
    warnings: 'Including a screenshot with this message will auto-verify the request',
    displayHelp: true,
    async execute(message, Discord, args) {
        let cappedUser = {};
        let capForOthers = false;
        logger.info(`${message.guild.id}: Cap request received`);

        if (message.attachments.size > 0) {
            logger.info(`${message.guild.id}: Processing with attachment`);
            for (let entry of message.attachments.entries()) {
                let imageUrl = entry[1].url;
                try {

                    logger.debug(`${message.guild.id}: Processing URL: ${imageUrl}`);
                    const worker = createWorker({
                        logger: m => logger.debug(m),
                    });

                    await worker.load();
                    await worker.loadLanguage('eng');
                    await worker.initialize('eng');
                    const { data: { text } } = await worker.recognize(imageUrl);
                    logger.debug(text);

                    cappedUser.verified = true;
                    cappedUser.recordedBy = 'Screenshot';
                    cappedUser.rsn = text.substring(text.indexOf('Clan System') + 12, text.indexOf('has capped') - 1);

                    await worker.terminate();

                } catch (e) {
                    logger.error(`${message.guild.id}: Error processing screenshot`);
                    cappedUser.verified = false;
                    cappedUser.recordedBy = message.author.username;

                    if (args.length > 0) {
                        cappedUser.rsn = args[0];
                        capForOthers = true;
                    }
                }
            }
        } else {
            logger.info(`${message.guild.id}: Processing without attachment`);
            cappedUser.verified = false;
            cappedUser.recordedBy = message.author.username;

            if (args.length > 0) {
                cappedUser.rsn = args[0];
                capForOthers = true;
            }
        }

        logger.info(`${message.guild.id}: Updating capped list`);
        const cappedMembersRef = db.collection('capped-members');
        const snapshot = await cappedMembersRef.where('server-id', '==', message.guild.id).limit(1).get();
        let documentId = snapshot.docs[0].id;
        let cappedObject = snapshot.docs[0].data();

        let cappedList = cappedObject['capped-members'];
        let addToList = true;

        for (let user of cappedList) {
            if (capForOthers && user.rsn === cappedUser.rsn) {
                addToList = false;
                break;
            } else if (!capForOthers && user.recordedBy === cappedUser.recordedBy && user.rsn === cappedUser.rsn) {
                addToList = false;
                break;
            }
        }

        logger.info(`${message.guild.id}: Saving capped list`);
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