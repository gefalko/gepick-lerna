import { findNotFinishedMatches } from '@gepick/database'
import { getMatchByFixtureId } from '@gepick/api-football'
import { formatMatchStatus } from '@gepick/data-collector'

export async function updateMatchesResults() {
  const notStartedMatches = await findNotFinishedMatches()

  for (const match of notStartedMatches) {
    const apiMatch = await getMatchByFixtureId(match.apiFootballFixtureId)
    try {
      if (apiMatch) {
        const formatedStatus = formatMatchStatus(apiMatch.statusShort)

        const formatedScore = apiMatch.score
          ? {
              halftime: apiMatch.score.halftime,
              fulltime: apiMatch.score.fulltime,
              extratime: apiMatch.score.extratime,
              penalty: apiMatch.score.penalty,
            }
          : undefined

        match.status = formatedStatus.status
        match.niceStatus = formatedStatus.niceStatus
        match.goalsHomeTeam = apiMatch.goalsHomeTeam ?? undefined
        match.goalsAwayTeam = apiMatch.goalsAwayTeam ?? undefined
        match.score = formatedScore

        await match.save()
      } else {
        throw new Error('Match not exist on api!.')
      }
    } catch (err) {
      const formatedStatus = formatMatchStatus('BROKEN')
      match.status = formatedStatus.status
      match.niceStatus = formatedStatus.niceStatus

      await match.save()
    }
  }
}
