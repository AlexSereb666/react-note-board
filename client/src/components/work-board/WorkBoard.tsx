import React, { useState, useEffect } from 'react';
import './WorkBoard.css';
import Navbar from '../navbar/Navbar';
import ButtonMenu from '../button-menu/ButtonMenu';
import { jwtDecode } from 'jwt-decode';
import { AddNoteResponse, getNotes, deleteNote, addNote, updateNote } from '../../http/NoteAPI';

interface Note {
    id: number,
    title: string;
    description: string;
    date: Date;
    coordinates: { x: number; y: number };
    color: string;
}

const WorkBoard = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [draggedNote, setDraggedNote] = useState<number | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const possibleColors = ['#c46c6c', '#c95fbf', '#9952c4', '#475cc4', '#47a7c4', '#47c496', 
    '#47c453', '#8ec447', '#c4c047', '#c49247', '#bf3d2c'];

    useEffect(() => {
        const token = localStorage.getItem('token');
        const decodedToken: any = jwtDecode(token!);
        const userId = decodedToken.id;
        getNotes(userId).then((data: AddNoteResponse[]) => {
            const updatedNotes = data.map((note) => ({
                id: note.id,
                title: note.title,
                description: note.description,
                date: new Date(note.date),
                coordinates: { x: note.x, y: note.y },
                color: possibleColors[Math.floor(Math.random() * possibleColors.length)],
            }));
    
            // Присваиваем обновленный массив notes
            setNotes(updatedNotes);
        });
    }, []);

    const createNote = async () => {
        const randomColor = possibleColors[Math.floor(Math.random() * possibleColors.length)];
    
        // Определите область вокруг кнопки, где может появляться заметка
        const buttonArea = {
            minX: 10,
            maxX: window.innerWidth - 200,
            minY: 10,
            maxY: window.innerHeight - 200,
        };
    
        const randomX = Math.random() * (buttonArea.maxX - buttonArea.minX) + buttonArea.minX;
        const randomY = Math.random() * (buttonArea.maxY - buttonArea.minY) + buttonArea.minY;
    
        const token = localStorage.getItem('token');
        const decodedToken: any = jwtDecode(token!);
        const userId = decodedToken.id;
    
        const newNote: Note = {
            id: new Date().getTime(),
            title: `Заметка ${notes.length + 1}`,
            description: 'Описание заметки',
            coordinates: { x: randomX, y: randomY },
            date: new Date(),
            color: randomColor,
        };
    
        try {
            // Отправляем данные на сервер и получаем ответ с новой заметкой
            const addedNote: AddNoteResponse = await addNote(
                newNote.id,
                newNote.title,
                newNote.description,
                `${newNote.date}`,
                userId,
                newNote.coordinates.x,
                newNote.coordinates.y
            );
    
            // Обновляем состояние компонента, добавляя новую заметку
            setNotes((prevNotes) => [...prevNotes, {
                id: addedNote.id,
                title: addedNote.title,
                description: addedNote.description,
                date: new Date(addedNote.date),
                coordinates: { x: addedNote.x, y: addedNote.y },
                color: randomColor,
            }]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            // Обновляем позицию мыши при движении
            const updatedMousePosition = { x: event.clientX, y: event.clientY };
            setMousePosition(updatedMousePosition);
        };

        const handleMouseUp = () => {
            if (draggedNote !== null) {
                const updatedNote = notes[draggedNote];
                updateNote(updatedNote.id, updatedNote.title, updatedNote.description,
                    `${updatedNote.date}`, updatedNote.coordinates.x, updatedNote.coordinates.y);
            }

            // Прекращаем отслеживать перемещение при отпускании мыши
            setDraggedNote(null);
        };

        // Добавляем обработчики при изменении draggedNote
        if (draggedNote !== null) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        // Удаляем обработчики при размонтировании компонента
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggedNote, notes]);

    const handleMouseDown = (index: number, event: React.MouseEvent) => {
        event.stopPropagation();

        // Если клик был на поле ввода, прекращаем обработку
        if (
            event.target instanceof HTMLInputElement ||
            event.target instanceof HTMLTextAreaElement ||
            (event.target instanceof HTMLElement && event.target.classList.contains('delete-icon'))
        ) {
            return;
        }

        // Начинаем отслеживать перемещение при нажатии на заметку
        setDraggedNote(index);
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleInputChange = (index: number, field: 'title' | 'description', value: string) => {
        setNotes((prevNotes) => {
          const updatedNotes = [...prevNotes];
          updatedNotes[index] = {
            ...updatedNotes[index],
            [field]: value,
          };
          updateNote(updatedNotes[index].id, updatedNotes[index].title, updatedNotes[index].description, 
            `${updatedNotes[index].date}`, updatedNotes[index].coordinates.x, updatedNotes[index].coordinates.y)
          return updatedNotes;
        });
    };

    useEffect(() => {
        if (draggedNote !== null) {
            setNotes(prevNotes => {
                const updatedNotes = [...prevNotes];
                updatedNotes[draggedNote] = {
                    ...updatedNotes[draggedNote],
                    coordinates: mousePosition,
                };
                return updatedNotes;
            });
        }
    }, [draggedNote, mousePosition]);

    const handleDeleteNote = (noteId: number) => {
        try {
            deleteNote(noteId)
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
        } catch (e) {
            console.log(e)
        }  
    }

    return (
        <div className='work-board'>
            <Navbar />

            <div className='work-board__button'>
                <ButtonMenu text='Создать заметку' onClick={createNote} fontSize='42px' />
            </div>

            {/* Отображаем заметки */}
            <div className='work-board__notes'>
            {notes.map((note, index) => (
                <div
                    key={index}
                    className={`work-board__note ${index === draggedNote ? 'dragged' : ''}`}
                    style={{
                        left: index === draggedNote ? mousePosition.x : note.coordinates.x,
                        top: index === draggedNote ? mousePosition.y : note.coordinates.y,
                        zIndex: index === draggedNote ? 2 : 1,
                        backgroundColor: note.color,
                    }}
                    onMouseDown={(event) => handleMouseDown(index, event)}
                >
                    <div className="note-header">
                    <div className="delete-icon" onClick={() => handleDeleteNote(note.id)}>
                        X
                    </div>
                        <input
                            type="text"
                            className="note-title-input"
                            placeholder="Заголовок"
                            value={note.title}
                            onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                        />
                        <textarea
                            className="note-description-textarea"
                            placeholder="Описание"
                            value={note.description}
                            onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                        />
                        <div className="note-date">
                            {note.date.toLocaleDateString('ru-RU', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
};

export default WorkBoard;
