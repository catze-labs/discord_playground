const axios = require('axios');
require('dotenv').config();
module.exports = {
  ping: {
    async exec(interaction) {
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
        await interaction.editReply(
          'Internal Server Error. Plz Contact Admin.',
        );
      }
    },
  },

  regist: {
    async exec(interaction) {
      await interaction.deferReply();

      const config = {
        method: 'post',
        url: 'http://localhost:8080/bot/newUser',
        data: {
          uuid: interaction.member.id,
        },
      };

      try {
        const result = await axios(config);

        if (result.status == 201) {
          await interaction.editReply('Registered Sucess!');
        }
      } catch (e) {
        console.log(e);
        await interaction.editReply('Internal Server Error: Plz contact admin');
      }
    },
  },

  tweetgalz: {
    async exec(interaction) {
      const { commandName, options } = interaction;

      // tweet id parsing
      let tweetIds = options.get('link').value;
      tweetIds = tweetIds.split('?')[0];
      tweetIds = tweetIds.split('/');
      tweetIds = tweetIds[tweetIds.length - 1];

      await interaction.deferReply();
      try {
        var config = {
          method: 'get',
          url: `https://api.twitter.com/2/tweets/${tweetIds}`,
          headers: {
            'User-Agent': 'v2TweetLookupJS',
            authorization: `Bearer ${process.env.TWEET_API_BEARER}`,
          },
        };

        const tweetResult = await axios(config);
        const tweetResultData = tweetResult.data.data.text;

        // 텍스트에 @CybergalzNFT 가 존재하는가 판별
        if (tweetResultData.indexOf('@CybergalzNFT') > -1) {
          await interaction.editReply('CyberGalz mentioned');
          // TODO : Server 와 통신
        } else {
          await interaction.editReply(
            'This tweet not contain Cybergalz mention',
          );
        }
      } catch (e) {
        // 에러처리
        console.log(e);
        console.log('Get Tweet Error');
        await interaction.editReply('Internal Server Error: Plz contact admin');
      }
    },
  },

  rps: {
    async exec(interaction) {
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

      await interaction.deferReply();
      if (amount != 0) {
        try {
          const config = {
            method: 'post',
            url: 'http://localhost:8080/bot/updateCakeAmount',
            data: {
              uuid: interaction.member.id,
              reason: 'RPS result',
              amount: amount,
            },
          };
          const updateCakeAmountResult = await axios(config);
          const reqStatus = updateCakeAmountResult.status;

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
          await interaction.editReply(
            'Internal Server Error: Plz contact admin',
          );
        }
      } else {
        await interaction.editReply(drawString);
      }
    },
  },

  member: {
    exec(interaction) {
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
    },
  },
  roles: {
    exec(interaction) {
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
    },
  },
};
