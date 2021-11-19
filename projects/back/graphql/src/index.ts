import * as express from 'express'
import * as bodyParser from 'body-parser'
import 'reflect-metadata'
import { printlog, variables } from '@gepick/utils'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { connectToDb } from '@gepick/database'
import { parseJWTToken } from './context'
import BotResolver from './resolvers/BotResolver'
import PickResolver from './resolvers/PickResolver'
import BotPicksResolver from './resolvers/BotPicksResolver'
import MatchResolver from './resolvers/MatchResolver'
import PredictionsPageResolver from './resolvers/PredictionsPageResolver'
import BookmakerExplorerPageResolver from './resolvers/BookmakerExplorerPageResolver'
import BotExplorerPageResolver from './resolvers/botExplorerPageResolver/BotExplorerPageResolver'
import ValuePicksPageResolver from './resolvers/ValuePicksPageResolver'
import PartnerResolver from './resolvers/PartnerResolver'
import SureBetsPageResolver from './resolvers/SureBetsPageResolver'
import PicksExplorerPageResolver from './resolvers/PicksExplorerPageResolver'
import ProfitablePickPageResolver from './resolvers/ProfitablePicksPageResolver'
import AccountResolver from './resolvers/AccountResolver'
import LeagueResolver from './resolvers/LeagueResolver'
import { patreonWebhook } from './httpEndpoints/patreon'
import { coinbaseWebhook } from './httpEndpoints/coinbase'

const port = variables.GRAPHQL_PORT

export class ResolverError extends Error {
  code: string
  constructor(message: string, code: string) {
    super(message)
    this.code = code
  }
}

export async function contextApollo(props: any) {
  const { authorization } = props.req.headers

  if (authorization) {
    const user = await parseJWTToken(authorization)

    return {
      user,
    }
  }

  return {}
}

const main = async () => {
  await connectToDb()

  const schema = await buildSchema({
    resolvers: [
      BotPicksResolver,
      LeagueResolver,
      MatchResolver,
      AccountResolver,
      PickResolver,
      BotResolver,
      PredictionsPageResolver,
      BookmakerExplorerPageResolver,
      BotExplorerPageResolver,
      ValuePicksPageResolver,
      PartnerResolver,
      SureBetsPageResolver,
      PicksExplorerPageResolver,
      ProfitablePickPageResolver,
    ],
  })

  const apolloServer = new ApolloServer({
    context: contextApollo,
    schema,
  })

  const app = express()

  apolloServer.applyMiddleware({ app })

  app.use(bodyParser.json())

  app.post('/hooks/coinbase', coinbaseWebhook)
  app.post('/hooks/patreon', patreonWebhook)

  app.listen(port, () => {
    printlog(`App runing http://localhost:${port}`)
  })
}

main()
