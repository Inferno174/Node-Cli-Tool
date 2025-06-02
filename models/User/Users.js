const db = require('../config/database');
class Users {
  constructor(data = {}) {
    this.id = data.id || null;
    this.created_at = data.created_at || new Date();
  }

  static async findAll() {
    // Add database logic
  }
}

module.exports = Users;