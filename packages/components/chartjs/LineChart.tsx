import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js'
import Container from '../container/Container'

export interface ILineChartDataItem {
  x: string
  y: number
}

interface IDataSet {
  backgroundColor?: string | string[]
  data: ILineChartDataItem[] | number[]
  steppedLine?: boolean
  showLine?: boolean
  type?: string
  fill?: boolean
}

interface ICreateChartProps {
  canvas: HTMLCanvasElement
  datasets: IDataSet[]
  labels: string[]
}

const createLineChart = (props: ICreateChartProps): Chart => {
  Chart.defaults.global.defaultFontFamily = 'gordita, sans-serif'

  return new Chart(props.canvas, {
    type: 'line',
    data: {
      datasets: props.datasets,
      labels: props.labels,
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

export interface ILineChartProps {
  datasets: IDataSet[]
  labels: string[]
  onComplete?: () => void
}

const LineChart: React.FunctionComponent<ILineChartProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (canvas == null) {
      return
    }

    createLineChart({ canvas, datasets: props.datasets, labels: props.labels })
  }, [props.datasets, props.labels])

  return (
    <Container position="relative" width="100%" height="100%">
      <canvas ref={canvasRef} />
    </Container>
  )
}

export default LineChart
