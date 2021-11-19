import { MatchStatusEnum } from '@gepick/database/src/types'

export function isMatchPending(matchStatus: MatchStatusEnum) {
  if (
    [
      MatchStatusEnum.HALFTIME,
      MatchStatusEnum.FIRST_HALF,
      MatchStatusEnum.SECOND_HALF,
      MatchStatusEnum.NOT_STARTED,
      MatchStatusEnum.TIME_TO_BE_DEFINED,
    ].includes(matchStatus)
  ) {
    return true
  }

  return false
}

export function isMatchCanceled(matchStatus: MatchStatusEnum) {
  if ([MatchStatusEnum.BROKEN, MatchStatusEnum.CANCELED, MatchStatusEnum.POSTPONED].includes(matchStatus)) {
    return true
  }

  return false
}

export function isMatchFinished(matchStatus: MatchStatusEnum) {
  if (
    [MatchStatusEnum.FINISHED, MatchStatusEnum.FINISHED_PENELTIES, MatchStatusEnum.FINISHED_EXTRA_TIME].includes(
      matchStatus,
    )
  ) {
    return true
  }

  return false
}
