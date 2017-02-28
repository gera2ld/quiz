const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
const config = require('./config');
const {applyRoutes} = require('./routes');

const HOST = config.get('HOST');
const PORT = config.get('PORT');
const app = new Koa();
app.keys = [config.get('SECRET_KEY')];

app
.use(BodyParser({enableTypes: ['json', 'form', 'text']}))

applyRoutes(app);
app.listen(PORT, HOST, err => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Listening at ${HOST}:${PORT}`);
});
