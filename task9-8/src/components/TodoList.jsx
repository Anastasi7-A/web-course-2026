import TodoItem from './TodoItem'

/**
 * @param {{
 *   todos: Array<{ id: string, text: string, completed: boolean }>,
 *   onToggle: (id: string) => void,
 *   onDelete: (id: string) => void
 * }} props
 */
function TodoList({ todos, onToggle, onDelete }) {
    if (todos.length === 0) {
        return <p className="empty">Список задач пуст ...</p>
    }

    return (
        <ul className="todo-list">
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    )
}

export default TodoList