const {
  SlashCommandBuilder,
  Routes,
  SlashCommandStringOption,
  SlashCommandNumberOption,
  SlashCommandMentionableOption,
  SlashCommandUserOption,
} = require('discord.js');
const { REST } = require('@discordjs/rest');
const Helper = require('./helper');
require('dotenv').config();

const commands = [

  // 서버 상태
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!'),

  // 율도 서버 상태
  new SlashCommandBuilder()
    .setName('yooldo-status')
    .setDescription('Check Yooldo server health'),

  //멤버 목록 보기
  new SlashCommandBuilder().setName('members').setDescription('show list of members'),

  // 역할 목록 보기
  new SlashCommandBuilder().setName('roles').setDescription('show list of roles'),


  // 웹사이트 안내 임베드
  new SlashCommandBuilder()
    .setName('website')
    .setDescription('Get URL of CyberGalz'),

  // 규칙 임베드
  new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Show CyberGalz Rules'),

  // 유저 등록
  new SlashCommandBuilder().setName('regist').setDescription('Regist Service'),

  // 내 케이크 토큰 확인
  new SlashCommandBuilder()
    .setName('my-cake')
    .setDescription('Show User Cakes'),

  // 내 케이크 토큰 히스토리 보기
  new SlashCommandBuilder()
    .setName('my-cake-history')
    .setDescription("Show list of uses's cake change history")
    .addNumberOption(
      new SlashCommandNumberOption()
        .setName('count')
        .setDescription('length of list')
        .setMinValue(2)
        .setMaxValue(10),
    ),

  // 케이크토큰 리더보드
  new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show Cake Leader Boards'),

  // 데일리 리워드 - 케이크토큰 공급처
  new SlashCommandBuilder()
    .setName('daily-reward')
    .setDescription('Get Daily Reward Cake Token'),

  // 일하기 - 케이크토큰 공급처 
  new SlashCommandBuilder().setName('work').setDescription('work!'),

  // 트위터에서 @Cybergalz 멘션하기 - 케이크토큰 공급처
  new SlashCommandBuilder()
    .setName('tweetgalz')
    .addStringOption(
      new SlashCommandStringOption()
        .setName('link')
        .setDescription('Tweet link')
        .setRequired(true),
    )
    .setDescription(
      'Verification your tweet for confirm exactly mentioned @CyberGalz',
    ),

  // 타인에게 케이크 토큰 보내기
  new SlashCommandBuilder()
    .setName('send')
    .setDescription('Send Cake to another user')
    .addUserOption(
      new SlashCommandUserOption()
        .setName('receiver')
        .setDescription('Receiver')
        .setRequired(true),
    )
    .addNumberOption(
      new SlashCommandNumberOption()
        .setName('amount')
        .setDescription('Send amount of cake')
        .setRequired(true),
    ),

  // 가위바위보 without 베팅 - 케이크 토큰 공급
  new SlashCommandBuilder()
    .setName('rps')
    .setDescription('rock-paper-scissors')
    .addStringOption(
      new SlashCommandStringOption()
        .setName('rps')
        .setDescription('Input R or P or S')
        .setRequired(true),
    ),

  // 가위바위보 with 베팅 - 케이크토큰 공급처
  new SlashCommandBuilder()
    .setName('rps-bet')
    .setDescription('rock-paper-scissor game with bet')
    .addStringOption(
      new SlashCommandStringOption()
        .setName('rps')
        .setDescription('Input R or P or S')
        .setRequired(true),
    )
    .addNumberOption(
      new SlashCommandNumberOption()
        .setName('bet')
        .setDescription('bet amount of cake')
        .setRequired(true),
    ),

  // 주사위 굴리기 with 베팅 - 케이크토큰 공급처
  new SlashCommandBuilder()
    .setName('dice')
    .setDescription('dice game with bet')
    .addNumberOption(
      new SlashCommandNumberOption()
        .setName('number')
        .setDescription('number in dice. 1~6')
        .setRequired(true),
    )
    .addNumberOption(
      new SlashCommandNumberOption()
        .setName('bet')
        .setDescription('bet amount of cake')
        .setRequired(true),
    ),

  // 룰렛 돌리기 with 베팅 - 케이크토큰 공급처
  new SlashCommandBuilder()
    .setName('roulette')
    .setDescription('roulette game with bet')
    .addNumberOption(
      new SlashCommandNumberOption()
        .setName('bet')
        .setDescription('bet amount of cake')
        .setRequired(true),
    ),

  // 운영자 -> 유저 케이크토큰 지급
  new SlashCommandBuilder()
    .setName('give')
    .setDescription('Give a cake to user by Admin')
    .addUserOption(
      new SlashCommandUserOption()
        .setName('receiver')
        .setDescription('Receiver user')
        .setRequired(true),
    )
    .addNumberOption(
      new SlashCommandNumberOption()
        .setName('amount')
        .setDescription('Give amount of cake')
        .setRequired(true),
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName('reason')
        .setDescription('Reason of why admin give a cake')
        .setRequired(true),
    ),

  // 운영자 <- 유저 케이트 토큰 몰수
  new SlashCommandBuilder()
    .setName('take')
    .setDescription('Confiscate a cake by Admin')
    .addUserOption(
      new SlashCommandUserOption()
        .setName('target')
        .setDescription('Confiscate target User')
        .setRequired(true),
    )
    .addNumberOption(
      new SlashCommandNumberOption()
        .setName('amount')
        .setDescription('Confiscate amount of cake')
        .setRequired(true),
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName('reason')
        .setDescription('Reason of why admin confiscate a cake')
        .setRequired(true),
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

rest
  .put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID,
    ),
    {
      body: commands,
    },
  )
  .then(() => {
    console.log('bot successfully registered commands');
  })
  .catch(console.error);
