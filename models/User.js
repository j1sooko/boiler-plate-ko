const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //공백 제거
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    //권한
    type: Number,
    default: 0,
  },
  image: String, //object를 사용하지 않아도 가능
  token: {
    //유효성 관리
    type: String,
  },
  toeknExp: {
    //token을 사용할 수 있는 기간
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    // 비밀번호를 암호화시킨다
    bcrypt.genSalt(saltRounds, function (err, salt) {
      //salt 생성
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        // Store hash in your password DB.
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPasswrod, cb) {
  //cb: callback
  //plainPassword 1234567 암호화된 비밀번호 $2b$10$cmbn0B74XGqrQEAePqM.9O5Sj.w7rsLx8b2ZxCkyZgXJWfebZPRi. (복호화불가)
  bcrypt.compare(plainPasswrod, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch); //error는 없고 isMatch는 true
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  //jsonwebtoken을 이용해서 token을 생성하기.
  //user._id와 "secretToekn"으로 token 생성.token을 해석할 때 "secretToekn"이 있으면 user._id를 알 수 있음
  var token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;

  user.save()
    .then((user) => {
      cb(null, user);
    })
    .catch((err) => {
      return cb(err);
    });
  /*user.save(function (err, user) {
      if (err) return cb(err);
      cb(null, user); // err는 없고 user 정보 전달
    });*/
};

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
}; // User를 다른 곳에서도 사용할 수 있도록 export
