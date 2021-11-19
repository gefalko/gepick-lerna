import * as moment from 'moment'
import { sumBy, round } from 'lodash'
import { bookmakerExplorerLabels } from '@gepick/config/src/bookmakerExplorerConfig'
import { availableIntervals } from '@gepick/utils/src/BookmakerExplorerInterval'
import { findBookmakerExplorer_intervalReports } from '@gepick/database/src/models/bookmakerExplorer_intervalReport/functions'
import { ReportPeriodEnum } from '@gepick/utils/src/enums'
import { updateBookmakerExplorerReportStatistic } from '@gepick/database/src/models/bookmakerExplorer_itervalReportStatistic/functions'

async function updateReportStatistic() {
  const today = moment().format('YYYY-MM-DD')

  for (let betLabel of Object.values(bookmakerExplorerLabels)) {
    for (let bet of Object.values(betLabel.values)) {
      for (let interval of availableIntervals) {
        const dbReportList = await findBookmakerExplorer_intervalReports({
          betLabelId: betLabel.apiFootballLabelId,
          intervalKey: interval.key,
          periodType: ReportPeriodEnum.DAY,
          bet,
        })

        const countAllTimeRoi = () => {
          const totalProfit = sumBy(dbReportList, 'profit')
          const totalWithResult = sumBy(dbReportList, 'totalWithResults')

          if (totalWithResult === 0) {
            return 0
          }

          return round((totalProfit / totalWithResult) * 100, 2)
        }

        await updateBookmakerExplorerReportStatistic({
          bookmakerId: 1,
          betLabelId: betLabel.apiFootballLabelId,
          bet,
          intervalKey: interval.key,
          todayStatistic: {
            day: today,
            allTimeRoi: countAllTimeRoi(),
          },
        })
      }
    }
  }
}

export default updateReportStatistic
