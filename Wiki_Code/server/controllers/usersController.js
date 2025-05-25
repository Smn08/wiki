const {User} = require('../models/models')
const ApiError = require('../error/ApiError')
const uuid = require('uuid')
const path = require('path')
class UsersController{
    async getAll(req,res){
        const users = await User.findAll()
        return res.json(users)
    }

    async change(req,res, next){
        const {id} = req.params
        const {pole, value } = req.body
        let userTemp
        if(!id || !pole || !value){
            next(ApiError.badRequest("Error"))
        }
        try {

            userTemp =await User.update({
                [pole]: value
            },
            {
                where: {id}
            })
            res.json(userTemp)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async delUser(req, res, next){
        const {id} = req.params
        const user = await User.findOne({where: {id}})
        if (!user){
            return next(ApiError.badRequest("Пользователя не существует"))
        }
        const data = await User.destroy({where: {id: id}})
        return res.json(data)
    }
}


module.exports = new UsersController()  