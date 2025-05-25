const {Group} = require('../models/models')
const ApiError = require('../error/ApiError')
class GroupController{
    async create(req,res){
        const {name} = req.body
        const group = await Group.create({name})
        return res.json(group)
    }
    async getAll(req,res){
        const group = await Group.findAll()
        return res.json(group)
    }
}

module.exports = new GroupController()  