import * as memoizee from 'memoizee'
import * as jsonwebtoken from 'jsonwebtoken'
import config from './config'

export const parseJWTToken = memoizee(
  async (content: string) => {
    const decoded = await new Promise<{ id: string }>((res, rej) => {
      jsonwebtoken.verify(content, config.JWT_SECRET, (err: any, val: any) => (!err ? res(val) : rej(err)))
    })

    return {
      id: decoded?.id,
    }
  },
  {
    maxAge: 5_000,
    max: 10_000,
    promise: true,
  },
)
