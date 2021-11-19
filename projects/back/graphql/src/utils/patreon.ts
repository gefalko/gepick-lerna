const { default: axios } = require('axios')

export interface IPatreonResponseDataMember {
  id: string
  attributes: {
    patron_status: string
    currently_entitled_amount_cents: number
    will_pay_amount_cents: number
  }
  relationships?: {
    campaign: {
      data: {
        id: string
        type: string
      }
    }
  }
  type: string
}

export interface IPatreonResponseData {
  data: {
    attributes: {
      full_name: string
      thumb_url: string
      email?: string
    }
    id: string
    relationships: {
      memberships: {
        data: { id: string; type: string }[]
      }
    }
    type: string
  }

  included: IPatreonResponseDataMember[]
}

export const patreonClientId = 'zI9FL12D1bIgrq3f7iZUWGj3SGBe507OWjikW8Ssxhq0kdaCp3FbD2ccdyiTb8GG'
export const patreonClientSecret = 'wB8JDCICUyESgORLJJSjXr7NriVlp1pZ0E4KCBdzy7j6d24nXH6BaSjdIP5NgNLx'
export const gepickCampaignId = '2619575'

export const fetchPatronData = async (token: string): Promise<IPatreonResponseData> => {
  const patronRes = await axios.get(
    'https://www.patreon.com/api/oauth2/v2/identity?include=memberships,memberships.campaign&fields%5Buser%5D=email,full_name,thumb_url&fields%5Bmember%5D=patron_status,currently_entitled_amount_cents,will_pay_amount_cents', // eslint-disable-line
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return patronRes.data
}
