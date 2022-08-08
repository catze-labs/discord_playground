const {
  SlashCommandBuilder,
  Routes,
  SlashCommandStringOption,
  SlashCommandNumberOption,
  SlashCommandMentionableOption,
  SlashCommandUserOption,
} = require('discord.js');
const { REST } = require('@discordjs/rest');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!'),

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
    .setName('rps')
    .setDescription('rock-paper-scissors')
    .addStringOption(
      new SlashCommandStringOption()
        .setName('rps')
        .setDescription('Input R or P or S')
        .setRequired(true),
    ),
  new SlashCommandBuilder()
  .setName('send')
  .setDescription('Send Cake to another user')
  .addUserOption(
    new SlashCommandUserOption()
    .setName('receiver')
    .setDescription('receiver of send cake')
    .setRequired(true)
  )
  .addNumberOption(
    new SlashCommandNumberOption()
    .setName('test2')
    .setDescription('send amount of cake')
    .setRequired(true)
  )
  
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
