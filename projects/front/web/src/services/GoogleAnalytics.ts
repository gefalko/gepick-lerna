import ReactGA from 'react-ga'

export enum Category {
  valuePicksPage = 'value-picks-page',
  sureBetsPicksPage = 'sure-bets-page',
}

enum Action {
  view = 'view',
  click = 'click',
  submit = 'submit',
}

interface ISendEventOptions {
  name: string
  category?: Category
  action: Action
  label?: string
}

function sendEvent(options: ISendEventOptions) {
  ReactGA.ga('send', 'event', options.category, options.action, options.label)
}

export const TrackEvents = {
  valuePicksPage: {
    dayChange: (day: string) => {
      sendEvent({
        name: 'changeDay',
        category: Category.valuePicksPage,
        action: Action.click,
        label: day,
      })
    },
    howItWorksLinkClick: () => {
      sendEvent({
        name: 'name-howItWorksLinkClick',
        category: Category.valuePicksPage,
        action: Action.click,
        label: 'label-howItWorksLinkClick',
      })
    },
    becomePatronButtonClick: () => {
      sendEvent({
        name: 'name-becomePatronButtonClick',
        category: Category.valuePicksPage,
        action: Action.click,
        label: 'label-becomePatronButtonClick',
      })
    },
    shareModalOpen: () => {
      sendEvent({
        name: 'name-shareModalOpen',
        category: Category.valuePicksPage,
        action: Action.click,
        label: 'label-hareModalOpen',
      })
    },
    newPartnerCreated: () => {
      sendEvent({
        name: 'name-newPartnerCreated',
        category: Category.valuePicksPage,
        action: Action.click,
        label: 'label-newPartnerCreated',
      })
    },
    newUserFromPartner: () => {
      sendEvent({
        name: 'name-user-from-partner',
        category: Category.valuePicksPage,
        action: Action.click,
        label: 'label-user-from-partner',
      })
    },
  },
  sureBetsPage: {
    dayChange: (day: string) => {
      sendEvent({
        name: 'sureBets-changeDay',
        category: Category.sureBetsPicksPage,
        action: Action.click,
        label: day,
      })
    },
    whatSureBetsIsClick: () => {
      sendEvent({
        name: 'whatSureBetsIsClickName',
        category: Category.sureBetsPicksPage,
        action: Action.click,
        label: 'whatSureBetsIsClickLabel',
      })
    },
    becomePatronButtonClick: (profit: number) => {
      sendEvent({
        name: 'name-becomePatronButtonClick',
        category: Category.sureBetsPicksPage,
        action: Action.click,
        label: `profit: ${profit}`,
      })
    },
  },
}
