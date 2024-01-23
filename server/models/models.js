const sequelize = require('../db')
const { DataTypes, fn} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: 'USER'},
})

const Note = sequelize.define('note', {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
    date: {type: DataTypes.DATE, defaultValue: fn('NOW')},
    x: {type: DataTypes.FLOAT},
    y: {type: DataTypes.FLOAT}
})

User.hasMany(Note)
Note.belongsTo(User)

module.exports = {
    User,
    Note
}
