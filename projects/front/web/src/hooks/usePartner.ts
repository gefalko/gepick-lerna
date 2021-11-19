import useLocalStorage from 'hooks/useLocalStorage'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import { CreatePartnerMutation, PartnerQuery, PartnerQuery_partner } from '../generatedGraphqlTypes'
import apolloClient from '../services/ApolloClient'

const createParnerMutation = gql`
  mutation CreatePartnerMutation {
    createPartner {
      partnerName
    }
  }
`

const pushPartnerUserMutation = gql`
  mutation PushPartnerUser($args: PushPartnerUserInput!) {
    pushPartnerUser(args: $args)
  }
`

const partnerQuery = gql`
  query PartnerQuery($args: PartnerInput!) {
    partner(args: $args) {
      name
      valuePicksUnlockTill
    }
  }
`

interface IPartner {
  partnerName: string
}

interface IPartnerUser {
  sourcePartnerName: string
}

function usePartner(): {
  partner: PartnerQuery_partner | undefined
  createPartner: () => Promise<void>
  partnerUser: IPartnerUser | undefined
  setPartnerUser: (partnerName: string) => Promise<void>
} {
  const [localStoragePartner, setLocalStoragePartner] = useLocalStorage<IPartner | undefined>(
    'gepick_partner',
    undefined,
  )

  const [localStoragePartnerUser, setLocalSotragePartnerUser] = useLocalStorage<IPartnerUser | undefined>(
    'partnerUser',
    undefined,
  )

  const partnerRes = useQuery<PartnerQuery>(partnerQuery, {
    variables: { args: { partnerName: localStoragePartner?.partnerName } },
    skip: !localStoragePartner,
  })

  const partner = partnerRes.data?.partner

  const createPartner = async () => {
    const { data } = await apolloClient.mutate<CreatePartnerMutation>({
      mutation: createParnerMutation,
    })

    if (data?.createPartner?.partnerName) {
      setLocalStoragePartner({ partnerName: data.createPartner.partnerName })
    }
  }

  const setPartnerUser = async (partnerName: string) => {
    if (!localStoragePartnerUser) {
      const { data } = await apolloClient.mutate({
        variables: {
          args: {
            partnerName,
          },
        },
        mutation: pushPartnerUserMutation,
      })

      if (!data.pushPartnerUser) {
        throw new Error('SetUserFrom error')
      }

      setLocalSotragePartnerUser({
        sourcePartnerName: partnerName,
      })
    }
  }

  return { partner, partnerUser: localStoragePartnerUser, createPartner, setPartnerUser }
}

export default usePartner
