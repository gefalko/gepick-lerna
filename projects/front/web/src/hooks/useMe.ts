import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import { MeQuery, MeQuery_me } from 'generatedGraphqlTypes'

export const meQuery = gql`
  query MeQuery {
    me {
      _id
      email
      fullName
      thumbUrl
      patreonData {
        will_pay_amount_cents
      }
    }
  }
`

function useMe(): [MeQuery_me | undefined, boolean] {
  const meResult = useQuery<MeQuery>(meQuery, { fetchPolicy: 'network-only' })

  const me = meResult.data?.me

  return [me, meResult.loading]
}

export default useMe
