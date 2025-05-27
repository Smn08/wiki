const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/models')
const uuid = require('uuid')
const path = require('path')

const generatorToken = (id,email,role) =>{
    return jwt.sign(
        {id, email, role},
         process.env.SECRET_KEY,
         {expiresIn: '24h'})
}

class UserController{
    async registration(req,res, next){
        try {
        const {email, password, role, fn, sn} = req.body
        if (!email || !password){
            return next(ApiError.badRequest("Некоректный email или password"))
        }
            if (!fn || !sn) {
                return next(ApiError.badRequest("Имя и фамилия обязательны"))
            }
        const candidate = await User.findOne({where:{email}})
        if (candidate){
                return next(ApiError.badRequest("Пользователь с таким email уже существует"))
        }
        const hashPassword = await bcrypt.hash(password,5)
        const user = await User.create({
            email,
                role: role || 'USER',
            password: hashPassword,
                fn,
                sn
        })
        const token = generatorToken(user.id,user.email,user.role)
        return res.json({token})
        } catch (error) {
            console.error('Registration error:', error);
            return next(ApiError.internal('Ошибка при регистрации пользователя'))
        }
    }

    async login(req,res, next){
        try {
        const {email,password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user){
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password,user.password)
        if (!comparePassword){
            return next(ApiError.internal('Указан не верный пароль'))
        }
        const token = generatorToken(user.id,user.email,user.role)
        return res.json({token})
        } catch (error) {
            console.error('Login error:', error);
            return next(ApiError.internal('Ошибка при входе в систему'))
        }
    }

    async check(req, res, next){
       const token = generatorToken(req.user.id,req.user.email,req.user.role)
       return res.json({token})
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            const user = await User.findOne({
                where: {id},
                attributes: { exclude: ['password'] }
            })
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'))
            }
            return res.json(user)
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении данных пользователя'))
        }
    }

    async changeImg(req,res, next){
        const {id} = req.params
        const {img} = req.files
        try {
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname,'..','static', fileName))
            const textTemp = await User.update({foto: fileName},{where: {id}})
            return res.json(textTemp)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async changePassword(req,res, next){
        const {id} = req.params
        const {password} = req.body
        const user = await User.findOne({where: {id}})
        if (!user){
            return next(ApiError.internal('Пользователь не найден'))
        }
        const hashPassword = await bcrypt.hash(password,5)
        await User.update({password: hashPassword}, {where: {id}})
        const token = generatorToken(user.id,user.email,user.role)
        return res.json({token})
    }
}

module.exports = new UserController()
