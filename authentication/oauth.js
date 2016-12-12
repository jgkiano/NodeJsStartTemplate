var ids = {
  facebook: {
    clientID: process.ENV.FACEBOOKID,
    clientSecret: process.ENV.FACEBOOKSECRECT,
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  github: {
    clientID: process.ENV.GITHUBID,
    clientSecret: process.ENV.GITHUBSECRECT,
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  google: {
    clientID: process.ENV.GOOGLEID,
    clientSecret: process.ENV.GOOGLESECRECT,
    callbackURL: 'http://localhost:3000/auth/google/callback'
  }
};

module.exports = ids;
