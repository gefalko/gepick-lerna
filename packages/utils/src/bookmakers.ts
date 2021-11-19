const bookmakers = {
  1: '10Bet',
  2: 'Marathonbet',
  3: 'Betfair',
  4: 'Pinnacle',
  5: 'SBO',
  6: 'Bwin',
  7: 'William Hill',
  8: 'Bet365',
  9: 'Dafabet',
  10: 'Ladbrokes',
  11: '1xBet',
  12: 'BetFred',
  13: '188Bet',
  15: 'Interwetten',
  16: 'Unibet',
  17: '5Dimes',
  18: 'Intertops',
  19: 'Bovada',
  20: 'Betcris',
  21: '888Sport',
  22: 'Tipico',
  23: 'Sportingbet',
  24: 'Betway',
  25: 'Expekt',
  26: 'Betsson',
  27: 'NordicBet',
  28: 'ComeOn',
}

export const availableBookmakers = [1, 2, 3, 4]

export function getBookmakerName(bookmakerId: number) {
  return bookmakers[bookmakerId as keyof typeof bookmakers] ?? bookmakerId
}
