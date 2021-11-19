import React from 'react'
import Image from '@gepick/components/image/Image'
import Container from '@gepick/components/container/Container'
import { PredictionsPageMatchesQueryV2_predictionsPageMatchesV2 } from 'generatedGraphqlTypes'

interface IProps {
  match: PredictionsPageMatchesQueryV2_predictionsPageMatchesV2
}

const PredictionsPageMatchDetails: React.FunctionComponent<IProps> = (props) => {
  return (
    <Container flex>
      <Container paddingRight={10}>
        <Image height={45} width={40} alt="country flag" src={props.match.countryFlag ?? ''} />
      </Container>
      <Container>
        <Container>
          {props.match.countryName} {props.match.leagueName}
        </Container>
        <Container flex>
          <Container marginRight={5}>{props.match.formatedStartTime}</Container>
          <Container noWrap marginRight={5}>
            {props.match.homeTeamName} - {props.match.awayTeamName}
          </Container>
          <Container>
            {props.match.score?.halftime && (
              <>
                ({props.match.score?.halftime}) {props.match.score?.fulltime}
              </>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  )
}

export default React.memo(PredictionsPageMatchDetails)
