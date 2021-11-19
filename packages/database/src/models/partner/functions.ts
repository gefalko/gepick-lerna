import * as moment from 'moment'
import { uniqueNamesGenerator, animals } from 'unique-names-generator'
import PartnerModel, { PartnerUser } from './PartnerModal'

export async function findPartnerByName(name: string) {
  const partner = await PartnerModel.findOne({ name })

  return partner
}

const [, ...numbers] = Array(100).keys()

const stringNumbersList = numbers.map((n) => n.toString())

function generateShortName() {
  return uniqueNamesGenerator({
    dictionaries: [animals, stringNumbersList],
    length: 2,
  })
}

export async function createPartner() {
  let shortName = generateShortName()
  let count = 0

  while (await findPartnerByName(shortName)) {
    if (count > 10) {
      throw new Error('too many atemts to create partner')
    }
    shortName = generateShortName()
    count++
  }

  const newPartner = await PartnerModel.create({
    name: shortName,
    createdAt: new Date(),
    partnerUsers: [],
  })

  return newPartner
}

export async function updateUnlockedValuePicksDay(partnerName: string) {
  const partner = await findPartnerByName(partnerName)

  if (!partner) {
    throw new Error('Partner not found')
  }

  const getNewUnlockTillDay = () => {
    if (!partner.valuePicksUnlockTillDate || moment().isSameOrAfter(partner.valuePicksUnlockTillDate)) {
      return moment().add(1, 'days').format('YYYY-MM-DD')
    }

    return moment(partner.valuePicksUnlockTillDate).add(1, 'days').format('YYYY-MM-DD')
  }

  const updatedPartner = await PartnerModel.updateOne(
    {
      name: partnerName,
    },
    { $set: { valuePicksUnlockTillDate: getNewUnlockTillDay() } },
  )

  return updatedPartner
}

interface IPushPartnerUserArgs {
  partnerName: string
  newPartnerUser: PartnerUser
}

export async function pushPartnerUser(args: IPushPartnerUserArgs) {
  const updatedPartner = await PartnerModel.updateOne(
    { name: args.partnerName },
    {
      $push: {
        partnerUsers: args.newPartnerUser,
      },
    },
  )

  return updatedPartner
}
