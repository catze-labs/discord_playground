const express = require('express');
const port = 8080;
const { request } = require('undici');
const { clientId, clientSecret } = require('./setting_variable.json');

async function getJSONResponse(body) {
  let fullBody = '';

  for await (const data of body) {
    fullBody += data.toString();
  }
  return JSON.parse(fullBody);
}

const app = express();
app.get('/', async ({ query }, res) => {
  const { code } = query;

  console.log(`Code : ${code}`);

  if (code) {
    const reqbody = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `http://localhost:${port}`,
      scope: 'identify',
    }).toString();

    console.log(`Reqest Body : ${reqbody}`);

    try {
      const tokenResponseData = await request(
        'https://discord.com/api/oauth2/token',
        {
          method: 'POST',
          body: reqbody,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const oauthData = await getJSONResponse(tokenResponseData.body);

      const accessToken = oauthData['access_token'];
      console.log(accessToken);
      const userInfo = await request('https://discord.com/api/users/@me', {
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(await getJSONResponse(userInfo.body));

      const guildInfo = await request(
        'https://discord.com/api/users/@me/guilds',
        {
          method: 'GET',
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log(await getJSONResponse(guildInfo.body));
    } catch (error) {
      // NOTE: An unauthorized token will not throw an error
      // tokenResponseData.statusCode will be 401
      console.log('ERROR OCCURRED');
      console.error(error);
    }
  }

  return res.sendFile('discord-oauth-test.html', { root: '.' });
});

app.listen(port, () => console.log(`Server Listening port ${port}`));
