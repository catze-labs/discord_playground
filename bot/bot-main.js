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

  // server 와의 시간 리턴
  if (commandName === 'ping') {
    const startMill = new Date();
    let reqMill = null;

    // 봇 지연응답 으로 설정
    await interaction.deferReply();

    try {
      // 서버에 리퀘
      const pongReuslt = await axios({
        method: 'get',
        url: 'http://localhost:8080/ping',
      });

      // 응답 끝난 시간
      const doneMill = new Date();

      // 서버가 응답 받은 시간
      reqMill = new Date(pongReuslt.data);

      // 유저에게 응답
      await interaction.editReply(
        `Server ⬆️ : ${reqMill - startMill}ms \nServer ⬇️ : ${
          doneMill - reqMill
        }ms\nTotal : ${doneMill - startMill}ms`,
      );
    } catch (e) {
      console.log(e);
      await interaction.editReply('Internal Server Error. Plz Contact Admin.');
    }
  }

  // 공식 계정 멘션된 트윗 할 경우
  if (commandName === 'tweetgalz') {
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

      await interaction.deferReply();
      const tweetResult = await axios(config);
      const tweetResultData = tweetResult.data.data.text;

      // 텍스트에 @CybergalzNFT 가 존재하는가 판별
      if (tweetResultData.indexOf('@CybergalzNFT') > -1) {
        await interaction.editReply('CyberGalz mentioned');
        // TODO : Server 와 통신
      } else {
        await interaction.editReply('This tweet not contain Cybergalz mention');
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

  // 가위바위보
  if (commandName === 'rps') {
    // 랜덤으로 숫자 지정
    const randomRpsValue = Math.random() * (120 - 1) + 1;

    // 유저 케이크 토큰 변화량
    let amount = null;

    // 숫자에 범위에 따라 W/L/D
    if (randomRpsValue < 40) {
      // 유저 승리
      amount = 100;
    } else if (randomRpsValue > 40 && randomRpsValue <= 80) {
      // 유저 패배
      amount = -30;
    } else {
      // 비김
      amount = 0;
    }

    const drawString = `Draw! :p`;
    const winString = `You Win!!! You earned 100 of cake!! :)`;
    const loseString = `You Lose... You loss 30 of cake :(`;

    const config = {
      method: 'post',
      url: 'http://localhost:8080/bot/changeCakeAmount',
      data: {
        uuid: interaction.member.id,
        reason: 'RPS result',
        amount: amount,
      },
    };
    try {
      await interaction.deferReply();
      const changeCakeAmountResult = await axios(config);
      const reqStatus = changeCakeAmountResult.status;

      if (reqStatus == 201) {
        if (amount > 0) {
          await interaction.editReply(winString);
        } else if (amount < 0) {
          await interaction.editReply(loseString);
        } else {
          await interaction.editReply(drawString);
        }
      } else {
        throw new Error('');
      }
    } catch (e) {
      console.log(e);
      await interaction.reply('Internal Server Error: Plz contact admin');
    }
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
