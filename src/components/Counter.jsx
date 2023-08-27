import { useMemo } from 'react';
import { createRecord } from '../App'
import './Counter.css'
import { getValidCount, getRawCount } from '../utils'

const Counter = ({ name, round, history, setHistory }) => {
  const handleClick = () => {
    if (!round) return alert('请先开始计数！')
    const record = createRecord(round)(name)
    setHistory(history.concat(record))
  }

  const rawCount = useMemo(() => {
    const res = getRawCount(round, name)(history);
    console.log('当前回合实际胎动记录', res)
    return res.length
  }, [round, name, history]);

  const validCount = useMemo(() => {
    const res = getValidCount(round, name)(history)
    console.log('当前回合有效胎动记录', res)
    return res.filter(x => x.history.length).length
  }, [round, name, history]);

  return <button className="com-counter" onClick={handleClick}>
    <p>{name}</p>
    <p>实际胎动 {rawCount} 次</p>
    <p>有效胎动 {validCount} 次</p>
  </button>
}


export default Counter