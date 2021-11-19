import React from 'react'
import { PredictionsPageMatchesQueryV2_predictionsPageMatchesV2_matchPredictionsByBot } from 'generatedGraphqlTypes'

interface IProps {
  predictionsByBot: PredictionsPageMatchesQueryV2_predictionsPageMatchesV2_matchPredictionsByBot[]
}

const PredictionsPageMatchPredictions: React.FunctionComponent<IProps> = (props) => {
  return (
    <>
      <tr>
        <th>Bot predictions</th>
      </tr>
      {props.predictionsByBot.map((predictionsByBotItem) => {
        return (
          <tr key={predictionsByBotItem.botDockerImage}>
            <th scope="row" style={{ width: '100px' }}>
              {predictionsByBotItem.botDockerImage}
            </th>
            {predictionsByBotItem.predictions.map((predictionsItem) => {
              return (
                <td key={predictionsItem.bet} className="odd">
                  {predictionsItem?.probability ? predictionsItem?.probability + '%' : '-'}
                </td>
              )
            })}
          </tr>
        )
      })}
    </>
  )
}

export default React.memo(PredictionsPageMatchPredictions)
