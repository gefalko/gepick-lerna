import { isMatchPending, isMatchCanceled } from '@gepick/utils'
import { PickStatusEnum } from '@gepick/utils/src/PickStatusEnum'
import { MatchStatusEnum } from '../../../types'

interface IArgs {
  matchStatus: MatchStatusEnum
  isPickCorrect?: boolean
}

function getPickStatus(args: IArgs) {
  const isCanceled = isMatchCanceled(args.matchStatus)
  const isPending = isMatchPending(args.matchStatus)

  if (isPending) {
    return PickStatusEnum.PENDING
  }

  if (isCanceled) {
    return PickStatusEnum.CANCELED
  }

  if (args.isPickCorrect === true) {
    return PickStatusEnum.CORRECT
  }

  if (args.isPickCorrect === false) {
    return PickStatusEnum.NOT_CORRECT
  }

  throw new Error('Bad pick status')
}

export default getPickStatus
