import React, { useState, useEffect } from 'react';
import './WorkBoard.css';
import Navbar from '../navbar/Navbar';
import ButtonMenu from '../button-menu/ButtonMenu';

interface Note {
    title: string;
    description: string;
    coordinates: { x: number; y: number };
    color: string;
}

const WorkBoard = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [draggedNote, setDraggedNote] = useState<number | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const possibleColors = ['#c46c6c', '#c95fbf', '#9952c4', '#475cc4', '#47a7c4', '#47c496', '#47c453', '#8ec447', '#c4c047', '#c49247', '#bf3d2c'];

    const createNote = () => {
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

        const newNote: Note = {
            title: `Заметка ${notes.length + 1}`,
            description: 'Описание заметки',
            coordinates: { x: randomX, y: randomY },
            color: randomColor,
        };

        setNotes([...notes, newNote]);
    };

    React.useEffect(() => {
        // Выводим координаты в консоль при изменении mousePosition
        if (draggedNote !== null) {
            //console.log(`Координаты заметки ${draggedNote + 1}: x=${mousePosition.x}, y=${mousePosition.y}`);
        }
    }, [mousePosition, draggedNote]);

    const handleMouseDown = (index: number, event: React.MouseEvent) => {
        event.stopPropagation();

        // Если клик был на поле ввода, прекращаем обработку
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
            return;
        }

        // Начинаем отслеживать перемещение при нажатии на заметку
        setDraggedNote(index);
        setMousePosition({ x: event.clientX, y: event.clientY });

        // Добавляем обработчики событий на весь документ для обработки перемещения за пределы заметки
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (event: MouseEvent) => {
        // Обновляем позицию мыши при движении
        const updatedMousePosition = { x: event.clientX, y: event.clientY };
        setMousePosition(updatedMousePosition);
    };

    const handleTitleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        setNotes((prevNotes) => {
            const updatedNotes = [...prevNotes];
            updatedNotes[index] = {
                ...updatedNotes[index],
                title: event.target.value,
            };
            return updatedNotes;
        });
    };
    
    const handleDescriptionChange = (index: number, event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes((prevNotes) => {
            const updatedNotes = [...prevNotes];
            updatedNotes[index] = {
                ...updatedNotes[index],
                description: event.target.value,
            };
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

    const handleMouseUp = () => {
        // Прекращаем отслеживать перемещение при отпускании мыши
        setDraggedNote(null);

        // Удаляем обработчики событий после отпускания мыши
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

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
                        <input
                            type="text"
                            className="note-title-input"
                            placeholder="Заголовок"
                            value={note.title}
                            onChange={(e) => handleTitleChange(index, e)}
                        />
                        <textarea
                            className="note-description-textarea"
                            placeholder="Описание"
                            value={note.description}
                            onChange={(e) => handleDescriptionChange(index, e)}
                        />
                        <div className="note-date">
                            {new Date().toLocaleDateString('ru-RU', {
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
