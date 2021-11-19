import React from 'react'
import { Select } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import { CountriesListQuery } from '../../generatedGraphqlTypes'

interface IProps {
  selectedCountryId?: string
  onChange: (id: string) => void
}

const countriesListQuery = gql`
  query CountriesListQuery {
    countriesList {
      _id
      name
    }
  }
`

const CountrySelect: React.FunctionComponent<IProps> = (props) => {
  const countriesRes = useQuery<CountriesListQuery>(countriesListQuery)

  const countriesList = countriesRes.data?.countriesList ?? []

  return (
    <Select
      value={props.selectedCountryId}
      showSearch
      style={{ width: '100%' }}
      placeholder="Search Country"
      optionFilterProp="children"
      allowClear
      filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      onChange={props.onChange}
    >
      {countriesList.map((countriesListItem) => {
        return <Select.Option value={countriesListItem._id}>{countriesListItem.name}</Select.Option>
      })}
    </Select>
  )
}

export default CountrySelect
