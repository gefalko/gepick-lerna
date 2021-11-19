import React from 'react'
import { Progress } from 'antd'
import Container from '@gepick/components/container/Container'
import styled from 'styled-components'
import { colors } from '@gepick/assets/styles/cssVariables'
import BecomeAPatronButton from '@gepick/components/becomeAPatronButton/BecomeAPatronButton'
import Link from '@gepick/components/link/Link'

const StyledPatronBenfitsContainer = styled(Container)`
  font-size: 12px;
`

const StyledPatreonDisclaimer = styled(Container)`
  max-width: 720px;
  border: 1px solid ${colors.green};

  padding: 16px;

  .ant-progress-text {
    color: ${colors.white};
    width: 110px;
  }

  .ant-progress-show-info .ant-progress-outer {
    margin-right: calc(-110px - 8px);
    padding-right: calc(110px + 8px);
  }
`

const PatreonDisclaimer = React.memo(() => {
  return (
    <Container marginBottom={20}>
      <StyledPatreonDisclaimer>
        <Progress
          percent={70}
          format={() => (
            <span>
              <b>7 of 10 </b>
              <span>patrons</span>
            </span>
          )}
        />
        <Container justifyContentSpaceBetween>
          <Container alignItemsCenter marginTop={8} marginBottom={8}>
            <i>
              When gepick reach 10 patrons, I’ll create a new prediction bot based on &nbsp;
              <Link href="http://www.90minut.pl/misc/maher.pdf" targetBlank underline>
                M.J. Maher paper.
              </Link>
            </i>
          </Container>
          <Container>
            <Container marginBottom={8}>
              <BecomeAPatronButton />
            </Container>
            <StyledPatronBenfitsContainer>
              <Container>- patrons unlock daily value picks</Container>
              <Container>- patrons get monthly bookmaker and prediction bots performance reports to email</Container>
              <Container>- patrons get direct support on how to use gepick</Container>
            </StyledPatronBenfitsContainer>
          </Container>
        </Container>
      </StyledPatreonDisclaimer>
    </Container>
  )
})

export default PatreonDisclaimer
