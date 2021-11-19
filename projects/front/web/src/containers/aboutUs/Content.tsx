import React from 'react'
import Link from '@gepick/components/link/Link'
import routes from 'routes/routes'

export const topContent = (
  <ul>
    <li>Gepick is an ecosystem for connect footbal prediction bot developers and predictions users.</li>
    <li>
      We propose automatized sports <Link href={routes.predictions}>predictions</Link> for help you make a correct
      betting decision;
    </li>
    <li>
      We think the secret is sports data and accurate software-based{' '}
      <Link href={routes.botExplorer}>prediction bots</Link>;
    </li>
  </ul>
)

export const footballPredictionsSectionContent = (
  <ul>
    <li>
      <Link href={routes.predictions}>Predictions</Link> are calculated daily by a list of different{' '}
      <Link href={routes.botExplorer}>prediction bots;</Link>
    </li>
    <li>We have data by almost all football leagues;</li>
    <li>Probabilities are compared with bookmaker&apos;s odds. It allows bet for value picks.</li>
  </ul>
)

export const valuePicksSectionContent = (
  <ul>
    <li>
      Daily filtered <Link href={routes.valuePicks}>value picks</Link> for premium users;
    </li>
    <li>
      <Link href={routes.patreon} targetBlank>
        Become a patron now
      </Link>
      . and get acecces to all <Link href={routes.valuePicks}>value picks</Link>;
    </li>
  </ul>
)

export const predictionBotsSectionContent = (
  <ul>
    <li>
      List of AI, mathematical or statistical based football <Link href={routes.botExplorer}>prediction bots</Link>;
    </li>
    <li>
      <Link href={routes.botExplorer}>Tools</Link> for compare bots performance.
    </li>
    <li>
      The bot{' '}
      <Link href={routes.studio} targetBlank>
        developer studio
      </Link>{' '}
      allows you to create and push your bot to gepick ecosystem.
    </li>
  </ul>
)

export const developerStudioSectionContent = (
  <ul>
    <li>
      Open source <Link href={routes.studio}>tool</Link> for model performance reporting.
    </li>
    <li>Graphql based sport data api.</li>
    <li>Developer is free to use any programing language. Gepick models works under docker throw http.</li>
    <li>Available test and push your prediction bot to gepick.com ecosystem and share it with our users.</li>
  </ul>
)

export const patreonSectionContent = (
  <ul>
    <li>
      If you like the idea about gepick, please support us and{' '}
      <Link targetBlank href={routes.patreon}>
        become a patron
      </Link>
      ;
    </li>
    <li>
      All our patrons gets a premium plan for <Link href={routes.vipPicks}>VIP picks;</Link>
    </li>
    <li> With our patrons we share dagon based expermentinal betting strategy and more.</li>
  </ul>
)
