const jwt = require('jsonwebtoken');

const confirmLogin = async (parent, args, ctx) => {
  /*  Response target
        type ConfirmLoginResponse {
            code: String!
            success: Boolean!
            message: String!
            user: User
        }
    */

  // 1.. check if its a legit reset token
  // 2. Check if its expired
  const [user] = await ctx.db.query.users({
    where: {
      loginToken: args.token,
      loginTokenExpiry_gte: Date.now() - 3600000,
    },
  });
  console.log('!! do we have a user?', user);
  if (!user) {
    console.log('!!!!! NO USER');
    return {
      code: 'noUser',
      success: false,
      message: 'This token is either invalid or expired!',
      user: null,
    };
  }

  console.log('on server side, in confirmlogin, user', user);

  // 3. remove old resetToken fields
  const updatedUser = await ctx.db.mutation.updateUser({
    where: { email: user.email },
    data: {
      loginToken: null,
      loginTokenExpiry: null,
    },
  });

  // 4. Generate JWT
  const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);

  // 5. Set the JWT cookie
  ctx.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  // 6. return the new user
  return {
    code: 'ok',
    success: true,
    message:
      'You have successfully logged in. You may close this window and return to your previous tab to continue!',
    user: updatedUser,
  };
};

module.exports = confirmLogin;
