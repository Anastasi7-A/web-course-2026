/**
 * @param {{
 *   current: 'all' | 'active' | 'completed',
 *   onChange: (filter: 'all' | 'active' | 'completed') => void
 * }} props
 */
function Filters({ current, onChange }) {
    const buttons = [
        { value: 'all', label: 'Все' },
        { value: 'active', label: 'Активные' },
        { value: 'completed', label: 'Завершённые' },
    ]

    return (
        <div className="filters">
            {buttons.map((btn) => (
                <button
                    key={btn.value}
                    className={current === btn.value ? 'active' : ''}
                    onClick={() => onChange(btn.value)}
                >
                    {btn.label}
                </button>
            ))}
        </div>
    )
}

export default Filters