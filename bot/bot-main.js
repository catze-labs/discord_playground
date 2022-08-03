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

// deploy-command.js 에서 등록한 슬래시 명령
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // 인터랙션에서 명령어와 옵션 parameter 가져옴
  const { commandName, options } = interaction;

  // demo - commands
  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  // 공식 계정 멘션된 트윗 할 경우
  if (commandName === 'tweet-give-coin') {
    // 트윗 id 파싱
    let tweetIds = options.get('link').value;
    tweetIds = tweetIds.split('?')[0];
    tweetIds = tweetIds.split('/');
    tweetIds = tweetIds[tweetIds.length - 1];

    // 요청
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

      // 텍스트에 @CybergalzNFT 가 존재하는가 판별
      if (tweetResultData.indexOf('@CybergalzNFT') > -1) {
        await interaction.reply('CyberGalz mentioned');
        // TODO : Server 와 통신
      } else {
        await interaction.reply('This tweet not contain Cybergalz mention');
      }
    } catch (e) {
      // 에러처리
      console.log(e);
      console.log('Get Tweet Error');
      await interaction.reply('Internal Server Error: Plz contact admin');
    }
  }

  // 멤버 목록 출력
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

  // 역할 목록 가져오기
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
// 모든 메세지를 훅으로 리스닝
client.on('messageCreate', async (msg) => {
  const attachmentsList = msg.attachments;
  let imgIsIncluded = false;

  // 첨부파일 리스트 확인해서 컨텐츠 타입이 이미지인지 확인
  attachmentsList.forEach((v) => {
    if (v.contentType === 'image/jpeg') {
      imgIsIncluded = true;
    }
  });

  // 만약 이미지가 올라왔을 경우
  if (imgIsIncluded) {
    // msg.reply("Img is included!");
    const channel = client.channels.cache.get(msg.channelId);
    channel.send('Img is included');
  }
});

// 서버에 신규 유저 유입 시 DB 에 만들기
client.on('guildMemberAdd', async (member) => {
  try {
    var config = {
      method: 'post',
      url: `http://localhost:8080/bot/newUser`,
      data: {
        uuid: member.id,
      },
    };

    const result = await axios(config);
    console.log(result.data);
  } catch (err) {
    console.log(err);
  }
});

client.login(token);