import { Request, Response } from 'express'
import { printlog } from '@gepick/utils'

export function coinbaseWebhook(req: Request, res: Response) {
  printlog('***************************************************************************************')
  printlog(JSON.stringify(req.body, null, 2))
  res.send('ok')
}
