const ApiError = require('../error/ApiError')
const { Note } = require('../models/models')

class noteController {
    // добавление заметки //
    async addNote(req, res) {
        const { id, title, description, date, userId, x, y } = req.body
        const note = await Note.create({id, title, description, date, userId, x, y})
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

    async updateNote(req, res) {
        try {
            const { id } = req.params;
            const { title, description, date, x, y } = req.body;

            // Проверяем, существует ли заметка с указанным id
            const existingNote = await Note.findByPk(id);
            if (!existingNote) {
                return res.status(404).json({ message: 'Заметка не найдена' });
            }

            // Обновляем данные заметки
            existingNote.title = title || existingNote.title;
            existingNote.description = description || existingNote.description;
            existingNote.date = date || existingNote.date;
            existingNote.x = x || existingNote.x;
            existingNote.y = y || existingNote.y;

            // Сохраняем обновленные данные в базе данных
            await existingNote.save();

            return res.json(existingNote);
        } catch (error) {
            // Обработка ошибок
            console.error(error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new noteController()
