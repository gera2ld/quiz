exports.cookies = {
  get(ctx, key) {
    const value = ctx.cookies.get(key, {signed: true});
    try {
      return JSON.parse(new Buffer(value, 'base64').toString());
    } catch (e) {
      // ignore invalid data
    }
  },
  set(ctx, key, data) {
    const value = new Buffer(JSON.stringify(data)).toString('base64');
    ctx.cookies.set(key, value, {signed: true});
  },
  remove(ctx, key) {
    ctx.cookies.set(key, '', {expires: new Date(Date.now() - 24 * 60 * 60 * 1000)});
  },
};

exports.wraps = function (func, options) {
  func.__name__ = options.name;
  func.__doc__ = options.doc;
  return func;
};

exports.permit = function (key) {
  /**
   * permissions:
   * - admin: user is admin
   */
  return exports.wraps(async function permit(ctx, next) {
    const {user} = ctx.state;
    if (!user || !user.id) {
      ctx.status = 401;
      ctx.body = {
        error: 'Not Authorized',
      };
      return;
    }
    const permissions = user.permissions || [];
    if (!user.isEnabled || key && !permissions.includes(key)) {
      ctx.status = 403;
      ctx.body = {
        error: 'Forbidden',
      };
      return;
    }
    await next();
  }, {
    doc: `Require permission: ${key || 'logged in'}`,
  });
};
