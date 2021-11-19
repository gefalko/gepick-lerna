import React from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import useBreakPoints from '@gepick/components/hooks/useBreakPoints'
import { colors } from '@gepick/assets/styles/cssVariables'
import Container from '@gepick/components/container/Container'
import BecomeAPatronButton from '@gepick/components/becomeAPatronButton/BecomeAPatronButton'
import PageTitle from 'components/pageTitle/PageTitle'
import useMe from 'hooks/useMe'
import Link from '@gepick/components/link/Link'
import useOpenAuthModal from 'components/authModal/useOpenAuthModal'
import { ProfitablePicksPageDataQuery } from '../../generatedGraphqlTypes'
import Statistic from './Statistic'
import Pick from './Pick'

const profitablePicksPageDataQuery = gql`
  query ProfitablePicksPageDataQuery {
    profitablePicksPageData {
      statistic {
        total
        totalFinished
        totalCorrect
        totalNotCorrect
        totalProfit
        profitPerPick
        averageOdd
        correctAverageOdd
      }
      picks {
        probability
        oddProbability
        value
        profit
        odd
        bookmakerName
        betNiceName
        isPickWin
        countryFlag
        matchNiceStatus
        matchStartTime
        countryName
        leagueName
        homeTeamName
        awayTeamName
        score
      }
    }
  }
`

const StyledMainContainer = styled(Container)<{ isMobile: boolean }>`
  background: ${colors.black};
  color: ${colors.white};
  flex-grow: 1;
  padding: ${({ isMobile }) => (isMobile ? '5px' : '20px')};
  min-height: 100vh;
  padding-left: ${({ isMobile }) => (isMobile ? '15px' : '40px')};
`

const StyledPatronDisclaimerContainer = styled(Container)`
  border: 1px solid ${colors.primary};
`

const StyledPatronBenfitsContainer = styled(Container)`
  font-size: 14px;
`

const ProfitablePicksPage: React.FunctionComponent<{}> = () => {
  const openAuthModal = useOpenAuthModal()
  const { isMobile } = useBreakPoints()
  const [me, meLoading] = useMe()

  const isPatron = meLoading || me?.patreonData?.will_pay_amount_cents

  const profitablePicksPageDataQueryRes = useQuery<ProfitablePicksPageDataQuery>(profitablePicksPageDataQuery)

  const picks = profitablePicksPageDataQueryRes.data?.profitablePicksPageData.picks ?? []
  const statistic = profitablePicksPageDataQueryRes.data?.profitablePicksPageData.statistic

  return (
    <StyledMainContainer justifyContentCenter isMobile={isMobile}>
      <PageTitle pageTitle="Profitable picks" />
      <Container maxWidth={1450}>
        {statistic && (
          <Container marginBottom={32}>
            <Statistic statistic={statistic} />
          </Container>
        )}

        {!isPatron && (
          <StyledPatronDisclaimerContainer padding={16} marginBottom={32}>
            <Container justifyContentCenter>
              To unlock profitable picks, please <Container width={5} />
              <Link onClick={openAuthModal}>log in</Link>.
            </Container>
            {false && (
              <>
                <Container alignItemsCenter justifyContentCenter>
                  <BecomeAPatronButton />
                  <Container width={5} /> from 1$/month and start to get profit from betting.
                </Container>
                <StyledPatronBenfitsContainer justifyContentCenter marginTop={16}>
                  <Container>
                    Gepick goal is to create software-based predictions to defeat bookmakers. Your support allows
                    building better bots, better bots more profit for patrons, and most important more headache for
                    bookmakers.
                  </Container>
                  <Container>
                    Become a patron now and unlock software-based profitable picks. Patreon is a membership platform
                    that makes it easy for creators to get paid.
                  </Container>
                </StyledPatronBenfitsContainer>
              </>
            )}
          </StyledPatronDisclaimerContainer>
        )}
        {picks.map((picksItem) => {
          return (
            <Container marginBottom={16}>
              <Pick pick={picksItem} />
            </Container>
          )
        })}
      </Container>
    </StyledMainContainer>
  )
}

export default ProfitablePicksPage
