class UserController {
  index(req, res) {
    res.send('UserController index');
  }

  show(req, res) {
    res.send('UserController show');
  }
}

module.exports = new UserController();