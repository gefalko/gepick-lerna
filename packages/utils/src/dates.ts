import * as moment from 'moment'

export function formatedYestardayDate() {
  return moment().subtract(1, 'days').format('YYYY-MM-DD')
}

export function formatedLastWeek() {
  const week = moment().isoWeek() - 1
  const year = moment().year()

  return year + '-' + week
}

export function toGepickMomentDate(day: string) {
  const time = '06:00:00+00:00'
  const dateString = `${day}T${time}`

  const dateTime = moment(dateString)

  return dateTime
}

export function toGepickOneDayInterval(fromDay: string) {
  const fromDatetime = toGepickMomentDate(fromDay)
  const toDatetime = moment(fromDatetime).add(1, 'days')

  return { fromDatetime, toDatetime }
}

export function toDbDate(day: string) {
  const time = '00:00:00+00:00'
  const dateString = `${day}T${time}`

  return moment(dateString)
}

export function toOneDayInterval(fromDay: string) {
  const fromDatetime = toDbDate(fromDay)
  const toDatetime = moment(fromDatetime).add(1, 'days')

  return { fromDatetime, toDatetime }
}

export function enumerateDaysBetweenDates(startDate: string | Date, endDate: string | Date): string[] {
  let dates = []
  let currDate = startDate
  while (moment(currDate) <= moment(endDate)) {
    dates.push(currDate.toString())
    currDate = moment(currDate).add(1, 'days').format('YYYY-MM-DD')
  }

  return dates
}

interface IInterval {
  from: string | Date
  to: string | Date
}

export function isDateBetween(date: string | Date, interval: IInterval) {
  return moment(date).isBetween(interval.from, interval.to)
}

export function isSameDays(date1: string | Date, date2: string | Date) {
  return moment(date1).isSame(date2, 'day')
}
