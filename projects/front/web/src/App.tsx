import React, { useEffect } from 'react'
import { Layout } from 'antd'
import gql from 'graphql-tag'
import config from 'config'
import { useMutation } from 'react-apollo-hooks'
import { useMediaQuery } from 'react-responsive'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import { colors } from '@gepick/assets/styles/cssVariables'
import styled from 'styled-components'
import routes from 'routes/routes'
import DesktopHeader from 'components/header/DesktopHeader'
import MobileHeader from 'components/header/MobileHeader'
import DesktopFooter from 'components/footer/DesktopFooter'
import MobileFooter from 'components/footer/MobileFooter'
import useUrlParamState from '@gepick/components/hooks/useUrlParamState'
import apolloClient from 'services/ApolloClient'
import { LoginWithPatreon, LoginWithPatreonVariables } from 'generatedGraphqlTypes'
import { getPatreonAuthRedirectUrl } from 'utils/utils'
import { TrackEvents } from 'services/GoogleAnalytics'
import './app.css'
import usePartner from 'hooks/usePartner'
import AuthModal from 'components/authModal/AuthModal'

const DesktopAboutUs = React.lazy(() => import('containers/aboutUs/DesktopAboutUs'))
const MobileAboutUs = React.lazy(() => import('containers/aboutUs/MobileAboutUs'))
const PredictionsPage = React.lazy(() => import('containers/predictions/PredictionsPage'))
const ValuePicksPage = React.lazy(() => import('containers/valuePicksPage/ValuePicksPage'))
const StudioPage = React.lazy(() => import('containers/studio/StudioPage'))
const BotExplorerPage = React.lazy(() => import('containers/botExplorer/BotExplorerPage'))
const ProfitablePicksPage = React.lazy(() => import('containers/profitablePicksPage/ProfitablePicksPage'))
const BookmakerExplorerPage = React.lazy(() => import('containers/bookmakerExplorer/BookmakerExplorerPage'))
const BookmakerExplorerIntervalReportPage = React.lazy(() =>
  import('containers/bookmakerExplorer/intervalReportPage/BookmakerExplorerIntervalReportPage'),
)
const SureBetsPage = React.lazy(() => import('containers/sureBets/SureBetsPage'))
const PicksExplorerPage = React.lazy(() => import('containers/picksExplorer/PicksExplorerPage'))
const CryptoBotPage = React.lazy(() => import('containers/crypto/CryptoBotPage'))
const CryptoStrategyBackTestPage = React.lazy(() => import('containers/crypto/CryptoStrategyBackTestPage'))
const CryptoTradeListPage = React.lazy(() => import('containers/crypto/CryptoTradeListPage'))

const { Content } = Layout

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: ${colors.white};
  color: ${colors.black};
`

const loginWithPatreonMutation = gql`
  mutation LoginWithPatreon($code: String!, $redirectUrl: String!) {
    loginWithPatreon(code: $code, redirectUrl: $redirectUrl) {
      token
    }
  }
`

const PatreonAuth = () => {
  const [code] = useUrlParamState('code')
  const [login] = useMutation<LoginWithPatreon, LoginWithPatreonVariables>(loginWithPatreonMutation)

  React.useEffect(() => {
    const request = async () => {
      if (code) {
        const { data } = await login({
          variables: {
            code,
            redirectUrl: getPatreonAuthRedirectUrl(),
          },
          errorPolicy: 'all',
        })

        const token = data?.loginWithPatreon.token ?? ''

        localStorage.setItem(config.JWT_LOCAL_STORAGE_PATH, token)

        location.replace(routes.aboutUs)
      }
    }

    request()
  }, [code, login])

  return null
}

const App: React.FunctionComponent<{}> = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-device-width: 1000px)',
  })

  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const sourcePartnerName = query.get('pid')

  const { partnerUser, setPartnerUser } = usePartner()

  useEffect(() => {
    if (sourcePartnerName && !partnerUser) {
      TrackEvents.valuePicksPage.newUserFromPartner()
      setPartnerUser(sourcePartnerName)
    }
  }, [sourcePartnerName, partnerUser, setPartnerUser])

  const logOut = () => {
    localStorage.removeItem(config.JWT_LOCAL_STORAGE_PATH)
    apolloClient.resetStore()
  }

  return (
    <StyledLayout>
      {isDesktopOrLaptop && <DesktopHeader onLogoutClick={logOut} />}
      {!isDesktopOrLaptop && <MobileHeader onLogoutClick={logOut} />}
      <Content>
        <React.Suspense fallback={<>loading</>}>
          <Switch>
            <Route path={routes.aboutUs}>
              {isDesktopOrLaptop && <DesktopAboutUs />}
              {!isDesktopOrLaptop && <MobileAboutUs />}
            </Route>
            <Route path={routes.profitablePicksPage}>
              <ProfitablePicksPage />
            </Route>
            <Route path={routes.picksExplorerPage}>
              <PicksExplorerPage />
            </Route>
            <Route path={routes.sureBetsPage}>
              <SureBetsPage />
            </Route>
            <Route path={routes.predictions}>
              <PredictionsPage />
            </Route>
            <Route path={routes.botExplorer}>
              <BotExplorerPage />
            </Route>
            <Route path={routes.patreonAuth}>
              <PatreonAuth />
            </Route>
            <Route path={routes.valuePicks}>
              <ValuePicksPage />
            </Route>
            <Route path={routes.studio}>
              <StudioPage />
            </Route>
            <Route path={routes.bookmakerExplorer}>
              <BookmakerExplorerPage />
            </Route>
            <Route path={routes.cryptoBotPage}>
              <CryptoBotPage />
            </Route>
            <Route path={routes.cryptoStrategyBackTestPage}>
              <CryptoStrategyBackTestPage />
            </Route>
            <Route path={routes.cryptoTradeListPage}>
              <CryptoTradeListPage />
            </Route>
            <Route path={routes.bookmakerExplorerIntervalReportPage}>
              <BookmakerExplorerIntervalReportPage />
            </Route>
            <Redirect exact from="/" to={routes.profitablePicksPage} />
          </Switch>
        </React.Suspense>
      </Content>
      {isDesktopOrLaptop && <DesktopFooter />}
      {!isDesktopOrLaptop && <MobileFooter />}
      <AuthModal />
    </StyledLayout>
  )
}

export default App
