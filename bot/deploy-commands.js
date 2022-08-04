const {
  SlashCommandBuilder,
  Routes,
  SlashCommandStringOption,
  SlashCommandNumberOption,
} = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('../setting_variable.json');

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!'),

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
  new SlashCommandBuilder().setName('dice').setDescription('dice game'),
  new SlashCommandBuilder()
    .setName('dice-bet')
    .setDescription('dice game with bet'),
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
    .setDescription('rock-paper-scissors game with bet')
    .addStringOption(
      new SlashCommandStringOption()
        .setName('rps')
        .setDescription('Input R or P or S')
        .setRequired(true),
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName('cake')
        .setDescription('Bet Cake Amount 0-?')
        .setRequired(true),
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commands,
  })
  .then(() => {
    console.log('bot successfully registered commands');
  })
  .catch(console.error);
