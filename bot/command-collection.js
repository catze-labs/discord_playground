const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
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

  website: {
    async exec(interaction) {
      await interaction.reply('https://cybergalznft.com/');
    },
  },

  rules: {
    async exec(interaction) {
      // await interaction.deferReply();
      console.log('test');
      const ruleEmbed = new EmbedBuilder()
        .setColor('#FFD650')
        .setTitle('Rules')
        .setURL('https://cybergalznft.com/')
        .setDescription('This is an embed for the server rules')
        .addFields(
          { name: 'Keep 🔊》general in English', value: 'Be nice' },
          {
            name: 'Be respectful',
            value: 'Treat others like you want to be treated yourself',
          },
          { name: 'Be friendly', value: `Let's be positive always` },
          {
            name: 'Read the ❓》faq and 📢》announcement before asking questions',
            value: 'Be nice',
          },
          {
            name: 'Use the correct channels',
            value: 'No one likes a disjointed conversation 😉',
          },
          {
            name: `Be yourself. Don't impersonate moderators or admins`,
            value: 'Be nice',
          },
          {
            name: 'No NSFW content',
            value: 'This will result in an instant ban',
          },
          {
            name: 'No advertisements',
            value: `Don't share information or sell anything not related to Cyber Galz in this server`,
          },
          {
            name: 'Be wary of scams',
            value: `the @Galz Team won't DM you first`,
          },
        )
        .setImage(
          'https://d1fdloi71mui9q.cloudfront.net/tVwOKL1uTvWxry5A4Gnj_W9QsYsa9rstZ43yg',
        )
        .setFooter({ text: 'Make sure to check out the rules channel' });

      // interaction.user.roles.cache.has('993458489395531856')
      await interaction.reply({
        embeds: [ruleEmbed],
      });
    },
  },

  regist: {
    async exec(interaction) {
      await interaction.deferReply();

      const config = {
        method: 'post',
        url: 'http://localhost:8080/bot/newUser',
        data: {
          uuid: interaction.user.id,
          discordUsername: interaction.user.username,
          discriminator: interaction.user.discriminator,
          guildNickname: interaction.member.nickname,
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

  leaderboard: {
    async exec(interaction) {
      await interaction.deferReply();

      try {
        const config = {
          method: 'get',
          url: 'http://localhost:8080/bot/getCakeRank?skip=0&take=10',
        };

        const result = await axios(config);

        const rank = result.data.map((v) => {
          return {
            name: `${v.User.guildNickname} #${v.User.discriminator}`,
            value: `${v.cake} Cakes`,
          };
        });
        console.log(rank);

        const rankEmbed = new EmbedBuilder()
          .setColor('#FFD650')
          .setTitle('Cake Rank')
          .setDescription('CyberGalz Discord Cake Rank Leaderboard')
          .addFields(rank);

        await interaction.editReply({
          embeds: [rankEmbed],
        });
      } catch (e) {
        console.log(e);
        await interaction.editReply('Interal Server Error');
      }
    },
  },

  'my-cake': {
    async exec(interaction) {
      await interaction.deferReply();

      try {
        const config = {
          method: 'get',
          url: `http://localhost:8080/bot/getMyCake?uuid=${interaction.user.id}`,
        };

        const result = await axios(config);
        console.log(result.data);

        await interaction.editReply(
          `${interaction.member.nickname}'s Cake : ${result.data.cake} Cakes`,
        );
      } catch (e) {
        console.log(e);
        await interaction.editReply('Internal Server Error');
      }
    },
  },

  'daily-reward': {
    async exec(interaction) {
      await interaction.deferReply();
      const config = {
        method: 'post',
        url: 'http://localhost:8080/bot/updateCakeAmount',
        data: {
          amount: 1000,
          reason: 'DAILY_REWARD',
          uuid: interaction.user.id,
        },
      };

      try {
        await axios(config);
        await interaction.editReply('U Daily Checked!! Earned 1000 Cake');
      } catch (e) {
        console.log(e);
        const errorString = !e.response.data.message
          ? 'Internal Server Error: Plz contact admin'
          : e.response.data.message;

        await interaction.editReply(`${errorString}`);
      }
    },
  },

  work: {
    async exec(interaction) {
      await interaction.deferReply();

      const config = {
        method: 'post',
        url: 'http://localhost:8080/bot/updateCakeAmount',
        data: {
          amount: 100,
          reason: 'WORK',
          uuid: interaction.user.id,
        },
      };

      try {
        await axios(config);
        await interaction.editReply('U Worked! Earned 100 Cake');
      } catch (e) {
        console.log(e);
        const errorString = !e.response.data.message
          ? 'Internal Server Error: Plz contact admin'
          : e.response.data.message;

        await interaction.editReply(`${errorString}`);
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
        const tweetResult = await axios({
          method: 'get',
          url: `https://api.twitter.com/2/tweets/${tweetIds}`,
          headers: {
            'User-Agent': 'v2TweetLookupJS',
            authorization: `Bearer ${process.env.TWEET_API_BEARER}`,
          },
        });
        const tweetResultData = tweetResult.data.data.text;

        // 텍스트에 @CybergalzNFT 가 존재하는가 판별
        if (tweetResultData.indexOf('@CybergalzNFT') > -1) {
          // TODO : Server 와 통신
          await axios({
            method: 'post',
            url: 'http://localhost:8080/bot/updateCakeAmount',
            data: {
              amount: 100,
              uuid: interaction.user.id,
              reason: 'Tweet Cyber Galz!',
            },
          });

          await interaction.editReply('Cyber Galz mentioned! U gain 100 Cake!');
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
      try {
        const config = {
          method: 'post',
          url: 'http://localhost:8080/bot/updateCakeAmount',
          data: {
            uuid: interaction.user.id,
            reason: 'RPS',
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
        const errorString = !e.response.data.message
          ? 'Internal Server Error: Plz contact admin'
          : e.response.data.message;

        await interaction.editReply(`${errorString}`);
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