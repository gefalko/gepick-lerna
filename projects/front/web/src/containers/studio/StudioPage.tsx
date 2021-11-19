import React from 'react'
import { useMutation } from 'react-apollo-hooks'
import PageTitle from 'components/pageTitle/PageTitle'
import { StudioPage } from '@gepick/studio'
import useMe from 'hooks/useMe'
import gql from 'graphql-tag'
import apolloClient from 'services/ApolloClient'
import useBreakPoints from '@gepick/components/hooks/useBreakPoints'
import {
  DayMatchesQuery,
  DayMatchesQueryVariables,
  DayMatchesQuery_matchesByDay,
  UploadBotMutation,
  UploadBotMutationVariables,
} from '../../generatedGraphqlTypes'

const dayMatchesQuery = gql`
  query DayMatchesQuery($props: MatchesByDayQueryInput!) {
    matchesByDay(props: $props) {
      _id
      startTime
      status
      niceStatus
      goalsHomeTeam
      goalsAwayTeam
      leagueName
      countryName
      homeTeamName
      awayTeamName
    }
  }
`

const pushBotMutation = gql`
  mutation UploadBotMutation($props: UploadBotMutationInput!) {
    uploadBot(props: $props) {
      botId
      dockerImage
    }
  }
`

interface IOnUplaodBotData {
  dockerImage: string
  description?: string
  gitRepositoryLink?: string
}

const StudioPageContainer = () => {
  const [uploadBotMutation] = useMutation<UploadBotMutation, UploadBotMutationVariables>(pushBotMutation)
  const { isMobile } = useBreakPoints()
  const [me] = useMe()

  const handleFetchMore = (day: string): Promise<DayMatchesQuery_matchesByDay[]> => {
    return new Promise((resolve, reject) => {
      apolloClient
        .query<DayMatchesQuery, DayMatchesQueryVariables>({
          query: dayMatchesQuery,
          variables: {
            props: {
              day,
              offset: 0,
              limit: 1000,
            },
          },
        })
        .then((r) => {
          resolve(r.data.matchesByDay)
        })
        .catch(reject)
    })
  }

  const handleBotUpload = async (data: IOnUplaodBotData) => {
    const res = await uploadBotMutation({
      variables: { props: data },
      errorPolicy: 'all',
    })

    return { error: res.errors?.[0].message, bot: res.data?.uploadBot }
  }

  if (isMobile) {
    return <>Developer studio not suported for small devices.</>
  }

  return (
    <>
      <PageTitle pageTitle="Prediction bot developer studio" />
      <StudioPage authorized={me !== undefined} onBotUpload={handleBotUpload} fetchMore={handleFetchMore} />
    </>
  )
}

export default StudioPageContainer
