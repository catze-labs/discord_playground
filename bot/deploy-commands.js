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
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!'),

  new SlashCommandBuilder()
    .setName('yooldo-status')
    .setDescription('Check Yooldo server health'),

  new SlashCommandBuilder()
    .setName('website')
    .setDescription('Get URL of CyberGalz'),

  new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Show CyberGalz Rules'),

  new SlashCommandBuilder().setName('regist').setDescription('Regist Service'),

  new SlashCommandBuilder()
    .setName('my-cake')
    .setDescription('Show User Cakes'),

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

  new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show Cake Leader Boards'),

  new SlashCommandBuilder()
    .setName('daily-reward')
    .setDescription('Get Daily Reward Cake Token'),

  new SlashCommandBuilder().setName('work').setDescription('work!'),

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

  new SlashCommandBuilder().setName('members').setDescription('list members'),
  new SlashCommandBuilder().setName('roles').setDescription('list roles'),

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

  // Games
  new SlashCommandBuilder()
    .setName('rps')
    .setDescription('rock-paper-scissors')
    .addStringOption(
      new SlashCommandStringOption()
        .setName('rps')
        .setDescription('Input R or P or S')
        .setRequired(true),
    ),
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

  new SlashCommandBuilder()
    .setName('roulette')
    .setDescription('roulette game with bet')
    .addNumberOption(
      new SlashCommandNumberOption()
        .setName('bet')
        .setDescription('bet amount of cake')
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
