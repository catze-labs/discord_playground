const { Client, GatewayIntentBits, Message } = require('discord.js');
const { tweet_api_bearer, token } = require('../setting_variable.json');
var axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  console.log('Ready!');
});

// 슬래시 명령
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const { commandName, options } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  if (commandName === 'tweet-give-coin') {
    let tweetIds = options.get('link').value;
    tweetIds = tweetIds.split('?')[0];
    tweetIds = tweetIds.split('/');
    tweetIds = tweetIds[tweetIds.length - 1];

    try {
      var config = {
        method: 'get',
        url: `https://api.twitter.com/2/tweets/${tweetIds}`,
        headers: {
          'User-Agent': 'v2TweetLookupJS',
          authorization: `Bearer ${tweet_api_bearer}`,
        },
      };

      const tweetResult = await axios(config);
      const tweetResultData = tweetResult.data.data.text;

      if (tweetResultData.indexOf('@CybergalzNFT') > -1) {
        await interaction.reply('CyberGalz mentioned');
      } else {
        await interaction.reply('This tweet not contain Cybergalz mention');
      }
    } catch (e) {
      console.log(e);
      console.log('Get Tweet Error');
      await interaction.reply('Internal Server Error: Plz contact admin');
    }
  }

  if (commandName === 'members') {
    const guildId = interaction.guildId;

    // 길드 멤버 리스트 가져오기
    let memberList = [];
    let maxMemberId = 0;
    let result = '';
    const guild = client.guilds.cache.get(guildId);
    guild.members
      .list({
        limit: 1000,
      })
      .then((members) => {
        members.forEach((member) => {
          result += `${member.user.id}, ${member.user.username}, #${member.user.discriminator}\n`;
          maxMemberId = maxMemberId < member.id ? member.id : maxMemberId;
        });

        interaction.reply(result);
      })
      .catch((err) => {
        interaction.reply('member listup error');
      });
  }

  if (commandName === 'roles') {
    const guildId = interaction.guildId;
    let result = '';

    const guild = client.guilds.cache.get(guildId);
    guild.roles
      .fetch()
      .then((roles) => {
        roles.forEach((role) => {
          result += `${role.name} : ${role.id}\n`;
        });

        interaction.reply(result);
      })
      .catch((err) => {
        interaction.reply('role listup error');
      });
  }
});

// 이미지 올렸는지 확인
client.on('messageCreate', (msg) => {
  const attachmentsList = msg.attachments;
  let imgIsIncluded = false;

  attachmentsList.forEach((v) => {
    if (v.contentType === 'image/jpeg') {
      imgIsIncluded = true;
    }
  });

  if (imgIsIncluded) {
    // msg.reply("Img is included!");
    const channel = client.channels.cache.get(msg.channelId);
    channel.send('Img is included');
  }
});

client.on('guildMemberAdd', async (member) => {
  try {
    var config = {
      method: 'post',
      url: `http://localhost:8080/bot/newUser`,
      data: {
        uuid: msg.author.id,
      },
    };

    const result = await axios(config);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
});

client.login(token);
