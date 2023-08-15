const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10

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
    token: { //유효성 관리
        type: String
    },
    toeknExp: { //token을 사용할 수 있는 기간
        type: Number
    }
})

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        // 비밀번호를 암호화시킨다
        bcrypt.genSalt(saltRounds, function (err, salt) { //salt 생성
            if (err)
                return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                // Store hash in your password DB.
                if (err)
                    return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }

})

const User = mongoose.model('User', userSchema)

module.exports = {
    User
} // User를 다른 곳에서도 사용할 수 있도록 export