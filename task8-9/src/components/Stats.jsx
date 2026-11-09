/**
 * @param {{ total: number, active: number, completed: number }} props
 */
function Stats({ total, active, completed }) {
    return (
        <div className="stats">
            <span>Всего: <b>{total}</b></span>
            <span>Активных: <b>{active}</b></span>
            <span>Выполнено: <b>{completed}</b></span>
        </div>
    )
}

export default Stats