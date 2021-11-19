import { printlog } from '@gepick/utils'
import CountryModel from './CountryModel'

export async function findCountryByName(countryName: string) {
  try {
    const dbCountry = await CountryModel.findOne({ name: countryName })

    return dbCountry
  } catch (err) {
    printlog('Failed find country', countryName)
    throw err
  }
}

export async function findAllCountries() {
  const dbCountryList = await CountryModel.find()

  return dbCountryList
}
