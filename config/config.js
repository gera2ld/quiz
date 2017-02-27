const config = require('../lib/config');

let DATABASE = config.get('DATABASE');

if (typeof DATABASE === 'string') {
  DATABASE = {
    url: DATABASE,
  };
}

module.exports = {
  development: DATABASE,
  production: DATABASE,
};