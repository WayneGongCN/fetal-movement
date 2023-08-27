import moment from "moment";

export const getAllDate = (history) => {
  const times = history.map(x => x.time).map((x => moment(x).format('YYYY/MM/DD')))
  return [...new Set([...times])]
}


export const ROUND_TIME = 60 * 60 * 1000;
export const ROUND_GAP = 5 * 60 * 1000

export function getValidCount(round, name) {
  const gapLen = ROUND_TIME / ROUND_GAP;
  const gapArr = Array.from({ length: gapLen }, (v, idx) => [round + (ROUND_GAP * idx), round + (ROUND_GAP * (idx + 1))])

  return function (history) {
    const curRoundHistory = getRawCount(round, name)(history)
    return gapArr
      .map(([start, end]) => {
        const validHistory = curRoundHistory.filter(x => x.time >= start && x.time < end);
        return { round, start, end, history: validHistory }
      })
  }
}

export function getRawCount(round, name) {
  return function (history) {
    return history.filter(x => x.round === round && x.name === name)
  }
}