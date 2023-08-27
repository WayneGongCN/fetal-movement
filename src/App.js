import './App.css';
import Counter from './components/Counter'
import Charts from './components/Charts'
import { useMemo, useState } from 'react';
import { useEffect } from 'react';
import moment from 'moment';
import { ROUND_TIME } from './utils'

export function createRecord(round) {
  return function (name) {
    return {
      round,
      name,
      time: Date.now(),
      delete: false
    }
  }
}

function App() {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const historyStr = localStorage.getItem('fm-history') || '[]';
    setHistory(JSON.parse(historyStr))
  }, []);
  useEffect(() => {
    if (history.length) localStorage.setItem('fm-history', JSON.stringify(history))
  }, [history]);

  const [rounds, setRounds] = useState([])
  useEffect(() => {
    const roundsStr = localStorage.getItem('fm-rounds') || '[]';
    setRounds(JSON.parse(roundsStr))
  }, []);
  useEffect(() => {
    if (rounds.length) localStorage.setItem('fm-rounds', JSON.stringify(rounds))
  }, [rounds]);

  const curRound = useMemo(() => {
    const lastRound = rounds.length && rounds[rounds.length - 1].time
    return (lastRound + ROUND_TIME) > Date.now() ? lastRound : null
  }, [rounds])
  const [roundCountdown, setCountdownStr] = useState()
  useEffect(() => {
    if (!curRound) return
    setInterval(() => {
      setCountdownStr(moment.utc(moment(curRound + ROUND_TIME).diff(moment())).format('mm 分 ss 秒'))
    }, [])
  }, [curRound])

  const handleStartRound = () => {
    const now = Date.now();
    setRounds(rounds.concat({ time: now }))
  }

  return (
    <div className="App">
      <div>
        {
          curRound ? <>
            <div>
              距本轮计数结束 {roundCountdown}
            </div>
          </> : <button onClick={handleStartRound}>开始计数</button>
        }
      </div>

      <div className='container'>
        <Counter name="F1" round={curRound} history={history} setHistory={setHistory} />
        <Counter name="F2" round={curRound} history={history} setHistory={setHistory} />
      </div>

      <div>
        <Charts history={history} rounds={rounds} />
      </div>
    </div>
  );
}

export default App;
