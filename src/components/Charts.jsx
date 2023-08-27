import { useEffect, useMemo, useRef, useState } from "react"
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { getAllRounds, getRawCount, getValidCount } from '../utils'
import moment from "moment";

const Charts = ({ history }) => {
  const el = useRef();

  useEffect(() => {
    echarts.use([
      TitleComponent,
      TooltipComponent,
      GridComponent,
      DatasetComponent,
      TransformComponent,
      LegendComponent,
      BarChart,
      LineChart,
      LabelLayout,
      UniversalTransition,
      CanvasRenderer
    ]);
  }, [])

  const [charts, setCharts] = useState()
  useEffect(() => {
    if (!el.current) return
    setCharts(echarts.init(el.current));
  }, [el])

  const chartOptions = useMemo(() => {
    const names = ['F1', 'F2']
    const rounds = getAllRounds(history);
    const validData = names.map(x => {
      const roundsValidData = rounds.map(r => getValidCount(r, x)(history).filter(x => x.history.length).length);
      return {
        name: `${x}-有效`,
        type: 'bar',
        stack: 'valid',
        data: roundsValidData
      }
    });

    const rawData = names.map(x => {
      const roundsRawData = rounds.map(r => getRawCount(r, x)(history).length);
      return {
        name: `${x}-实际`,
        type: 'line',
        data: roundsRawData
      }
    })

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {},

      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: rounds.map(x => moment(x).format('M/D HH:mm'))
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],

      series: [...validData, ...rawData]
    }
  }, [history]);

  useEffect(() => {
    if (!charts || !chartOptions) return
    charts.setOption(chartOptions)
  }, [chartOptions, charts])

  return <div style={{ width: '100%', height: '500px' }} ref={el}></div>
}

export default Charts