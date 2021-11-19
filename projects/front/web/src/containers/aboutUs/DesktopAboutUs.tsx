import React from 'react'
import Container from '@gepick/components/container/Container'
import Image from '@gepick/components/image/Image'
import Text from '@gepick/components/text/Text'
import robotSrc from '@gepick/assets/images/robot.png'
import predictionsSrc from '@gepick/assets/images/predictions.png'
import developerSrc from '@gepick/assets/images/developer.svg'
import vipPicksSrc from '@gepick/assets/images/vipPicks.png'
import patreonSrc from '@gepick/assets/images/patreon.png'
import victorySrc from '@gepick/assets/images/victory.png'
import brandBook from '@gepick/assets/styles/brandBook'
import PageTitle from 'components/pageTitle/PageTitle'
import {
  topContent,
  footballPredictionsSectionContent,
  valuePicksSectionContent,
  predictionBotsSectionContent,
  developerStudioSectionContent,
  patreonSectionContent,
} from './Content'
import { title, description, quote, hashtag } from './metaData'

interface IItemProps {
  title: string
  imageSrc: string
  imageOnLeft?: boolean
}

const Item: React.FunctionComponent<IItemProps> = (props) => {
  const renderContent = () => {
    if (!props.imageOnLeft) {
      return (
        <>
          <Container width="70%">
            <h1 style={brandBook.h1}>{props.title}</h1>
            {props.children}
          </Container>
          <Container>
            <Container height="100%" alignItemsCenter>
              <Text fullWidth textAlignRight>
                <Image height={150} src={props.imageSrc} alt={props.title} />
              </Text>
            </Container>
          </Container>
        </>
      )
    }

    return (
      <>
        <Container width="30%">
          <Container height="100%" alignItemsCenter>
            <Text fullWidth>
              <Image height={150} src={props.imageSrc} alt={props.title} />
            </Text>
          </Container>
        </Container>
        <Container width="70%">
          <h1 style={brandBook.h1}>{props.title}</h1>
          {props.children}
        </Container>
      </>
    )
  }

  return (
    <Container marginBottom={40} justifyContentSpaceBetween noWrap>
      {renderContent()}
    </Container>
  )
}

const DesktopAboutUs: React.FunctionComponent<{}> = () => {
  return (
    <Container marginBottom={50}>
      <PageTitle quote={quote} hashtag={hashtag} description={description} pageTitle={title} />
      <Container justifyContentCenter>
        <Container maxWidth={800} marginTop={30}>
          <Item title="Gepick is for bit the bets" imageSrc={victorySrc}>
            {topContent}
          </Item>
          <Item title="Football predictions" imageOnLeft imageSrc={predictionsSrc}>
            {footballPredictionsSectionContent}
          </Item>
          <Item title="Value picks" imageSrc={vipPicksSrc}>
            {valuePicksSectionContent}
          </Item>
          <Item title="Prediction bots" imageOnLeft imageSrc={robotSrc}>
            {predictionBotsSectionContent}
          </Item>
          <Item title="Bot developer studio" imageSrc={developerSrc}>
            {developerStudioSectionContent}
          </Item>
          <Item title="Become a patron" imageOnLeft imageSrc={patreonSrc}>
            {patreonSectionContent}
          </Item>
        </Container>
      </Container>
    </Container>
  )
}

export default React.memo(DesktopAboutUs)
