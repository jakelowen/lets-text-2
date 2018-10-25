const Query = {
  async me(parent, args, ctx) {
    // check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    }

    const [userFromDbQuery] = await ctx
      .db('lt_user')
      .where({ id: ctx.request.userId });
    return userFromDbQuery;
  },
};

module.exports = Query;
