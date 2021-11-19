import { ApolloError } from 'apollo-boost'
import { GraphQLError } from 'graphql'

function getGraphQLErrorCodes(errors: readonly GraphQLError[]) {
  const errorCodes = errors.map((error) => {
    if (!error?.extensions) {
      return undefined
    }

    const { code } = error.extensions.exception
    return code
  })

  return errorCodes
}

function getApolloErrorCode<T>(err: ApolloError): undefined | T {
  const [error] = err.graphQLErrors

  if (!error?.extensions) {
    return undefined
  }

  const { code } = error.extensions.exception

  return code
}

function isApolloError(err: ApolloError | readonly GraphQLError[]): err is ApolloError {
  return (err as ApolloError).graphQLErrors !== undefined
}

function getErrorCodes(err: ApolloError | readonly GraphQLError[]) {
  if (isApolloError(err)) {
    return [getApolloErrorCode(err as ApolloError)]
  }

  return getGraphQLErrorCodes(err as readonly GraphQLError[])
}

export default getErrorCodes
