import { memo } from 'react'

/**
 * @param {{
 *   todo: { id: string, text: string, completed: boolean },
 *   onToggle: (id: string) => void,
 *   onDelete: (id: string) => void
 * }} props
 */

const TodoItem = memo(function TodoItem({ todo, onToggle, onDelete }) {
    return (
        <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <label>
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggle(todo.id)}
                />
                <span>{todo.text}</span>
            </label>
            <button className="delete-btn" onClick={() => onDelete(todo.id)}>
                ✕
            </button>
        </li>
    )
})

export default TodoItem