module.exports = {

  api: {
    port: 3002,
    root: '/api',
  },

  auth: {
    jwt: {
      secret: 'jwt_secret',
      expiresIn:  '24h'
    },
    resetPassword: {
      secret: 'reset_password_secret',
    },
  },

  db: {
    url: 'mongodb://localhost:27017/db_pro_review',
    name: 'db_pro_review',
  },

  file_path: 'uploads',
};
