import React from 'react'
import { Select as AntdSelect } from 'antd'

interface IOption {
  text?: string
  value: any // eslint-disable-line
}

interface IProps {
  options: IOption[]
  placeholder?: string
  value?: any // eslint-disable-line
  onChange: (value: any) => void // eslint-disable-line
}

const selectStyle = { width: '100%' }

const Select: React.FunctionComponent<IProps> = (props) => {
  return (
    <AntdSelect
      value={props.value}
      virtual={false}
      onChange={props.onChange}
      style={selectStyle}
      placeholder={props.placeholder}
    >
      {props.options.map((option, key) => {
        const text = option.text ?? option.value
        return (
          <AntdSelect.Option value={option.value} key={key}>
            {text}
          </AntdSelect.Option>
        )
      })}
    </AntdSelect>
  )
}

export default Select
