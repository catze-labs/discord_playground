const { Client, GatewayIntentBits, Message } = require('discord.js');
var axios = require('axios');
require('dotenv').config();
const CommandColleciton = require('./command-collection');
const { async } = require('rxjs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildWebhooks,
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

  console.log(interaction)
  await CommandColleciton[commandName].exec(interaction);
});

// 이미지 올렸는지 확인
// 모든 메세지를 훅으로 리스닝
client.on('messageCreate', async (msg) => {
  const attachmentsList = msg.attachments;
  let imgIsIncluded = false;

  // 첨부파일 리스트 확인해서 컨텐츠 타입이 이미지인지 확인
  const imgReg = new RegExp('image\/[A-z]*','g')
  attachmentsList.forEach((v) => {
    if (imgReg.test(v.contentType)) {
      imgIsIncluded = true;
    }
  });

  // 만약 이미지가 올라왔을 경우
  if (imgIsIncluded) {
    await CommandColleciton['ootd-upload'].exec(msg)
  }
});

// 서버에 신규 유저 유입 시 DB 에 만들기
client.on('guildMemberAdd', async (member) => {
  try {
    var config = {
      method: 'post',
      url: process.env.API_URL + '/bot/newUser',
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

client.on('guildMemberUpdate', (oldMember, newMember) => {
  console.log(oldMember);
  console.log(newMember);

  const oldUUID = oldMember.user.id;
  const newUUID = newMember.user.id;
  const newNickname = newMember.nickname;
  const newDiscordUsername = newMember.user.username;
  const newDiscriminator = newMember.user.discriminator;

  const config = {
    method: 'patch',
    url: process.env.API_URL + '/bot/patchUser',
    data: {
      oldUUID: oldUUID,
      newUUID: newUUID,
      discordUsername: newDiscordUsername,
      guildNickname: newNickname == null ? newDiscordUsername : newNickname,
      discriminator: newDiscriminator,
    },
  };

  axios(config)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err.response.data);
    });
});

client.login(process.env.TOKEN);
