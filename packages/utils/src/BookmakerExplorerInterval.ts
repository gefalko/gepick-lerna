export type IntervalKeyType =
  | '0-10'
  | '11-20'
  | '21-30'
  | '31-40'
  | '41-50'
  | '51-60'
  | '61-70'
  | '71-80'
  | '81-90'
  | '91-100'

export interface IBookmakerExplorerInterval {
  key: IntervalKeyType
  from: number
  to: number
}

export const availableIntervals: IBookmakerExplorerInterval[] = [
  {
    key: '0-10',
    from: 0,
    to: 10,
  },
  {
    key: '11-20',
    from: 11,
    to: 20,
  },
  {
    key: '21-30',
    from: 21,
    to: 30,
  },
  {
    key: '31-40',
    from: 31,
    to: 40,
  },
  {
    key: '41-50',
    from: 41,
    to: 50,
  },
  {
    key: '51-60',
    from: 51,
    to: 60,
  },
  {
    key: '61-70',
    from: 61,
    to: 70,
  },
  {
    key: '71-80',
    from: 71,
    to: 80,
  },
  {
    key: '81-90',
    from: 81,
    to: 90,
  },
  {
    key: '91-100',
    from: 91,
    to: 100,
  },
]
