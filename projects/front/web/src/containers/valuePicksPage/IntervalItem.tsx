import React from 'react'
import { LineChartOutlined } from '@ant-design/icons'
import { colors } from '@gepick/assets/styles/cssVariables'
import styled from 'styled-components'
import Container from '@gepick/components/container/Container'
import routes from 'routes/routes'
import Link from '@gepick/components/link/Link'

const StyledContainer = styled.div<{ borderColor: string; isMobile: boolean }>`
  border: 1px solid ${(props) => props.borderColor};
  padding: ${(props) => (props.isMobile ? '16px 8px' : '24px')};
`

const StyledItem = styled.div`
  margin-right: 5px;
`

const StyledChildrenContainer = styled.div`
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid ${colors.green};
`

const StyledIconContainer = styled.div`
  cursor: pointer;

  svg:hover {
    fill: ${colors.yellow};
  }
`

interface IIntervalItemProps {
  intervalKey: string
  betLabelName: string
  betLabelId: number
  bet: string
  allTimeRoi: number
  isMobile: boolean
}

const iconStyle = { fontSize: '18px' }

const IntervalItem: React.FunctionComponent<IIntervalItemProps> = (props) => {
  const link =
    routes.bookmakerExplorerIntervalReportPage +
    '?intervalKey=' +
    props.intervalKey +
    '&bet=' +
    props.bet +
    '&betLabelId=' +
    props.betLabelId

  return (
    <Container marginTop={24} marginBottom={24}>
      <StyledContainer isMobile={props.isMobile} borderColor={props.allTimeRoi > 0 ? colors.green : colors.red}>
        <Container flex justifyContentSpaceBetween>
          <Container flex>
            <Container flex>
              <StyledItem>
                <Container data-onboarding="intervalKey">{props.intervalKey}%</Container>
              </StyledItem>
              <StyledItem>
                <Container data-onboarding="betLabel">{props.betLabelName}</Container>
              </StyledItem>
              <StyledItem>
                <Container data-onboarding="bet">{props.bet}</Container>
              </StyledItem>
            </Container>
            <Container width={8} />
            <StyledIconContainer>
              <Link href={link} targetBlank color={colors.white}>
                <LineChartOutlined style={iconStyle} />
              </Link>
            </StyledIconContainer>
          </Container>
          <Container flex>
            <Container data-onboarding="roi">
              {props.allTimeRoi > 0 && '+'}
              {props.allTimeRoi}%
            </Container>
          </Container>
        </Container>
        {props.children && <StyledChildrenContainer>{props.children}</StyledChildrenContainer>}
      </StyledContainer>
    </Container>
  )
}

export default IntervalItem
