import React, { useMemo, useEffect, ReactNode } from 'react'
import { Select } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import useUrlParamState from '@gepick/components/hooks/useUrlParamState'
import { BotsQuery } from '../../generatedGraphqlTypes'

const botsQuery = gql`
  query BotsQuery {
    bots {
      dockerImage
    }
  }
`

const selectSyle = { width: '100%' }

function useBotSelect(): [string, ReactNode] {
  const [botDockerImage, setBotDockerImage] = useUrlParamState('bot')
  const botsQueryRes = useQuery<BotsQuery>(botsQuery)

  const bots = botsQueryRes.data?.bots ?? []

  useEffect(() => {
    if (bots.length && !botDockerImage) {
      setBotDockerImage(bots[0].dockerImage)
    }
  }, [bots, botDockerImage, setBotDockerImage])

  const selectBotComponent = useMemo(() => {
    if (!botDockerImage) {
      return null
    }

    return (
      <Select style={selectSyle} value={botDockerImage} onChange={setBotDockerImage}>
        {bots.map((botsItem) => {
          return <Select.Option value={botsItem.dockerImage}>{botsItem.dockerImage}</Select.Option>
        })}
      </Select>
    )
  }, [bots, botDockerImage, setBotDockerImage])

  return [botDockerImage ?? '', selectBotComponent]
}

export default useBotSelect
