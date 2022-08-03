const {
  SlashCommandBuilder,
  Routes,
  SlashCommandStringOption,
} = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('../setting_variable.json');

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!'),
  new SlashCommandBuilder()
    .setName('tweet-give-coin')
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
