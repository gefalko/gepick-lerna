import { round, sumBy } from 'lodash'
import { PickStatusEnum } from '@gepick/database/src/types'

export interface IPick {
  status: PickStatusEnum
  profit?: number
}

export interface IReport {
  report: {
    total: number
    totalCorrect: number
    totalWrong: number
    totalCanceled: number
    totalPending: number
    profit: number
    accuracy?: number
  }
}

export function generateReport(picks: IPick[]): IReport {
  const countByStatus = (status: PickStatusEnum) => {
    return picks.filter((pick) => pick.status === status).length
  }

  const total = picks.length
  const totalWrong = countByStatus(PickStatusEnum.NOT_CORRECT)
  const totalCorrect = countByStatus(PickStatusEnum.CORRECT)
  const totalCanceled = countByStatus(PickStatusEnum.CANCELED)
  const totalPending = countByStatus(PickStatusEnum.PENDING)
  const profit = sumBy(picks, 'profit')

  const countAccuracy = () => {
    if (total - totalCanceled > 0) {
      return round((totalCorrect / (total - totalCanceled)) * 100)
    }

    return undefined
  }

  return {
    report: {
      total,
      totalCorrect,
      totalWrong,
      totalCanceled,
      totalPending,
      profit: profit ? round(profit, 2) : 0,
      accuracy: countAccuracy(),
    },
  }
}
