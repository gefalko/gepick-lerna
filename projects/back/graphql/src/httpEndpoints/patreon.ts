import * as qs from 'querystring'
import { Request, Response } from 'express'
import { findAccountByPatreonId } from '@gepick/database'
import {
  patreonClientId,
  patreonClientSecret,
  fetchPatronData,
  IPatreonResponseDataMember,
  gepickCampaignId,
} from '../utils/patreon'

const { default: axios } = require('axios')

interface IPatreonHookResponse {
  data: {
    relationships: {
      user: {
        data: {
          id: string
        }
      }
    }
  }
}

export async function patreonWebhook(req: Request, res: Response) {
  const response: IPatreonHookResponse = req.body

  let account = await findAccountByPatreonId(response.data.relationships.user.data.id)

  if (account) {
    const query = qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: account.patreonData?.refreshAccessToken,
      client_id: patreonClientId,
      client_secret: patreonClientSecret,
    })

    const tokenRes = await axios.post('https://www.patreon.com/api/oauth2/token', query, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    const patreonData = await fetchPatronData(tokenRes.data.access_token)

    const gepickMemberData = patreonData.included.find((item: IPatreonResponseDataMember) => {
      return item.relationships?.campaign.data.id === gepickCampaignId
    })

    const dbPatreonData = {
      accessToken: tokenRes.data.access_token,
      refreshAccessToken: tokenRes.data.refresh_token,
      patron_status: gepickMemberData?.attributes.patron_status,
      currently_entitled_amount_cents: gepickMemberData?.attributes.currently_entitled_amount_cents,
      will_pay_amount_cents: gepickMemberData?.attributes.will_pay_amount_cents,
    }

    account.patreonData = dbPatreonData

    await account.save()
  }

  res.send('ok')
}
