import React, { useMemo } from 'react'
import { DatePicker as AntdDatePicker, Select } from 'antd'
import moment, { Moment } from 'moment'
import locale from 'antd/es/date-picker/locale/en_GB'
import useUrlParamState from '../hooks/useUrlParamState'
import Container from '../container/Container'
import DatePicker from '../datePicker/DatePicker'

const { Option } = Select

export enum PeriodTypeEnum {
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

interface IValuePickerProps {
  peridoType: PeriodTypeEnum
  value: string
  onChange: (value: string) => void
}

const ValuePicker: React.FunctionComponent<IValuePickerProps> = (props) => {
  if (props.peridoType === PeriodTypeEnum.DAILY) {
    const day = new Date(props.value)

    const handleDayChange = (value: Date) => {
      props.onChange(moment(value).format('YYYY-MM-DD'))
    }

    return <DatePicker compact value={day} onChange={handleDayChange} />
  }

  if (props.peridoType === PeriodTypeEnum.WEEKLY) {
    const handleWeekChange = (value: Moment | null) => {
      if (value) {
        props.onChange(value.format('YYYY-W'))
      }
    }

    const [year, yearWeek] = props.value.split('-')

    const week = moment().year(parseInt(year, 10)).isoWeek(parseInt(yearWeek, 10))

    return <AntdDatePicker locale={locale} onChange={handleWeekChange} picker="week" value={week} />
  }

  return null
}

const defaultDay = moment().format('YYYY-MM-DD')
const defaultWeek = moment().format('YYYY-W')

interface IProps {
  periodType: PeriodTypeEnum
  periodValue: string
  defaultDay?: string
  defaultWeek?: string
  onPeriodTypeChange: (periodType: PeriodTypeEnum) => void
  onValueChange: (value: string) => void
}

const PeriodSelector: React.FunctionComponent<IProps> = (props) => {
  const handleChangePeriodType = (value: PeriodTypeEnum) => {
    props.onPeriodTypeChange(value)

    if (value === PeriodTypeEnum.DAILY) {
      props.onValueChange(props.defaultDay ?? defaultDay)
    }

    if (value === PeriodTypeEnum.WEEKLY) {
      props.onValueChange(props.defaultWeek ?? defaultWeek)
    }
  }

  return (
    <Container>
      <Container flex>
        <Container alignItemsCenter>
          <span style={{ fontWeight: 400 }}>Report period: </span>
        </Container>
        <Container width={4} />
        <Select value={props.periodType} onChange={handleChangePeriodType}>
          <Option value={PeriodTypeEnum.DAILY}>Daily</Option>
          <Option value={PeriodTypeEnum.WEEKLY}>Weekly</Option>
        </Select>
        <Container width={4} />
        <ValuePicker value={props.periodValue} onChange={props.onValueChange} peridoType={props.periodType} />
      </Container>
    </Container>
  )
}

interface IUsePeriodSelectorResponse {
  selectedPeriodType: PeriodTypeEnum
  selectedPeriodValue: string
  period: {
    year: number
    yearMonth?: number
    monthDay?: number
    yearWeek?: number
  }
  periodSelectorComponent: React.ReactNode
}

interface IUsePeriodSelectorProps {
  defaultDay?: string
  defaultWeek?: string
}

export function usePeriodSelector(props: IUsePeriodSelectorProps): IUsePeriodSelectorResponse {
  const [selectedPeriodType, setPeriodType] = useUrlParamState('periodType', PeriodTypeEnum.DAILY)
  const [selectedPeriodValue, setPeriodValue] = useUrlParamState('periodValue', props.defaultDay ?? defaultDay)

  const periodSelectorComponent = useMemo(() => {
    if (!selectedPeriodType || !selectedPeriodValue) {
      return null
    }

    return (
      <PeriodSelector
        defaultDay={props.defaultDay}
        defaultWeek={props.defaultWeek}
        periodType={selectedPeriodType as PeriodTypeEnum}
        periodValue={selectedPeriodValue}
        onPeriodTypeChange={setPeriodType}
        onValueChange={setPeriodValue}
      />
    )
  }, [selectedPeriodType, selectedPeriodValue, setPeriodType, setPeriodValue, props.defaultDay, props.defaultWeek])

  const period = useMemo(() => {
    if (!selectedPeriodValue) {
      throw new Error('no selectedPeriodValue')
    }

    if (selectedPeriodType === PeriodTypeEnum.WEEKLY) {
      const [year, week] = selectedPeriodValue.split('-')

      return {
        year: parseInt(year, 10),
        yearWeek: parseInt(week, 10),
      }
    }

    const day = moment(selectedPeriodValue).toDate()

    return {
      year: day.getFullYear(),
      yearMonth: day.getMonth(),
      monthDay: day.getDate(),
    }
  }, [selectedPeriodValue, selectedPeriodType])

  return {
    selectedPeriodType: selectedPeriodType as PeriodTypeEnum,
    selectedPeriodValue: selectedPeriodValue as string,
    period,
    periodSelectorComponent,
  }
}

export default PeriodSelector
