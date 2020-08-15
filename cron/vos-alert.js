const {botchannel, vos, token, url} = require('../config/config.json');
const axios = require('axios');

module.exports = {
    name: 'vos-alert',
    description: 'Alert !',
    async execute(client) {

        let config = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }

        let districts = [];
        await axios.get(url, config)
            .then(res => {
                    for (let tweet of res.data) {
                        console.log(tweet.text);
                        if (tweet.text.includes('Voice of Seren')) {
                            let words = tweet.text.split(' ');
                            districts.push(words[9]);
                            districts.push(words[11]);
                        }
                        break;
                    }
                }
            );

        for (const channel of botchannel) {
            for (const district of districts) {
                client.channels.cache.get(channel).send(`<@&${vos[district]}> The Voice of Seren is now active in the ${district} district.`);
            }
        }

    },
};