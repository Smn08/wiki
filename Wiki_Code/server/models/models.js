const sequelize = require('../db')
const {DataTypes} = require('sequelize')

//Создание таблиц
const User = sequelize.define('user',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    foto: {type: DataTypes.STRING, defaultValue: "defaut_awatar.jpg"},
    fn: {type: DataTypes.STRING, allowNull: false, defaultValue: ''},
    sn: {type: DataTypes.STRING, allowNull: false, defaultValue: ''},
    text: {type: DataTypes.STRING, defaultValue: ''}
})

const Text = sequelize.define('text',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.TEXT, allowNull: false},
    text: {type: DataTypes.TEXT},
    mark: {type: DataTypes.INTEGER, defaultValue: 0}
})

const Group = sequelize.define('group',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const Mark = sequelize.define('mark',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Redact = sequelize.define('redact',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    time: {type: DataTypes.TIME, allowNull: false}
})

//Связываание таблиц
User.hasMany(Mark)
Mark.belongsTo(User)

User.hasMany(Redact)
Redact.belongsTo(User)

User.hasMany(Text)
Text.belongsTo(User)

Text.hasMany(Redact)
Redact.belongsTo(Text)

Text.hasMany(Mark)
Mark.belongsTo(Text)

Group.hasMany(Text)
Text.belongsTo(Group)

module.exports = {
    User,
    Text,
    Redact,
    Mark,
    Group
}