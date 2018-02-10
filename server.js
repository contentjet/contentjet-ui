const {promisify} = require('util');
const fs = require('fs');
const access = promisify(fs.access);
const Koa = require('koa');
const send = require('koa-send');

let {BASE_URL} = process.env;
if (!BASE_URL) throw new Error('BASE_URL environment variable not set');
BASE_URL = BASE_URL.trim();
if (!BASE_URL.endsWith('/')) BASE_URL = BASE_URL + '/';

const PORT = parseInt(process.env.PORT || '9000');

const app = new Koa();

const dist = __dirname + '/dist';

const index = fs.readFileSync(dist + '/index.html').toString();
const modifiedIndex = index.replace(/BASE_URL:\s+'.*'/g, `BASE_URL: '${BASE_URL}'`);

app.use(async (ctx) => {
  if (ctx.path.endsWith('/')) return ctx.body = modifiedIndex;
  try {
    await access(dist + ctx.path, fs.constants.R_OK);
    await send(ctx, ctx.path, { root: dist });
  } catch (err) {
    return ctx.body = modifiedIndex;
  }
});

app.listen(PORT);
// eslint-disable-next-line no-console
console.log(`Listening on port ${PORT}!`);
