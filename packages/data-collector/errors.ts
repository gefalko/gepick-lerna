export class TeamCountryIsBannedError extends Error {
  constructor(countryName: string) {
    const fullMsg = `Team country (${countryName}) is banned.`
    super(fullMsg)
    this.message = fullMsg
  }

  toString() {
    return this.message
  }
}
