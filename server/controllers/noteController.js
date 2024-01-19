const ApiError = require('../error/ApiError')
const { Note } = require('../models/models')

class noteController {
    // добавление заметки //
    async addNote(req, res) {
        const { title, description, date, userId } = req.body
        const note = await Note.create({title, description, date, userId})
        return res.json(note)
    }

    // получение всех заметок пользователя //
    async getOneNote(req, res) {
        const { id } = req.params
        const notes = await Note.findAll({
            where: { userId: id }
        })
        return res.json(notes)
    }

    // удаление выбранной заметки //
    async deleteNote(req, res) {
        const { id } = req.params
        const deletedRow = await Note.destroy({
            where: { id: id }
        });
        if (deletedRow) {
            return res.json({ message: 'Заметка успешно удалена' })
        } else {
            return res.json({ message: 'Заметка не найдена' })
        }
    }
}

module.exports = new noteController()
