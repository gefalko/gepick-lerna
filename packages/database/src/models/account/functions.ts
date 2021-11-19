import { printlog } from '@gepick/utils'
import generateToken from '@gepick/utils/src/generateToken'
import AccountModel, { Account } from '../../models/account/AccountModel'
import { Pick } from '../../models/pick/PickModel'

export async function saveAccount(account: Partial<Account>) {
  try {
    const res = await new AccountModel(account).save()

    return res
  } catch (err) {
    printlog('Failed save account', account)
    throw err
  }
}

export async function pushUserPickByAccountId(accountId: string, pick: Pick) {
  const account = await AccountModel.findOneAndUpdate(
    { _id: accountId },
    {
      $push: { picks: pick },
    },
    {},
  )

  return account
}
interface IAccountProps {
  username: string
}

export async function getSystemAccount() {
  const account = await AccountModel.findOne({ email: 'system@system.system' })

  if (!account) {
    const newAccount = await saveAccount({
      email: 'system@system.system',
    })

    return newAccount
  }

  return account
}

export async function findAccount(props: IAccountProps): Promise<Partial<Account> | undefined> {
  try {
    const dbAccount = await AccountModel.findOne({ username: props.username })

    const result = dbAccount?.toObject()

    return result
  } catch (err) {
    printlog('Failed find account', props)
    throw err
  }
}

export async function findAccountById(accountId: string) {
  const account = await AccountModel.findOne({ _id: accountId })

  return account
}

export async function findAccountByFacebookId(facebookId: string) {
  const account = await AccountModel.findOne({ facebookId })

  return account
}

export async function findAccountByEmail(email: string) {
  const account = await AccountModel.findOne({ email })

  return account
}

export async function askResetPassword(email: string) {
  const token = generateToken(15)
  await AccountModel.updateOne({ email }, { $set: { passwordResetToken: token } })
  const account = findAccountByEmail(email)
  return account
}

export async function findAccountByVerificationToken(verificationToken: string) {
  const account = await AccountModel.findOne({ verificationToken })

  return account
}

interface IResetAccountPasswordArgs {
  token: string
  newPassword: string
}

export async function resetAccountPassword(args: IResetAccountPasswordArgs) {
  const account = await AccountModel.updateOne(
    { passwordResetToken: args.token },
    {
      password: args.newPassword,
      passwordResetToken: undefined,
    },
  )

  return account
}

export async function verifyEmail(email: string) {
  const account = await AccountModel.updateOne(
    { email },
    { $set: { isEmailVerified: true, verificationToken: undefined } },
  )

  return account
}

export async function findAccountByPatreonId(patreonId: string) {
  const account = await AccountModel.findOne({ patreonId })

  return account
}

export async function findAccountPicksByEmail(email: string) {
  const account = await AccountModel.findOne({ email }).populate([{ path: 'picks', populate: { path: 'match' } }])

  return account?.picks ?? []
}

export async function isPatron(userId: string) {
  const user = await findAccountById(userId)

  const userIsPatron = (user?.patreonData?.will_pay_amount_cents ?? 0) > 0

  return userIsPatron
}
