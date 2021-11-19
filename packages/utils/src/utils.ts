import { round } from 'lodash'

export function oddToProbability(odd: number) {
  if (odd < 1) {
    throw new Error('Odd must be greater than 1: ' + odd)
  }

  return Math.round((1 / odd) * 100)
}

export function probabilityToOdd(probability: number) {
  if (probability === 0) {
    return 10000
  }

  if (probability < 0 || probability > 100) {
    throw new Error('Probability must be greater than 1 and less then 100: ' + probability)
  }

  return round(100 / probability, 2)
}

export function isValue(odd: number, probability: number) {
  return probability > oddToProbability(odd)
}

/* eslint-disable-next-line */
export function isDefined(o?: any) {
  return o !== undefined
}

export function daysRangeArray(dayFrom: Date, dateTo: Date) {
  const daysOfRange = []
  for (let d = dayFrom; d <= dateTo; d.setDate(d.getDate() + 1)) {
    daysOfRange.push(new Date(d))
  }

  return daysOfRange
}

export function mapId(obj: { _id?: string }) {
  return obj._id
}
