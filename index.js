
const express = require('express') // express 모듈을 가져옴
const app = express() // 새로운 express 앱 생성
const port = 5000 // 3000 4000 5000 모두 ok
const bodyParser = require('body-parser');
const { User } = require('./models/User');

// application/x-www-form-urlencoded 로 된 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({ extended: true }));
// application/json json으로 된 걸 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://doubletry23:GuhvnJMyF3CouEAp@boilerplate.zhapsin.mongodb.net/', {
  useNewUrlParser: true, useUnifiedTopology: true // 에러 방지
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))




app.get('/', (req, res) => res.send('Hello World! 우와~')) // 루트 dir에 hello world 출력


// register route
app.post('/register', async (req, res) => {
  // 회원가입시 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터베이스에 넣어준다
  const user = new User(req.body)

  const result = await user.save().then(()=>{
    res.status(200).json({
      success: true
    })
  }).catch((err)=>{
    res.json({ success: false, err })
  })
/*   user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  }); // mongodb 메소드 -> callback 메소드 지원 안함*/
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})