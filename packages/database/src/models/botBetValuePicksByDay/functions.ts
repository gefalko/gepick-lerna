import BotBetValuePicksByDayModel, { BotBetValuePicksByDay } from './BotBetValuePicksByDayModel'
import { removePicks } from '../pick/functions'

export async function saveBotBetValuePicksByDay(botBetValuePicksByDay: BotBetValuePicksByDay) {
  const savedBotBetValuePicksByDay = await new BotBetValuePicksByDayModel(botBetValuePicksByDay).save()

  return savedBotBetValuePicksByDay
}

interface IFindBotBetValuePicksByDayProps {
  day: Date
  botDbId: string
  bet: string
}

export async function findBotBetValuePicksByDay(
  props: IFindBotBetValuePicksByDayProps,
  populatePicks?: boolean,
  populatePickMatch?: boolean,
) {
  const dbBotBetValuePicksByDay = await BotBetValuePicksByDayModel.findOne({
    day: props.day,
    botDbId: props.botDbId,
    bet: props.bet,
  }).populate(
    populatePicks ? [{ path: 'picks', populate: populatePickMatch ? { path: 'match' } : undefined }] : undefined,
  )

  return dbBotBetValuePicksByDay
}

interface IFindAllBotBetValuePicksByDayProps {
  day: Date
}

export async function findAllBotBetValuePicksByDay(
  props: IFindAllBotBetValuePicksByDayProps,
  populatePicks?: boolean,
  populatePickMatch?: boolean,
) {
  const dbAllBotBetValuePicksByDay = await BotBetValuePicksByDayModel.find({
    day: props.day,
  }).populate(
    populatePicks ? [{ path: 'picks', populate: populatePickMatch ? { path: 'match' } : undefined }] : undefined,
  )

  return dbAllBotBetValuePicksByDay
}

interface IFindBotBetValuePicksByDaysProps {
  dateFrom: Date
  dateTo: Date
  botDbId: string
  bet: string
}

export async function findBotBetValuePicksByDays(
  props: IFindBotBetValuePicksByDaysProps,
  populatePicks?: boolean,
  populatePickMatch?: boolean,
) {
  const dbBotBetValuePicksByDays = await BotBetValuePicksByDayModel.find({
    day: {
      $gte: props.dateFrom,
      $lte: props.dateTo,
    },
    botDbId: props.botDbId,
    bet: props.bet,
  }).populate(
    populatePicks ? [{ path: 'picks', populate: populatePickMatch ? { path: 'match' } : undefined }] : undefined,
  )

  return dbBotBetValuePicksByDays ?? []
}

interface IRemoveBotBetValuePicksByDayProps {
  day: Date
  botDbId: string
  bet: string
}

export async function removeBotBetValuePicksByDay(props: IRemoveBotBetValuePicksByDayProps) {
  const oldPicks = await findBotBetValuePicksByDay(props)
  const ids = oldPicks?.picks.map((pick) => pick._id)

  if (ids) {
    const filteredIds = ids.filter((id) => id != null) as string[]
    await removePicks(filteredIds)
  }

  const res = await BotBetValuePicksByDayModel.remove({
    day: props.day,
    botDbId: props.botDbId,
    bet: props.bet,
  })

  return res
}
