import BotPicksModel, { BotPicks } from './BotPicksModel'
import { removePicks } from '../pick/functions'

export async function saveBotPicks(botPicks: BotPicks) {
  const dbBotPicks = await new BotPicksModel(botPicks).save()

  return dbBotPicks
}
interface IFindBotPicksProps {
  day: Date
  botDbId: string
  botTag: string
  bet: string
}

export async function findBotPicks(props: IFindBotPicksProps, populatePicks?: boolean, populatePickMatch?: boolean) {
  const botPicks = await BotPicksModel.findOne({
    day: props.day,
    botTag: props.botTag,
    botDbId: props.botDbId,
    bet: props.bet,
  }).populate(
    populatePicks ? [{ path: 'picks', populate: populatePickMatch ? { path: 'match' } : undefined }] : undefined,
  )

  return botPicks
}

interface IRemoveBotPicksProps {
  day: Date
  botDbId: string
  botTag: string
  bet: string
}

export async function removeBotPicks(props: IRemoveBotPicksProps) {
  const oldBotPicks = await findBotPicks(props)
  const ids = oldBotPicks?.picks.map((pick) => pick._id)

  if (ids) {
    const filteredIds = ids.filter((id) => id != null) as string[]
    await removePicks(filteredIds)
  }

  const res = await BotPicksModel.remove({
    day: props.day,
    botTag: props.botTag,
    botDbId: props.botDbId,
    bet: props.bet,
  })

  return res
}
