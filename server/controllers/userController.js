const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models/models')

const generateJwt = (id, login, role) => {
    return jwt.sign({
        id, login, role}, 
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class userController {
    // регистрация //
    async registration(req, res, next) {
        const {login, password, role} = req.body
        if (!login) {
            return next(ApiError.badRequest('Некорректные параметры ввода!:('))
        }

        // проверка, есть ли такой пользователь в БД //
        let candidate = await User.findOne({where: {login}})
        if (candidate) {
            return next(ApiError.badRequest('Данный логин занят'))
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({login, password: hashPassword, role})
        const token = generateJwt(user.id, user.login, user.email, user.phone, user.role);
        return res.json({token})
    }

    // авторизация //
    async login(req, res, next) {
        const {login, password} = req.body
        const user = await User.findOne({where: {login}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        const comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Неправильный пароль'))
        }
        const token = generateJwt(user.id, user.login, user.email, user.phone, user.role);
        return res.json({token})
    }

    // вернуть пользователя в систему //
    async auth(req, res, next) {
        const token = generateJwt(req.user.id, req.user.login, req.user.role)
        return res.json({token})
    }

}

module.exports = new userController()
