import CountryModel, { Country } from '../../models/country/CountryModel'

export async function saveCountry(country: Partial<Country>) {
  try {
    const res = await new CountryModel(country).save()

    return res
  } catch (err) {
    console.log('Failed save country', country)
    throw err
  }
}
