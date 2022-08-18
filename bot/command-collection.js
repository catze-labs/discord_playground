const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
require('dotenv').config();
module.exports = {
  ping: {
    async exec(interaction) {
      const startMill = Date.now();
      let reqMill = null;

      // 봇 지연응답 으로 설정
      await interaction.deferReply();

      try {
        // 서버에 리퀘
        const pongReuslt = await axios({
          method: 'get',
          url: process.env.API_URL + '/ping',
        });

        // 응답 끝난 시간
        const doneMill = Date.now();

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

  'yooldo-status': {
    async exec(interaction) {
      await interaction.deferReply();

      try {
        console.log('test');
        const result = await axios({
          method: 'get',
          url: 'https://dev.by-catze.xyz/health',
        });

        if (result.data['health']) {
          await interaction.editReply('Yooldo-Server Status : Normal');
        }
      } catch (e) {
        await interaction.editReply('Yooldo-Server Status : Abnormal');
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
        .setFooter({
          text: 'Make sure to check out the rules channel',
        });

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
        url: process.env.API_URL + '/bot/newUser',
        data: {
          uuid: interaction.user.id,
          discordUsername: interaction.user.username,
          discriminator: interaction.user.discriminator,
          guildNickname:
            interaction.member.nickname == null
              ? interaction.user.username
              : interaction.member.nickname,
          roleList: interaction.member._roles,
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
          url: process.env.API_URL + '/bot/getCakeRank?skip=0&take=10',
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
          url: `http://localhost:8080/bot/getUserCake?uuid=${interaction.user.id}`,
        };

        const result = await axios(config);

        const nickname =
          interaction.member.nickname == null
            ? interaction.user.username
            : interaction.member.nickname;
        await interaction.editReply(
          `${nickname}'s Cake : ${result.data.cake} Cakes`,
        );
      } catch (e) {
        console.log(e);
        await interaction.editReply('Internal Server Error');
      }
    },
  },

  'my-cake-history': {
    async exec(interaction) {
      await interaction.deferReply();

      const count = interaction.options.get('count').value;
      try {
        const config = {
          method: 'get',
          url:
            process.env.API_URL +
            `/bot/getUserCakeHistoryList?uuid=${interaction.user.id}&count=${count}`,
        };

        const result = await axios(config);

        const parsedList = result.data.map((v) => {
          return {
            name: v.createdAt,
            value: `Reason : ${v.reason} \nAmount : ${v.changeAmount}`,
          };
        });

        console.log(parsedList);

        const resultEmbed = new EmbedBuilder()
          .setColor('#FFD650')
          .setTitle(`User #${interaction.user.id} cake history`)
          .setDescription('Cake history')
          .addFields(...parsedList);

        await interaction.editReply({
          embeds: [resultEmbed],
        });
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
        url: process.env.API_URL + '/bot/updateCake',
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
        url: process.env.API_URL + '/bot/updateCake',
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
          const result = await axios({
            method: 'post',
            url: process.env.API_URL + '/bot/updateCake',
            data: {
              amount: 100,
              uuid: interaction.user.id,
              reason: 'Tweet Cyber Galz!',
            },
          });

          const transactionIdList = result.data.transaction_id_list.map(
            (v) => '#' + v,
          );
          const resultEmbed = new EmbedBuilder()
            .setColor('#FFD650')
            .setTitle('Tweet @CybergalzNFT')
            .setDescription(
              `Transaction ${transactionIdList.join(
                ', ',
              )} : twitter mentioned @CybergalzNFT`,
            )
            .addFields(
              { name: 'Beneficiary', value: interaction.user.id },
              {
                name: 'Amount',
                value: 100 + '',
              },
              {
                name: 'Transaction Approved Date',
                value: new Date().toString(),
              },
            );

          await interaction.editReply({
            embeds: [resultEmbed],
          });
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

  'ootd-upload': {
    async exec(msg) {
      // 채널 확인하는 작업 필요

      const amount = 100;
      console.log(process.env.API_URL);

      try {
        const config = {
          method: 'post',
          url: process.env.API_URL + '/bot/updateCake',
          data: {
            uuid: msg.author.id,
            reason: 'OOTD_UPLOAD',
            amount: amount,
          },
        };

        await axios(config);
        msg.reply('OOTD Upload Success! U earn 100 cakes!');
      } catch (e) {
        console.log(e);
        msg.reply('Internal Server Error. Plz Contact admin');
      }
    },
  },

  send: {
    async exec(interaction) {
      await interaction.deferReply();

      const options = interaction.options;
      const sender = interaction.user.id;
      const receiver = options.get('receiver').member.user.id;
      const amount = options.get('amount').value;

      if (amount <= 0) {
        await interaction.editReply('Send amount should over 0');
        return;
      }

      try {
        const config = {
          method: 'post',
          url: process.env.API_URL + '/bot/sendCake',
          data: {
            sender,
            receiver,
            amount,
          },
        };
        const result = await axios(config);

        // udpate cake history id list
        const transactionIdList = result.data.transaction_id_list.map(
          (v) => '#' + v,
        );

        const resultEmbed = new EmbedBuilder()
          .setColor('#FFD650')
          .setTitle('Send Cake to User')
          .setDescription(
            `Transaction ${transactionIdList.join(', ')} : send a cake`,
          )
          .addFields(
            { name: 'From', value: sender },
            { name: 'To', value: receiver },
            {
              name: 'Amount',
              value: amount + '',
            },
            {
              name: 'Transaction Approved Date',
              value: new Date().toString(),
            },
          );

        await interaction.editReply({
          embeds: [resultEmbed],
        });
      } catch (e) {
        console.log(e);
        await interaction.editReply('Internal Server Error');
      }
    },
  },

  give: {
    async exec(interaction) {
      await interaction.deferReply();

      // 권한
      if (interaction.user.id != '1003617859357904916') {
        await interaction.editReply(`You're not administrator`);
        return;
      }

      const options = interaction.options;
      const receiver = options.get('receiver').member.user.id;
      const amount = options.get('amount').value;
      const reason = options.get('reason').value;

      try {
        const config = {
          method: 'post',
          url: process.env.API_URL + '/bot/updateCake',
          data: {
            uuid: receiver,
            reason: `GIVE ${reason}`,
            amount: amount,
          },
        };
        const result = await axios(config);
        const transactionIdList = result.data.transaction_id_list.map(
          (v) => '#' + v,
        );

        const resultEmbed = new EmbedBuilder()
          .setColor('#FFD650')
          .setTitle('Give Cake to User')
          .setDescription(
            `Transaction ${transactionIdList.join(', ')} : give a cake`,
          )
          .addFields(
            { name: 'To', value: receiver },
            {
              name: 'Amount',
              value: amount + '',
            },
            { name: 'Reason', value: `${reason}` },
            {
              name: 'Transaction Approved Date',
              value: new Date().toString(),
            },
          );

        await interaction.editReply({
          embeds: [resultEmbed],
        });
      } catch (e) {
        console.log(e);
      }
    },
  },

  take: {
    async exec(interaction) {
      await interaction.deferReply();

      // 권한
      if (interaction.user.id != '1003617859357904916') {
        await interaction.editReply(`You're not administrator`);
        return;
      }

      const options = interaction.options;
      const target = options.get('target').member.user.id;
      const amount = options.get('amount').value;
      const reason = options.get('reason').value;

      try {
        const config = {
          method: 'post',
          url: process.env.API_URL + '/bot/updateCake',
          data: {
            uuid: target,
            reason: `TAKE ${reason}`,
            amount: -amount,
          },
        };
        const result = await axios(config);

        const transactionIdList = result.data.transaction_id_list.map(
          (v) => '#' + v,
        );
        const resultEmbed = new EmbedBuilder()
          .setColor('#FFD650')
          .setTitle('Confiscate Cake from User')
          .setDescription(
            `Transaction ${transactionIdList.join(', ')} : confiscate a cake`,
          )
          .addFields(
            { name: 'Target User', value: target },
            {
              name: 'Amount',
              value: -amount + '',
            },
            { name: 'Reason', value: `${reason}` },
            {
              name: 'Transaction Approved Date',
              value: new Date().toString(),
            },
          );

        await interaction.editReply({
          embeds: [resultEmbed],
        });
      } catch (e) {
        console.log(e);
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
          url: process.env.API_URL + '/bot/updateCake',
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

  'rps-bet': {
    async exec(interaction) {
      // 랜덤으로 숫자 지정
      const options = interaction.options;
      const betAmount = options.get('bet').value;
      const randomRpsValue = Math.random() * (120 - 1) + 1;

      // 유저 케이크 토큰 변화량
      let amount = null;

      // 숫자에 범위에 따라 W/L/D
      if (randomRpsValue < 40) {
        // 유저 승리
        amount = betAmount * 2;
      } else if (randomRpsValue > 40 && randomRpsValue <= 80) {
        // 유저 패배
        amount = -betAmount;
      } else {
        // 비김
        amount = 0;
      }

      const drawString = `Draw! :p`;
      const winString = `You Win!!! You earned ${amount} of cake!! :)`;
      const loseString = `You Lose... You loss ${amount} of cake :(`;

      await interaction.deferReply();
      try {
        // 유저가 가지고 있는 케이크 확인
        const config1 = {
          method: 'get',
          url: `http://localhost:8080/bot/getUserCake?uuid=${interaction.user.id}`,
        };

        // 베팅할 케이크 > 가지고있는 케이크
        const result = await axios(config1);
        if (result.data.cake < betAmount) {
          await interaction.editReply('Not enough cake to bet');
          return;
        }

        // 베팅할 케이크 < 가지고있는 케이크
        const config2 = {
          method: 'post',
          url: process.env.API_URL + '/bot/updateCake',
          data: {
            uuid: interaction.user.id,
            reason: 'RPS_BET',
            amount: amount,
          },
        };
        const updateCakeAmountResult = await axios(config2);
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

  dice: {
    async exec(interaction) {
      let diceNumber = interaction.options.get('number');
      let amount = interaction.options.get('bet').value;
      const randomValue = Math.random() * (120 - 1) + 1;

      if (
        randomValue < diceNumber * 20 &&
        randomValue > (diceNumber - 1) * 20
      ) {
        amount *= 2;
      } else {
        amount *= -1;
      }

      await interaction.deferReply();
      try {
        const config = {
          method: 'post',
          url: process.env.API_URL + '/bot/updateCake',
          data: {
            uuid: interaction.user.id,
            reason: 'DICE',
            amount: amount,
          },
        };
        const result = await axios(config);
        const reqStatus = result.status;

        if (reqStatus == 201) {
          if (amount > 0) {
            await interaction.editReply(
              `You Win! You earned ${amount} of cakes! `,
            );
          } else if (amount < 0) {
            await interaction.editReply(
              `You lose.. You loses ${amount * -1} of cakes`,
            );
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

  roulette: {
    async exec(interaction) {
      let amount = interaction.options.get('bet').value;
      const randomValue = Math.random() * (100 - 1) + 1;

      if (randomValue > 50) {
        amount *= 2;
      } else {
        amount *= -1;
      }

      await interaction.deferReply();
      try {
        const config = {
          method: 'post',
          url: process.env.API_URL + '/bot/updateCake',
          data: {
            uuid: interaction.user.id,
            reason: 'ROULETTE',
            amount: amount,
          },
        };
        const result = await axios(config);
        const reqStatus = result.status;

        if (reqStatus == 201) {
          if (amount > 0) {
            await interaction.editReply(
              `You Win! You earned ${amount} of cakes! `,
            );
          } else if (amount < 0) {
            await interaction.editReply(
              `You lose.. You loses ${amount * -1} of cakes`,
            );
          }
        } else {
          throw new Error('');
        }
      } catch (e) {
        console.log(e);
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
