const { User } = require('../models/User');

let auth = (req, res, next) => {
    // 인증 처리를 하는 곳

    // client cookie에서 token 가져옴 -> cookie parser
    let token = req.cookies.x_auth;

    // token을 복호화한 후 user를 찾는다
    User.findByToken(token, (err, user) => {
      if (err) throw err;
      if (!user) return res.json({ isAuth: false, error: true });

      // user가 있으면 인증 ok
      req.token = token;
      req.user = user;
      next(); //middle ware 다음으로
    })
}

module.exports = { auth };