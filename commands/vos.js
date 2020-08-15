const axios = require('axios');

module.exports = {
    name: 'vos',
    description: 'Voice of Seren',
    async execute(message, Discord, args) {

        let config = {
            headers: {
                Authorization: 'Bearer ' + process.env.TWITTER_TOKEN
            }
        }

        let districts = [];
        await axios.get(process.env.VOS_TWITTER_URL, config)
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
            .setDescription('')
            .addField('Active Districts', districts, true);

        await message.channel.send(vosEmbed);
    },
};