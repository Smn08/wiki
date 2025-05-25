const {Mark} = require('../models/models')
const ApiError = require('../error/ApiError')

class MarkController{
    async getAll(req,res){
        const {id} = req.params
        const mark = await Mark.findAll({where: {userId: id}})
        return res.json(mark)
    }
    async add(req,res, next){
        const {userId, textId} = req.body
        const mark = await Mark.findOne({where: {userId, textId}})
        if (mark){
            return next(ApiError.badRequest("Оценка уже поставлена"))
        }
        const data = await Mark.create({userId: userId, textId: textId})

        return res.json(data)
    }

    async del(req,res, next){
        const {userId, textId} = req.body
        const mark = await Mark.findOne({where: {userId, textId}})
        if (!mark){
            return next(ApiError.badRequest("Оценка не существует"))
        }
        const data = await Mark.destroy({where: {userId: userId, textId: textId}})
        return res.json(data)
    }
}

module.exports = new MarkController()  