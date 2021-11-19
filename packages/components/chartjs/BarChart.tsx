import React, { useCallback, useEffect, useRef, useState } from 'react'
import Chart, { ChartDataSets } from 'chart.js'
import Container from '../container/Container'

export interface IBarChartDataItem {
  x: string
  y: number
}

export interface IBarChartProps {
  data: IBarChartDataItem[]
}

const createBarChart = (canvas: HTMLCanvasElement, data: ChartDataSets['data']): Chart => {
  Chart.defaults.global.defaultFontFamily = 'gordita, sans-serif'

  const chartData = (data as IBarChartDataItem[]).map((item) => item.y)
  const labels = (data as IBarChartDataItem[]).map((item) => item.x)

  return new Chart(canvas, {
    type: 'line',
    data: {
      datasets: [
        {
          steppedLine: true,
          data: chartData,
        },
      ],
      labels,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            type: 'category',
          },
        ],
      },
    },
  })
}

const BarChart: React.FunctionComponent<IBarChartProps> = (props) => {
  const { data } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [chart, setChart] = useState<Chart | null>(null)

  const chartInit = useCallback((chartData: IBarChartDataItem[]) => {
    const canvas = canvasRef.current

    if (canvas == null) {
      return
    }

    setChart(createBarChart(canvas, chartData))
  }, [])

  const updateData = useCallback(
    (chartData: IBarChartDataItem[]) => {
      if (chart == null) {
        return
      }

      const dataset = chart.data.datasets?.[0]

      if (dataset == null) {
        return
      }

      dataset.data = chartData
      chart.update()
    },
    [chart],
  )

  useEffect(() => {
    if (chart == null) {
      chartInit(data)
    } else {
      updateData(data)
    }
  }, [data])

  return (
    <Container position="relative" width="100%" height="100%">
      <canvas ref={canvasRef} />
    </Container>
  )
}

export default React.memo(BarChart)
