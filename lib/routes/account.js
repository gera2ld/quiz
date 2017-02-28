const fetch = require('node-fetch');
const Router = require('koa-router');
const utils = require('../utils');
const config = require('../config');
const models = require('../models');
const TOKEN_KEY = config.get('TOKEN_KEY');
const CLIENT_ID = config.get('GITHUB_CLIENT_ID');
const CLIENT_SECRET = config.get('GITHUB_CLIENT_SECRET');
const GITHUB_OAUTH2 = config.get('GITHUB_OAUTH2');

function parseJSON(res) {
  return res.json()
  .then(data => res.ok ? {data} : {status: res.status, error: data});
}

function fetchToken(code) {
  const data = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
  };
  return fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(parseJSON);
}

function fetchAPI(token, path) {
  return fetch(`https://api.github.com${path}`, {
    method: 'GET',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/json',
    },
  })
  .then(parseJSON);
}

const router = new Router({
  prefix: '/account',
})
.get('/login', function (ctx, next) {
  ctx.redirect(GITHUB_OAUTH2);
})
.get('/callback', async function (ctx, next) {
  const {code} = ctx.query;
  if (!code) {
    ctx.status = 400;
    return;
  }
  let res = await fetchToken(code);
  if (res.data) {
    const {access_token: token} = res.data;
    res = await fetchAPI(token, '/user');
  }
  if (res.error) {
    ctx.status = res.status;
    ctx.body = res.error;
    return;
  }
  const {name, id, avatar_url, email, login} = res.data;
  const userAttr = {
    openId: `github/${id}`,
    login,
    name,
    email,
    avatar: avatar_url,
  };
  await models.user.upsert(userAttr);
  const user = await models.user.findOne({
    where: {openId: userAttr.openId},
  });
  utils.cookies.set(ctx, TOKEN_KEY, {
    id: user.id,
    name: user.name,
  });
  ctx.redirect('../');
})
.get('/logout', function (ctx, next) {
  utils.cookies.remove(ctx, TOKEN_KEY);
  ctx.redirect('../');
})

module.exports = router.routes();
