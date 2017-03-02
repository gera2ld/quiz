const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const compress = require('koa-compress');
const config = require('../config');
const utils = require('../utils');
const models = require('../models');
const TOKEN_KEY = config.get('TOKEN_KEY');
const SUPER_USERS = config.get('SUPER_USERS') || [];

async function checkAuth(ctx, next) {
  let user = utils.cookies.get(ctx, TOKEN_KEY);
  const data = user && user.id && await models.user.findOne({
    where: {
      id: user.id,
    },
  });
  if (data) {
    user.name = data.name;
    user.avatar = data.avatar;
    if (SUPER_USERS.includes(user.id)) {
      user.permissions = ['admin'];
      user.isEnabled = true;
    } else {
      user.permissions = data.permissions;
      user.isEnabled = data.isEnabled;
    }
  } else {
    user = null;
  }
  ctx.state.user = Object.assign({
    name: '未登录用户',
  }, user);
  await next();
}

exports.applyRoutes = function (app) {
  app
  .use(checkAuth)
  .use(require('./account'))
  .use(require('./api'))
  .use(conditional())
  .use(etag())
  .use(compress())
  .use(require('./static'))
}
