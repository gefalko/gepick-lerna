import React from 'react'
import { PredictionsPageMatchesQueryV2_predictionsPageMatchesV2_matchOddsByBookmaker } from 'generatedGraphqlTypes'

interface IProps {
  oddsByBookmaker: PredictionsPageMatchesQueryV2_predictionsPageMatchesV2_matchOddsByBookmaker[]
}

const bookmakerNameStyle = { minWidth: '100px' }

const PredictionsPageMatchOdds: React.FunctionComponent<IProps> = (props) => {
  return (
    <>
      {props.oddsByBookmaker.map((oddsByBookmakerItem) => {
        return (
          <tr key={oddsByBookmakerItem.bookmakerId}>
            <th scope="row" style={bookmakerNameStyle}>
              {oddsByBookmakerItem.bookmakerName}
            </th>
            {oddsByBookmakerItem.odds.map((oddsItem) => {
              return (
                <td key={oddsItem.bet} className="odd">
                  {oddsItem.oddSize ?? '-'}
                </td>
              )
            })}
          </tr>
        )
      })}
    </>
  )
}

export default React.memo(PredictionsPageMatchOdds)
