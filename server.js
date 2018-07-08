const { promisify } = require('util');
const fs = require('fs');
const access = promisify(fs.access);
const Koa = require('koa');
const send = require('koa-send');

let { BACKEND_URL } = process.env;
if (!BACKEND_URL) throw new Error('BACKEND_URL environment variable not set');
BACKEND_URL = BACKEND_URL.trim();
if (!BACKEND_URL.endsWith('/')) BACKEND_URL = BACKEND_URL + '/';

const PORT = parseInt(process.env.PORT || '9000');

const app = new Koa();

const dist = __dirname + '/dist';

const index = fs.readFileSync(dist + '/index.html').toString();
const modifiedIndex = index.replace(/BACKEND_URL:\s+'.*'/g, `BACKEND_URL: '${BACKEND_URL}'`);

app.use(async (ctx, next) => {
  if (ctx.path === '/index.html' || ctx.path.endsWith('/')) return await next();
  try {
    await access(dist + ctx.path, fs.constants.R_OK);
    ctx.set('Cache-Control', 'max-age=604800'); // 1 week
    await send(ctx, ctx.path, { root: dist });
  } catch (err) {
    return await next();
  }
});

app.use(async (ctx) => {
  ctx.set('Cache-Control', 'max-age=0');
  ctx.body = modifiedIndex;
  return;
});

app.listen(PORT);
// eslint-disable-next-line no-console
console.log(`Listening on port ${PORT}!`);
