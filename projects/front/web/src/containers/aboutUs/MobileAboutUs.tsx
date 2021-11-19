import React from 'react'
import Container from '@gepick/components/container/Container'
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

const MobileAboutUs: React.FunctionComponent<{}> = () => {
  return (
    <Container marginBottom={20}>
      <PageTitle quote={quote} hashtag={hashtag} description={description} pageTitle={title} />
      <Container padding={5} justifyContentCenter>
        <Container marginTop={10}>
          <Container>
            <h1 style={brandBook.h1}>Gepick is for bit the bets</h1>
            {topContent}
          </Container>
          <Container>
            <h1 style={brandBook.h1}>Football predictions</h1>
            {footballPredictionsSectionContent}
          </Container>
          <Container>
            <h1 style={brandBook.h1}>Value picks</h1>
            {valuePicksSectionContent}
          </Container>
          <Container>
            <h1 style={brandBook.h1}>Prediction bots</h1>
            {predictionBotsSectionContent}
          </Container>
          <Container>
            <h1 style={brandBook.h1}>Bot developer studio</h1>
            {developerStudioSectionContent}
          </Container>
          <Container>
            <h1 style={brandBook.h1}>Become a patron</h1>
            {patreonSectionContent}
          </Container>
        </Container>
      </Container>
    </Container>
  )
}

export default React.memo(MobileAboutUs)
