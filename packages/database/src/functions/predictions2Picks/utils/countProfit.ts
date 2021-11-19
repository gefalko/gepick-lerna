import { round } from 'lodash'

interface IArgs {
  isPickCorrect?: boolean
  odd: number
}

function countProfit(args: IArgs) {
  if (args.isPickCorrect == null) {
    return undefined
  }

  return round(args.isPickCorrect ? args.odd - 1 : -1, 2)
}

export default countProfit
