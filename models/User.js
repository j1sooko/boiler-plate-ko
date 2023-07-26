const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //공백 제거
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { //권한
        type: Number,
        default: 0
    },
    image: String, //object를 사용하지 않아도 가능
    token: {//유효성 관리
        type: String
    },
    toeknExp: { //token을 사용할 수 있는 기간
        type: Number
    }
})

const User = mongoose.model('User', userSchema)

module.exports = {User} // User를 다른 곳에서도 사용할 수 있도록 export