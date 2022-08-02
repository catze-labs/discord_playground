const { Client, GatewayIntentBits, Message } = require("discord.js");
const { tweet_api_bearer, token } = require("./setting_variable.json");
var axios = require("axios");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const { commandName, options } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  }

  if (commandName === "tweet-give-coin") {
    let tweetIds = options.get("link").value;
    tweetIds = tweetIds.split("?")[0];
    tweetIds = tweetIds.split("/");
    tweetIds = tweetIds[tweetIds.length - 1];

    try {
      var config = {
        method: "get",
        url: `https://api.twitter.com/2/tweets/${tweetIds}`,
        headers: {
          "User-Agent": "v2TweetLookupJS",
          authorization: `Bearer ${tweet_api_bearer}`,
        },
      };

      const tweetResult = await axios(config);
      const tweetResultData = tweetResult.data.data.text;

      if (tweetResultData.indexOf("@CybergalzNFT") > -1) {
        await interaction.reply("CyberGalz mentioned");
      } else {
        await interaction.reply("This tweet not contain Cybergalz mention");
      }
    } catch (e) {
      console.log(e);
      console.log("Get Tweet Error");
    }
  }
});

client.on("messageCreate", (msg) => {
  console.log(msg);
  console.log(msg.cleanContent);
});

client.login(token);
