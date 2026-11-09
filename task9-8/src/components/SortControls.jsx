/**
 * @param {{
 *   value: 'date-desc' | 'date-asc' | 'alpha',
 *   onChange: (sort: 'date-desc' | 'date-asc' | 'alpha') => void
 * }} props
 */
function SortControls({ value, onChange }) {
    return (
        <div className="sort-controls" style={{ marginBottom: '16px' }}>
            <label htmlFor="sort-select" style={{ marginRight: '8px' }}>
                Сортировка:
            </label>
            <select
                id="sort-select"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
                <option value="date-desc">Сначала новые</option>
                <option value="date-asc">Сначала старые</option>
                <option value="alpha">По алфавиту (А→Я)</option>
            </select>
        </div>
    )
}

export default SortControls