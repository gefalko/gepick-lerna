import React, { useCallback } from 'react'
import { Spin } from 'antd'
import styled from 'styled-components'
import moment, { Moment } from 'moment'
import { head } from 'lodash'
import { useQuery } from 'react-apollo-hooks'
import { InfiniteLoader, List, Index, IndexRange, ListRowProps, AutoSizer } from 'react-virtualized'
import gql from 'graphql-tag'
import Container from '@gepick/components/container/Container'
import useSwitch from '@gepick/components/hooks/useSwitch'
import useBreakPoints from '@gepick/components/hooks/useBreakPoints'
import PageTitle from 'components/pageTitle/PageTitle'
import useUrlParamState from '@gepick/components/hooks/useUrlParamState'
import { colors } from '@gepick/assets/styles/cssVariables'
import ArrowDatePicker from '@gepick/components/datePicker/ArrowDatePicker'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { PredictionsPageMatchesQueryV2, PredictionsPageMatchesQueryV2Variables } from '../../generatedGraphqlTypes'
import PredictionsPageMatch from './predictionsPageMatch/PredictionsPageMatch'
import CountrySelect from './CountrySelect'

interface IStyledMenuSidebar {
  open: boolean
  isMobile: boolean
}

const StyledMenuSidebar = styled.div`
  width: ${({ open }: IStyledMenuSidebar) => (open ? '188px' : '0px')};
  background: ${colors.primary};
  min-height: 100vh;
  padding: 5px;
  padding-top: 20px;
  position: ${({ isMobile }: IStyledMenuSidebar) => (isMobile ? 'fixed' : 'relative')};
  z-index: 1;

  #side_bar_container {
    display: ${({ open }: IStyledMenuSidebar) => (open ? 'block' : 'none')};
    position: fixed;
    width: 170px;
  }

  #controller {
    position: fixed;
    left: ${({ open }: IStyledMenuSidebar) => (open ? '180px' : '0')};
    top: 65px;
    padding: 10px;
    z-index: 1;
    background: ${colors.primary};
    cursor: pointer;
  }
`

const StyledMainContainer = styled.div<{ isMobile: boolean }>`
  background: ${colors.black};
  color: ${colors.white};
  flex-grow: 1;
  padding: ${({ isMobile }) => (isMobile ? '5px' : '20px')};
  min-height: 100vh;
  padding-left: ${({ isMobile }) => (isMobile ? '15px' : '40px')};
`

const predictionsPageMatchesQuery = gql`
  query PredictionsPageMatchesQueryV2($args: PredictionsPageMatchesQueryInput!) {
    predictionsPageMatchesV2(args: $args) {
      _id
      formatedStartTime
      countryFlag
      countryName
      leagueName
      homeTeamName
      awayTeamName
      score {
        halftime
        fulltime
      }
      matchOddsByBookmaker {
        bookmakerId
        bookmakerName
        odds {
          bet
          oddSize
        }
      }
      matchPredictionsByBot {
        botDockerImage
        predictions {
          bet
          probability
        }
      }
    }
  }
`

const iconStyle = {
  fontSize: '20px',
  color: colors.white,
}

const PredictionsPage: React.FunctionComponent<{}> = () => {
  const [selectedDay, setDay] = useUrlParamState('day', moment().format('YYYY-MM-DD'))
  const [countries, setCountries] = useUrlParamState('countries')
  const { isMobile } = useBreakPoints()
  const [filterSidebarOpen, switchFilterSidebarOpen] = useSwitch(!isMobile)

  const dayMatchesQueryRes = useQuery<PredictionsPageMatchesQueryV2, PredictionsPageMatchesQueryV2Variables>(
    predictionsPageMatchesQuery,
    {
      variables: {
        args: {
          day: selectedDay ?? '',
          offset: 0,
          limit: 20,
          coutriesIds: countries ? JSON.parse(countries) : undefined,
        },
      },
      skip: !selectedDay,
    },
  )

  const matches = dayMatchesQueryRes?.data?.predictionsPageMatchesV2 ?? []

  const loadMoreMatches = useCallback(
    (indexRange: IndexRange) => {
      return dayMatchesQueryRes.fetchMore({
        variables: {
          args: {
            offset: indexRange.startIndex,
            limit: 20,
            day: selectedDay ?? '',
            coutriesIds: countries ? JSON.parse(countries) : undefined,
          },
        },
        updateQuery: (prevResults, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prevResults
          }

          return {
            prevResults,
            ...{
              predictionsPageMatchesV2: [
                ...prevResults.predictionsPageMatchesV2,
                ...fetchMoreResult.predictionsPageMatchesV2,
              ],
            },
          }
        },
      })
    },
    [dayMatchesQueryRes, selectedDay, countries],
  )

  const handleDayChange = useCallback(
    (newDay: Moment) => {
      setDay(moment(newDay).format('YYYY-MM-DD'))
      window.scrollTo(0, 0)
    },
    [setDay],
  )

  const date = selectedDay ? new Date(selectedDay) : new Date()

  const isRowLoaded = useCallback(
    ({ index }: Index) => {
      return !!matches[index]
    },
    [matches],
  )

  const rowRenderer = useCallback(
    (listProps: ListRowProps) => {
      const match = matches[listProps.index]

      if (!match) {
        return null
      }

      return (
        <>
          <Container key={listProps.key} style={listProps.style}>
            <PredictionsPageMatch match={match} />
          </Container>
        </>
      )
    },
    [matches],
  )

  const countRowHeight = useCallback(
    (index: Index) => {
      const match = matches[index.index]
      const baseHeight = isMobile ? 170 : 130
      const rowHeight = 23
      const tableHeaderHeight = rowHeight * 2

      const calculateHeight = () => {
        if (match.matchOddsByBookmaker.length === 0 && match.matchPredictionsByBot.length === 0) {
          return baseHeight
        }

        const oddsHeight = match.matchOddsByBookmaker.length * rowHeight
        const probabilitiesHeight = match.matchPredictionsByBot.length * rowHeight

        const probabilitiesHeaderHeight = probabilitiesHeight ? rowHeight : 0

        const resultHeight =
          baseHeight + tableHeaderHeight + probabilitiesHeaderHeight + oddsHeight + probabilitiesHeight

        return resultHeight
      }

      const height = calculateHeight()

      return height
    },
    [matches, isMobile],
  )

  const handleCountryChange = useCallback(
    (id) => {
      if (id) {
        const countriesList = [id]
        setCountries(JSON.stringify(countriesList))
      } else {
        setCountries(id)
      }
    },
    [setCountries],
  )

  return (
    <Container>
      <PageTitle pageTitle="Predictions" />
      <Container flex noWrap>
        <StyledMenuSidebar isMobile={isMobile} open={filterSidebarOpen}>
          <Container id="controller" onClick={switchFilterSidebarOpen}>
            {filterSidebarOpen ? <MenuFoldOutlined style={iconStyle} /> : <MenuUnfoldOutlined style={iconStyle} />}
          </Container>
          <Container id="side_bar_container">
            <Container fullWidth justifyContentCenter>
              <ArrowDatePicker white date={moment(date)} onChange={handleDayChange} />
            </Container>
            <Container marginTop={24} fullWidth justifyContentCenter>
              <CountrySelect
                selectedCountryId={countries ? head(JSON.parse(countries)) : undefined}
                onChange={handleCountryChange}
              />
            </Container>
          </Container>
        </StyledMenuSidebar>
        <StyledMainContainer isMobile={isMobile}>
          {dayMatchesQueryRes.loading && matches.length < 1 && (
            <Container fullWidth justifyContentCenter marginTop={50}>
              <Spin spinning tip="...Loading" />
            </Container>
          )}
          {!dayMatchesQueryRes.loading && matches.length === 0 && <Container textAlignCenter>No predictions</Container>}

          <Container fullHeight>
            <AutoSizer>
              {({ width, height }) => {
                return (
                  <InfiniteLoader
                    threshold={10}
                    minimumBatchSize={20}
                    isRowLoaded={isRowLoaded}
                    loadMoreRows={loadMoreMatches}
                    rowCount={10000}
                  >
                    {({ onRowsRendered, registerChild }) => (
                      <List
                        height={height}
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
                        rowCount={matches.length}
                        rowHeight={countRowHeight}
                        rowRenderer={rowRenderer}
                        width={width}
                      />
                    )}
                  </InfiniteLoader>
                )
              }}
            </AutoSizer>
          </Container>
        </StyledMainContainer>
      </Container>
    </Container>
  )
}

export default PredictionsPage
