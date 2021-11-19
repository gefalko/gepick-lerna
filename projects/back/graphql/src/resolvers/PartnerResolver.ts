import { ObjectType, InputType, Arg, Field, Mutation, Resolver, Query } from 'type-graphql'
import {
  createPartner,
  pushPartnerUser,
  findPartnerByName,
  updateUnlockedValuePicksDay,
} from '@gepick/database/src/models/partner/functions'

@ObjectType()
class CreatePartnerResponse {
  @Field(() => String)
  public partnerName!: string
}

@InputType()
class PushPartnerUserInput {
  @Field(() => String)
  public partnerName!: string
}

@InputType()
class PartnerInput {
  @Field(() => String)
  public partnerName!: string
}

@ObjectType()
class PartnerResponse {
  @Field(() => String)
  public name!: string

  @Field(() => String, { nullable: true })
  public valuePicksUnlockTill?: string
}

@Resolver()
class PartnerResolver {
  @Query(() => PartnerResponse)
  async partner(@Arg('args') args: PartnerInput) {
    const partner = await findPartnerByName(args.partnerName)

    return {
      name: partner?.name,
      valuePicksUnlockTill: partner?.valuePicksUnlockTillDate,
    }
  }

  @Mutation(() => CreatePartnerResponse)
  async createPartner() {
    const partner = await createPartner()

    return {
      partnerName: partner.name,
    }
  }

  @Mutation(() => Boolean)
  async pushPartnerUser(@Arg('args') args: PushPartnerUserInput) {
    await pushPartnerUser({
      partnerName: args.partnerName,
      newPartnerUser: {
        createdAt: new Date(),
      },
    })

    await updateUnlockedValuePicksDay(args.partnerName)

    return true
  }
}

export default PartnerResolver
