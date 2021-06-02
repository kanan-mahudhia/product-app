const crypto = require('crypto');
const cipher = require('../auth/cipherHelper');
const config = require('config');
const jwt = require('jsonwebtoken');
const UserRepository = require('./userRepository');
const emailService = require('../../../utils/emailService');

class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  // get all users
  list() {
    return this.repository.getAllUsers();
  }

  //get count
  getCount() {
    return this.repository.getCount();
  }

  // get user by email
  findByEmail(email) {
    return this.repository.findByEmail(email);
  }

  // get user by id
  findById(id) {
    return this.repository.findById(id)
      .then(user => user);
  }

   // register user
   register_u(user) {
    var user_token = jwt.sign({ email: user.email, token: crypto.randomBytes(16).toString('hex') }, config.get('auth.jwt.secret'));
    return this.repository.findByEmail(user.email)
      .then(u => {
        if (u) {
          throw new Error('User already exists');
        }
        const { salt, passwordHash } = cipher.saltHashPassword(user.password);
        const newUser = {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          created_at: new Date(),
          updated_at: null,
          is_verified: false,
          is_admin: user.is_admin,
          salt,
          passwordHash,
          verification_token: user_token
        };

        // return newUser;
        return this.repository.add(newUser);
      })
      .then(() => {
        return emailService.sendVerifyUserEmail(user.first_name + " " + user.last_name, user.email, user_token);
        
      });
  }

  confirm_user(email, token) {
    return this.repository.confirm_user(email, token)
      .then(result => result);
  }

  addMany(users) {
    return this.repository.addMany(users);
  }

}

module.exports = UserService;
