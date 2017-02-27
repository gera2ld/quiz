const nconf = require('nconf');

nconf
.file({
  file: 'config.yml',
  format: require('nconf-yaml'),
})
.argv()
.env()
.defaults({
  NODE_ENV: 'development',
  HOST: '',
  PORT: 2333,
  DEV_PORT: 8080,   // used in dev-server
  TOKEN_KEY: '__token',
  DEBUG: false,
  DATABASE: {
    username: 'root',
    password: '123456',
    database: 'quiz',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
});

nconf.required([
  'SECRET_KEY',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
]);
nconf.set('GITHUB_OAUTH2', `https://github.com/login/oauth/authorize?client_id=${nconf.get('GITHUB_CLIENT_ID')}`);
nconf.set('BACKEND', nconf.get('BACKEND') || `http://localhost:${nconf.get('PORT')}`);

module.exports = nconf;