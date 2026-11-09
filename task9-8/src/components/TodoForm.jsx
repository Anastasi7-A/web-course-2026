import { useState } from 'react'

/**
 * @param {{ onAdd: (text: string) => void }} props
 */
function TodoForm({ onAdd }) {
    const [text, setText] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!text.trim()) return
        onAdd(text)
        setText('')
    }

    return (
        <form className="todo-form" onSubmit={handleSubmit}>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Что нужно сделать?"
                autoFocus
            />
            <button type="submit" disabled={!text.trim()}>
                Добавить
            </button>
        </form>
    )
}

export default TodoForm