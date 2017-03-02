const fs = require('fs');
const path = require('path');
const send = require('koa-send');
const config = require('../config');

const GITHUB_OAUTH2 = config.get('GITHUB_OAUTH2');
const optionsStatic = {
  root: path.resolve(config.get('STATIC_DIR')),
};

if (config.get('NODE_ENV') === 'production') {
  fs.accessSync(optionsStatic.root);
}

module.exports = async function (ctx, next) {
  if (!ctx.state.user.id) {
    ctx.redirect(GITHUB_OAUTH2);
    return;
  }
  let {path} = ctx;
  if (path === '/') path = '/index.html';
  if (await send(ctx, path, optionsStatic)) return;
  ctx.redirect('/');
};
