const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env' });
const next = require('next');
const createServer = require('./createServer');
// const prisma = require('./generated/prisma');
const db = require('./db');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer();

  server.express.use(cookieParser());

  // decode the JWT so we can get the user Id on each request
  server.express.use((req, res, next) => {
    const { token } = req.cookies;
    if (token) {
      const { userId } = jwt.verify(token, process.env.APP_SECRET);
      // put the userId onto the req for future requests to access
      req.userId = userId;
    }
    next();
  });

  // 2. Create a middleware that populates the user on each request
  server.express.use(async (req, res, next) => {
    // if they aren't logged in, skip this
    if (!req.userId) return next();
    const user = await db.query.user(
      { where: { id: req.userId } },
      '{ id, email, name }'
    );
    req.user = user;
    next();
  });

  server.express.get('*', (req, res, next) => {
    if (req.url === '/graphql' || req.url === '/playground') {
      return next();
    }
    return handle(req, res);
  });

  server.start(
    {
      cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL,
      },
      playground: '/playground',
      endpoint: '/graphql',
    },
    deets => {
      console.log(
        `Server is now running on port http://localhost:${deets.port}`
      );
    }
  );
});
