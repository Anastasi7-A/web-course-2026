# Todo-list на React (Лабораторная №8-9)

## Что сделано
Интерактивный список задач с фильтрацией (все/активные/завершённые), 
сортировкой (по дате и алфавиту), статистикой и сохранением в localStorage.
Реализованы оптимизации рендеринга: React.memo, useMemo, useCallback.

## Как запустить
npm install

npm run dev

Открыть http://localhost:5173 в браузере.

## Структура
- src/App.jsx — главный компонент, хранит состояние
- src/components/ — дочерние компоненты (TodoForm, TodoList, TodoItem, Filters, Stats, SortControls)
- Оптимизации: TodoItem обёрнут в memo, обработчики в useCallback, вычисления в useMemo

## Оптимизации (Лабораторная 9)
- `React.memo` на компоненте `TodoItem` — предотвращает ре-рендер при неизменных props
- `useCallback` на обработчиках `addTodo`, `toggleTodo`, `deleteTodo` — стабильные ссылки функций
- `useMemo` на `filteredTodos`, `sortedTodos`, `stats` — пересчёт только при изменении зависимостей
- `useEffect` для сохранения в `localStorage` с дебаунсом 500мс