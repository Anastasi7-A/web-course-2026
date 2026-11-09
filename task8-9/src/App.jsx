import { useState, useMemo, useCallback, useEffect } from 'react'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import Filters from './components/Filters'
import Stats from './components/Stats'
import SortControls from './components/SortControls'

function App() {
    const [todos, setTodos] = useState(() => {
        try {
            const saved = localStorage.getItem('todos')
            if (saved) {
                return JSON.parse(saved).map((t) => ({
                    ...t,
                    createdAt: new Date(t.createdAt),
                }))
            }
        } catch (e) {
            console.error('Failed to load todos from localStorage', e)
        }
        return []
    })

    const [filter, setFilter] = useState('all')
    const [sort, setSort] = useState('date-desc')

    useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.setItem('todos', JSON.stringify(todos))
        }, 500)

        return () => clearTimeout(timeout)
    }, [todos])

    const addTodo = useCallback((text) => {
        const newTodo = {
            id: crypto.randomUUID(),
            text: text.trim(),
            completed: false,
            createdAt: new Date(),
        }
        setTodos((prev) => [newTodo, ...prev])
    }, [])

    const toggleTodo = useCallback((id) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        )
    }, [])

    const deleteTodo = useCallback((id) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id))
    }, [])

    const filteredTodos = useMemo(() => {
        if (filter === 'active') return todos.filter((t) => !t.completed)
        if (filter === 'completed') return todos.filter((t) => t.completed)
        return todos
    }, [todos, filter])

    const sortedTodos = useMemo(() => {
        const copy = [...filteredTodos]
        switch (sort) {
            case 'date-asc':
                return copy.sort((a, b) => a.createdAt - b.createdAt)
            case 'alpha':
                return copy.sort((a, b) => a.text.localeCompare(b.text, 'ru'))
            case 'date-desc':
            default:
                return copy.sort((a, b) => b.createdAt - a.createdAt)
        }
    }, [filteredTodos, sort])

    const stats = useMemo(() => ({
        total: todos.length,
        active: todos.filter((t) => !t.completed).length,
        completed: todos.filter((t) => t.completed).length,
    }), [todos])

    return (
        <div>
            <h1>📝 Мои задачи</h1>
            <TodoForm onAdd={addTodo} />
            <Stats {...stats} />
            <Filters current={filter} onChange={setFilter} />
            <SortControls value={sort} onChange={setSort} />
            <TodoList
                todos={sortedTodos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
            />
        </div>
    )
}

export default App