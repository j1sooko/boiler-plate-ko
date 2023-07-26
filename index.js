
const express = require('express') // express 모듈을 가져옴
const app = express() // 새로운 express 앱 생성
const port = 5000 // 3000 4000 5000 모두 ok

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://doubletry23:GuhvnJMyF3CouEAp@boilerplate.zhapsin.mongodb.net/', {
  useNewUrlParser: true, useUnifiedTopology: true // 에러 방지
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => { // 루트 dir에 hello world 출력
  res.send('Hello World! 우와~')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})