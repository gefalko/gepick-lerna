import React from 'react'
import Link from '@gepick/components/link/Link'

interface IProps {
  predictionBotId: string
  botDockerImage: string
}

const BotLink: React.FunctionComponent<IProps> = (props) => {
  return (
    <Link underline targetBlank href={`/prediction-bots?botId=${props.predictionBotId}`}>
      {props.botDockerImage}
    </Link>
  )
}

export default BotLink
