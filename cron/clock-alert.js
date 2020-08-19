const axios = require('axios');

module.exports = {
    name: 'vos-alert',
    description: 'Alert !',
    async execute(client) {
        let config = {
            headers: {
                Authorization: 'Bearer ' + process.env.TWITTER_TOKEN
            }
        }

        let districts = [];
        let ravenSpawn = false;
        let vosFound = false;
        await axios.get(process.env.VOS_TWITTER_URL, config)
            .then(res => {
                    for (let tweet of res.data) {
                        console.log(tweet.text);
                        if (!vosFound && tweet.text.includes('Voice of Seren')) {
                            let words = tweet.text.split(' ');
                            districts.push(words[9]);
                            districts.push(words[11]);
                            vosFound = true;
                        }

                        if (tweet.text.includes('A raven has spawned in prif!')) {
                            ravenSpawn = true;
                        }
                    }
                }
            );

        const snapshot = await db.collection('vos-channels').get();
        snapshot.forEach((row) => {
            for (const district of districts) {
                client.channels.cache.get(row.data().channel_id).send(`<@&${row.data()['vos-roles'][district.toLowerCase()]}> The Voice of Seren is now active in the ${district} district.`);
            }

            if (ravenSpawn) {
                client.channels.cache.get(row.data().channel_id).send(`<@&${row.data()['raven-role']}> A raven has spawned in Priffdinas!`);
            }
        });
    },
};