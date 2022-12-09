import { IconButton, Menu, MenuItem } from '@mui/material'
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  DoughnutController,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  PolarAreaController,
  RadialLinearScale,
  Tooltip
} from 'chart.js'
import { MouseEvent, ReactNode, useState } from 'react'
import { Chart as ReactChart } from 'react-chartjs-2'
import { useSelector } from 'react-redux'

import ChartIcon from '../../../../components/icons/chart.icon'
import RefreshIcon from '../../../../components/icons/refresh-cw.icon'
import css from './graph.module.scss'

import type { storeType } from '../../../../types'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  BarController,
  PolarAreaController,
  DoughnutController,
  PieController,
  LineController,
  LinearScale,
  RadialLinearScale,
  CategoryScale,
  PointElement
)

const chartType = ['bar', 'doughnut', 'line', 'pie', 'polarArea'] as const

type ChartType = typeof chartType[number]

type ChartProps = {
  chart: ChartType
  data: number[]
  labels: string[]
}

type GraphProps = {
  data: {
    icon: ReactNode
    label: string
    value: number
  }[]
  headline: string
  onRefresh: () => any
  isFetching: boolean
  initialChart: ChartType
}

const Chart = ({ chart, data, labels }: ChartProps) => {
  const { palette } = useSelector((store: storeType) => store.coinWallet)

  return (
    <ReactChart
      type={chart}
      options={{
        plugins: { legend: { display: false } },
        maintainAspectRatio: true,
        scales: { y: { beginAtZero: true } },
        aspectRatio: 1,
        responsive: true
      }}
      data={{
        labels,
        datasets: [
          {
            data,
            borderWidth: 2,
            backgroundColor: palette.bg,
            borderColor: chart === 'line' ? undefined : palette.bg
          }
        ]
      }}
    />
  )
}

const Graph = ({ data, initialChart, headline, isFetching, onRefresh }: GraphProps) => {
  const { palette } = useSelector((store: storeType) => store.coinWallet)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const [chartType, setChartType] = useState<ChartType>(initialChart)

  const changeChartType = (type: ChartType) => () => {
    setChartType(type)
    handleClose()
  }

  return (
    <div className={css.card}>
      <div className={css.header}>
        <h5>{headline}</h5>
        <div className={css.options}>
          <IconButton onClick={onRefresh}>
            <span className={`${css.icon} ${isFetching && css.loading}`}>
              <RefreshIcon />
            </span>
          </IconButton>
          <span className={css.separator} />
          <IconButton
            aria-label="charts"
            id={`chart-button-${headline}`}
            aria-controls={open ? 'chart-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <ChartIcon />
          </IconButton>
          <Menu
            id="chart-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': `chart-button-${headline}`
            }}
          >
            <MenuItem onClick={changeChartType('bar')}>Bar</MenuItem>
            <MenuItem onClick={changeChartType('line')}>Line</MenuItem>
            <MenuItem onClick={changeChartType('doughnut')}>doughnut</MenuItem>
            <MenuItem onClick={changeChartType('pie')}>Pie</MenuItem>
            <MenuItem onClick={changeChartType('polarArea')}>Polar Area</MenuItem>
          </Menu>
        </div>
      </div>
      <div className={css.graph_wrapper}>
        <Chart chart={chartType} data={data.map(({ value }) => value)} labels={data.map(({ label }) => label)} />
      </div>
      <ul className={css.labels}>
        {data.map(({ label, icon, value }, indx) => {
          const ind = indx % palette.bg.length
          return (
            <li key={label}>
              <div className={css.label_wrapper}>
                <span
                  style={{
                    backgroundColor: palette.bg[ind]
                  }}
                  className={`${css.icon} ${css[palette.text[ind]]}`}
                >
                  {icon}
                </span>
                <span className={css.label}>{label}</span>
              </div>
              <span className={css.value}>{value.toFixed(2)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { Graph }
