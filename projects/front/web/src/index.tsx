import React from 'react'
import ReactGA from 'react-ga'
import { ApolloProvider } from 'react-apollo-hooks'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import apolloClient from 'services/ApolloClient'
import App from './App'
import 'antd/dist/antd.css'

ReactGA.initialize('UA-31145899-1')

render(
  <ApolloProvider client={apolloClient}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,

  document.getElementById('root'),
)
