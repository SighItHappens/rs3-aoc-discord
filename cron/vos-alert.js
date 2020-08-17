const axios = require('axios');
const {Client} = require('pg');

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
        await axios.get(process.env.VOS_TWITTER_URL, config)
            .then(res => {
                    for (let tweet of res.data) {
                        console.log(tweet.text);
                        if (tweet.text.includes('Voice of Seren')) {
                            let words = tweet.text.split(' ');
                            districts.push(words[9]);
                            districts.push(words[11]);
                            break;
                        }
                    }
                }
            );

        const pgClient = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });

        pgClient.connect();
        pgClient.query('SELECT CHANNEL_ID, AMLODD, CADARN, CRWYS, HEFIN, IORWERTH, ITHELL, MEILYR, TRAHAEARN FROM CHANNELS;', (err, res) => {
            if (err) throw err;
            console.log(districts);
            for (let row of res.rows) {
                console.log(row);
                for (const district of districts) {
                    client.channels.cache.get(row.channel_id).send(`<@&${row[district.toLowerCase()]}> The Voice of Seren is now active in the ${district} district.`);
                }
            }
            pgClient.end();
        });
    },
};