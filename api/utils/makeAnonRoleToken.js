const jwt = require('jsonwebtoken');

// generate anon token
const makeAnonToken = () =>
  jwt.sign(
    {
      userId: null,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['anonymous'],
        'x-hasura-default-role': 'anonymous',
      },
    },
    process.env.APP_SECRET
  );

module.exports = makeAnonToken;
