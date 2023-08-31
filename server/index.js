const express = require("express"); // express 모듈을 가져옴
const app = express(); // 새로운 express 앱 생성
const port = 5000; // 3000 4000 5000 모두 ok
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
const config = require("./config/key");

// application/x-www-form-urlencoded 로 된 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({ extended: true }));
// application/json json으로 된 걸 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // 에러 방지
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World! 우와~ 222")); // 루트 dir에 hello world 출력

app.get("/api/hello", (req, res) => {
  res.send("Hello World!");
})

// register route
app.post("/api/users/register", async (req, res) => {
  // 회원가입시 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터베이스에 넣어준다
  const user = new User(req.body);

  const result = await user
    .save()
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
  /*   user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  }); // mongodb 메소드 -> callback 메소드 지원 안함*/
});

app.post("/api/users/login", (req, res) => {
  //요청된 이메일이 데이터베이스에 있는지 찾음
  /* User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
  }); */ // mongoose 5.0 -> callback 메소드 지원 안함*/
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당하는 유저가 없습니다.",
        });
      }
      //데이터베이스에서 요청한 이메일이 있다면 비밀번호가 같은지 확인
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
          return res.json({
            loginSuccess: false,
            message: "비밀번호가 틀렸습니다.",
          });

        //비밀번호까지 맞다면 토큰을 생성하기
        user.generateToken((err, user) => {
          if (err) return res.status(400).send(err);
          //토큰을 쿠키, 로컬 스토리지 등에 저장
          res
            .cookie("x_auth", user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id });
        });
      });
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});

// cf. role 1 어드민     role 2 특정 부서 어드민
// role 0 일반 유저
app.get("/api/users/auth", auth, (req, res) => {
  //auth: middle ware
  // 여기까지 미들웨어를 통과해왔다는 건 Authentication이 true
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastName: req.user.lastName,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id }, //auth middle ware에서
    { token: "" }) //token 삭제
    .then((user) => {
      res.status(200).send({
        success: true,
      });
    })
    .catch((err) => {
       return res.json({ success: false, err })
    }
  )
  /* User.findOneAndUpdate(
    { _id: req.user._id }, //auth middle ware에서
    { token: "" }, //token 삭제
    (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }*/
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
