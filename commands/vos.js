const axios = require('axios');
const { token, url } = require('../config/config.json');

module.exports = {
    name: 'vos',
    description: 'Voice of Seren',
    async execute(message, Discord, args) {

        let config = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }

        let districts = [];
        await axios.get(url, config)
            .then(res => {
                for (let tweet of res.data) {
                    if (tweet.text.includes('Voice of Seren')) {
                        let words = tweet.text.split(' ');
                        districts.push(words[9]);
                        districts.push(words[11]);
                    }
                    break;
                }
            }
        );

        const vosEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Voice of Seren')
            .addField('Active Districts', districts, true)
            .setTimestamp();

        await message.channel.send(vosEmbed);
    },
};