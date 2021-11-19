import PredictionBotModel, { PredictionBot } from './PredictionBotModel'

export interface IPredictionBotTag {
  tag: string
  portNumber: number
  active: boolean
}

export interface IPredictionBot {
  _id: string
  predictionBotId: string
  niceName: string
  description: string
  creator: string
  tags: IPredictionBotTag[]
}

export async function findAllPredictionBots() {
  const bots = await PredictionBotModel.find()

  return bots
}

export async function findAllPredictionBotById(predictionBotId: string) {
  const predictionBot = await PredictionBotModel.findOne({
    _id: predictionBotId,
  })

  return predictionBot
}

export async function findPredictionBotByDockerImage(dockerImage: string) {
  const predictionBot = await PredictionBotModel.findOne({
    dockerImage,
  })

  return predictionBot
}

export async function createPredictionBot(bot: PredictionBot) {
  const dbBot = await new PredictionBotModel(bot).save()

  return dbBot
}

/*
export async function findPredictionBotTag(repository: string, tag: string) {
  const dbBot = await findPredictionBotByRepository(repository)

  if (!dbBot) {
    return null
  }

  const dbTag = dbBot.tags.find((botTag) => botTag.tag === tag)

  if (!dbTag) {
    return null
  }

  return { bot: dbBot, tag: dbTag }
}

export async function savePredictionBot(predictionBotData: PredictionBot) {
  try {
    const dbPredictionBot = await new PredictionBotModel(predictionBotData).save()

    return dbPredictionBot
  } catch (err) {
    printlog('Failed save dbPredictor', predictionBotData)
    throw err
  }
}

interface ITagData {
  active: boolean
  tag: string
  port: number
}

export async function savePredictionBotTag(repository: string, tagData: ITagData) {
  try {
    const predictionBot = await findPredictionBotByRepository(repository)

    if (!predictionBot) {
      return null
    }

    if (!predictionBot.tags?.length) {
      predictionBot.tags = []
    }

    const newTag = {
      tag: tagData.tag,
      portNumber: tagData.port,
      active: tagData.active,
    }

    await PredictionBotModel.findOneAndUpdate({ repository }, { $push: { tags: newTag } })

    return newTag
  } catch (err) {
    printlog('savePredictionBotTag', err)
    throw err
  }
}

interface IFindOrSavePredictionBotTagProps {
  repository: string
  tagActive: boolean
  tag: string
  creatorId: string
  port: number
  gitRepository?: string
  description?: string
}

export async function savePredictionBotAndTag(props: IFindOrSavePredictionBotTagProps) {
  const dbBot = await findPredictionBotByRepository(props.repository)

  if (!dbBot) {
    const creator = await findAccountById(props.creatorId)

    if (!creator) {
      throw new Error('Account not found')
    }

    const newBot = await savePredictionBot({
      repository: props.repository,
      gitRepository: props.gitRepository,
      description: props.description,
      tags: [],
      creator,
    })

    const newTag = await savePredictionBotTag(props.repository, {
      tag: props.tag,
      active: props.tagActive,
      port: props.port,
    })

    return { bot: newBot, tag: newTag }
  }

  // @ts-ignore
  if (dbBot.creator !== props.creatorId) {
    throw new Error('Creators ids not equals.')
  }

  const dbTag = dbBot.tags.find((tag) => tag.tag === props.tag)

  if (dbTag) {
    throw new Error('Bot tag exist')
  }

  const newTag = await savePredictionBotTag(props.repository, {
    tag: props.tag,
    active: props.tagActive,
    port: props.port,
  })

  return { bot: dbBot, tag: newTag }
}
*/
