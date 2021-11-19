import * as qs from 'querystring'
import * as bcrypt from 'bcryptjs'
import * as jsonwebtoken from 'jsonwebtoken'
import { printlog } from '@gepick/utils'
import generateToken from '@gepick/utils/src/generateToken'
import { Field, Resolver, Query, Arg, InputType, Mutation, Ctx, ObjectType } from 'type-graphql'
import {
  Account,
  findAccountById,
  findAccountByEmail,
  findAccountByPatreonId,
  saveAccount,
  findAccountByVerificationToken,
  verifyEmail,
  askResetPassword as askResetPasswordDB,
  resetAccountPassword,
  findAccountByFacebookId,
} from '@gepick/database'
import config from '../config'
import {
  fetchPatronData,
  patreonClientId,
  gepickCampaignId,
  patreonClientSecret,
  IPatreonResponseDataMember,
} from '../utils/patreon'
import { IContext, ResolverError } from '../utils/utils'
import { sendEmailVerificationEmail, sendResetPasswordEmail } from '../services/email/email'

const { default: axios } = require('axios')

export enum RegistrationErrorEnum {
  EMAIL_EXIST = 'EMAIL_EXIST',
  USER_EXIST = 'USER_EXIST',
}

export enum LoginErrorEnum {
  EMAIL_NOT_EXIST = 'EMAIL_NOT_EXIST',
  PASSWORD_NOT_CORRECT = 'PASSWORD_NOT_CORRECT',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
}

enum EmailVerificationErrorEnum {
  ACCOUNT_NOT_EXIST = 'ACCOUNT_NOT_EXIST',
  EMAIL_NOT_EXIST = 'EMAIL_NOT_EXIST',
  ALREADY_VERIFIED = 'ALREADY_VERIFIED',
}

@InputType()
class RegistrationInput {
  @Field()
  public email!: string

  @Field()
  public username!: string

  @Field()
  public password!: string

  @Field(() => Boolean)
  public newsletter!: boolean
}

@InputType()
class LoginInput {
  @Field()
  public email!: string

  @Field()
  public password!: string
}

@InputType()
class LoginWithFacebookInput {
  @Field()
  facebookId: string

  @Field()
  name: string
}

@ObjectType()
export class Token {
  @Field()
  public token!: string
}

@Resolver()
class AccountResolver {
  @Query(() => Account)
  me(@Ctx() ctx: IContext) {
    if (!ctx.user) {
      throw new Error('You are not authenticated!')
    }

    return findAccountById(ctx.user.id)
  }

  @Mutation(() => Token)
  async loginWithFacebook(@Arg('args') args: LoginWithFacebookInput) {
    const getAccount = async () => {
      const existAccount = await findAccountByFacebookId(args.facebookId)

      if (existAccount) {
        return existAccount
      }

      const newAccount = await saveAccount({
        email: 'email',
      })

      return newAccount
    }

    const account = await getAccount()

    return {
      token: jsonwebtoken.sign({ id: account._id }, config.JWT_SECRET, { expiresIn: '1y' }),
    }
  }

  @Mutation(() => Token)
  async loginWithPatreon(@Arg('code') code: string, @Arg('redirectUrl') redirectUrl: string) {
    try {
      const tokenRes = await axios.post(
        'https://www.patreon.com/api/oauth2/token',
        qs.stringify({
          code,
          grant_type: 'authorization_code',
          client_id: patreonClientId,
          client_secret: patreonClientSecret,
          redirect_uri: redirectUrl,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )

      const patreonData = await fetchPatronData(tokenRes.data.access_token)
      let account = await findAccountByPatreonId(patreonData.data.id)

      const gepickMemberData = patreonData.included.find((item: IPatreonResponseDataMember) => {
        return item.relationships?.campaign.data.id === gepickCampaignId
      })

      const dbPatreonData = {
        code,
        accessToken: tokenRes.data.access_token,
        refreshAccessToken: tokenRes.data.refresh_token,
        patron_status: gepickMemberData?.attributes.patron_status,
        currently_entitled_amount_cents: gepickMemberData?.attributes.currently_entitled_amount_cents,
        will_pay_amount_cents: gepickMemberData?.attributes.will_pay_amount_cents,
      }

      if (account) {
        account.patreonData = dbPatreonData
        await account.save()
      } else {
        const accountData = {
          email: patreonData.data.attributes.email,
          fullName: patreonData.data.attributes.full_name,
          thumbUrl: patreonData.data.attributes.thumb_url,
          patreonId: patreonData.data.id,
          patreonData: dbPatreonData,
          picks: [],
        }

        account = await saveAccount(accountData)
      }

      if (account) {
        return {
          token: jsonwebtoken.sign({ id: account._id }, config.JWT_SECRET, { expiresIn: '1y' }),
        }
      }
    } catch (err) {
      printlog(err)
    }

    return {
      token: null,
    }
  }

  @Mutation(() => String)
  async registrationWithEmail(@Arg('data') data: RegistrationInput) {
    if (await findAccountByEmail(data.email)) {
      throw new ResolverError('Registration failed!', RegistrationErrorEnum.EMAIL_EXIST)
    }

    const token = generateToken(10)

    await saveAccount({
      email: data.email,
      verificationToken: token,
      password: await bcrypt.hash(data.password, 10),
    })

    sendEmailVerificationEmail({ to: data.email, token })

    return 'true'
  }

  @Mutation(() => Boolean)
  async askResetPassword(@Arg('email') email: string) {
    if (!(await findAccountByEmail(email))) {
      return true
    }

    const account = await askResetPasswordDB(email)

    if (account && account.email && account.passwordResetToken) {
      sendResetPasswordEmail({ email: account.email, token: account.passwordResetToken })
    }
    return true
  }

  @Mutation(() => Boolean)
  async resetPassword(@Arg('token') token: string, @Arg('newPassword') newPassword: string) {
    const account = await resetAccountPassword({
      token,
      newPassword: await bcrypt.hash(newPassword, 10),
    })

    return account != null
  }

  @Mutation(() => Boolean)
  async verifyEmail(@Arg('token') token: string) {
    const account = await findAccountByVerificationToken(token)

    if (account == null) {
      throw new ResolverError('Email verification failed!', EmailVerificationErrorEnum.ACCOUNT_NOT_EXIST)
    }

    if (!account.email) {
      throw new ResolverError('Email verification failed!', EmailVerificationErrorEnum.EMAIL_NOT_EXIST)
    }

    if (account.isEmailVerified) {
      throw new ResolverError('Email verification failed!', EmailVerificationErrorEnum.ALREADY_VERIFIED)
    }

    await verifyEmail(account.email)

    return true
  }

  @Mutation(() => String)
  async loginWithEmail(@Arg('data') data: LoginInput) {
    const account = await findAccountByEmail(data.email)

    if (!account || !account.password) {
      throw new ResolverError('Login failed!', LoginErrorEnum.EMAIL_NOT_EXIST)
    }

    if (!account.isEmailVerified) {
      throw new ResolverError('Login failed!', LoginErrorEnum.EMAIL_NOT_VERIFIED)
    }

    const valid = await bcrypt.compare(data.password, account.password)

    if (!valid) {
      throw new ResolverError('Login failed!', LoginErrorEnum.PASSWORD_NOT_CORRECT)
    }

    return jsonwebtoken.sign({ id: account._id, email: account.email }, config.JWT_SECRET, { expiresIn: '1y' })
  }
}

export default AccountResolver
