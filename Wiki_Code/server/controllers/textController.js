const {Text, Group, User, Mark} = require('../models/models')
const ApiError = require('../error/ApiError')
class TextController{
    async create(req,res, next){
        try {
            const {title, text, groupId, userId} = req.body
            const textTemp = await Text.create({title,text , userId,groupId})
            return res.json(textTemp)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
    async getAll(req,res){
        let {groupId,userId, limit,page} = req.query
        page = page || 1
        limit = limit || 3
        let offset = page * limit - limit

        let text;

        if (!groupId && !userId){
            text = await Text.findAndCountAll({limit, offset, 
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [
                    {model: User},
                    {model: Group}
                ]
            })
        }
        if (!groupId && userId){
            text = await Text.findAndCountAll({where:{userId}, limit, offset, 
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [
                    {model: User}, 
                    {model: Group}
                ]
            })
        }
        if (groupId && !userId){
            text = await Text.findAndCountAll({where:{groupId}, limit, offset,
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [
                    {model: User}, 
                    {model: Group} 
                ]
            })
        }
        if (groupId && userId){
            text = await Text.findAndCountAll({where:{userId, groupId}, limit, offset, 
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [
                    {model: User}, 
                    {model: Group}
                ]
            })
        }




        return res.json(text)
    }
    async getOne(req,res){
        const {id} = req.params
        const text = await Text.findOne({where: {id}})
        return res.json(text)
    }

    async change(req,res, next){
        const {id} = req.params
        const {title, text, groupId} = req.body
        let textTemp
        if(!title || !text || !groupId){
            next(ApiError.badRequest("erro in change"))
        }
        try {
            textTemp = await Text.update({text: text,title: title, groupId: groupId},{where: {id}})
            res.json(textTemp)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async del(req, res, next){
        const {id} = req.params
        try {
            const text = await Text.destroy({
                where: {id}
            })
            return res.json(text)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new TextController()