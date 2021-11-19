import { ApolloClient, ApolloLink, HttpLink, DefaultOptions, InMemoryCache } from 'apollo-boost'
import config from '../config'

const cache = new InMemoryCache()

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'none',
  },
  query: {
    errorPolicy: 'none',
  },
  mutate: {
    errorPolicy: 'none',
  },
}

const httpLink = new HttpLink({
  uri: '/graphql',
})

const authLink = new ApolloLink((operation, forward) => {
  const authorization = localStorage.getItem(config.JWT_LOCAL_STORAGE_PATH)
  if (authorization) {
    operation.setContext({ headers: { authorization } })
  }

  if (forward) {
    return forward(operation)
  }

  return null
})

const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink.concat(httpLink)]),
  cache,
  defaultOptions,
})

export default apolloClient
