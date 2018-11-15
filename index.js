const { createServer } = require('http');
const cookieParser = require('cookie-parser');

const jwt = require('jsonwebtoken');

// require('dotenv').config({ path: 'variables.env' });
require('dotenv').config();
const next = require('next');
const express = require('express');
const createGQLServer = require('./api/createServer');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const apiRoutes = require('./api/apiRoutes');

// const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8080;

app.prepare().then(async () => {
  const expressServer = express();
  const gqlserver = await createGQLServer();

  expressServer.use(cookieParser());

  // decode the JWT so we can get the user Id on each request
  expressServer.use((req, res, next) => {
    const { token } = req.cookies;
    // console.log('TOKEN', token);
    if (token) {
      let userId;
      try {
        const decoded = jwt.verify(token, process.env.APP_SECRET);
        userId = decoded.userId || null;
      } catch (e) {
        userId = null;
      }
      // put the userId onto the req for future requests to access
      req.userId = userId;
    }
    next();
  });

  gqlserver.applyMiddleware({
    app: expressServer,
    path: '/graphql',
  });

  const httpServer = createServer(expressServer);
  gqlserver.installSubscriptionHandlers(httpServer);
  // console.log(gqlserver);

  // Not sure if I need this, but leaving in the stub.
  // 2. Create a middleware that populates the user on each request
  // server.express.use(async (req, res, next) => {
  //   // if they aren't logged in, skip this
  //   if (!req.userId) return next();
  //   const user = await db.query.user(
  //     { where: { id: req.userId } },
  //     '{ id, email, name }'
  //   );
  //   req.user = user;
  //   next();
  // });

  expressServer.use('/api', apiRoutes);

  expressServer.get('*', (req, res, next) => {
    if (req.url === '/graphql') {
      return next();
    }
    return handle(req, res);
  });

  httpServer.listen(port, err => {
    if (err) throw err;
    const { GRAPHQL_PATH, DOMAIN } = process.env;
    console.log(`🚀 Server Listening on http://${DOMAIN}:${port}`);
    console.log(
      `🚀 GRAPHQL ready at http://${DOMAIN}:${port}${gqlserver.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://${DOMAIN}:${port}${
        gqlserver.subscriptionsPath
      }`
    );
  });
});
