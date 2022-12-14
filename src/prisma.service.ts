import {
  INestApplication,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { Cake, PrismaClient, User } from '@prisma/client';
import { CreateUserDto } from './dto/bot/createUser.dto';
import { PatchUserDto } from './dto/bot/patchUser.dto';
import { SendCakeDto } from './dto/bot/SendCake.dto';
import { UpdateCakeDto } from './dto/bot/updateCake.dto';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async findUserByIdx(idx: number) {
    try {
      return await this.user.findUniqueOrThrow({
        where: {
          idx,
        },
        include: {
          Cake: true,
        },
      });
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('Internal Server error')
    }
  }

  async findUserByDiscordUUID(uuid: string) {
    try {
      return await this.user.findUniqueOrThrow({
        where: {
          discordUUID: uuid,
        },
        include: {
          Cake: true,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async insertUser(createuserDto: CreateUserDto) {
    const { uuid, discordUsername, guildNickname, discriminator, roleList} =
      createuserDto;

    const roleIdArray = roleList.map(v => {
      return {
        discordUUID : uuid,
        discordRoleId : v
      }
    })

    try {
      const [newUser] = await this.$transaction([
        this.user.create({
          data: {
            discordUUID: uuid,
            discordUsername,
            discriminator,
            guildNickname,
            Cake: {
              create: { cake: 0 },
            },
            CakeUpdateHistory: {
              create: {
                changeAmount: 0,
                reason: 'New User',
              },
            },
          },
        }),
        this.discordUserRole.createMany({
          data : roleIdArray
        })
      ]);

      return await this.user.findUnique({
        where: {
          discordUUID: newUser.discordUUID,
        },
        include: {
          Cake: true,
        },
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('Internal Server error')
    }
  }

  async patchUser(patchUserDto: PatchUserDto) {
    const { oldUUID, newUUID, discordUsername, guildNickname, discriminator, roleList } =
      patchUserDto;

    const roleIdArray = roleList.map(v => {
      return {
        discordUUID : newUUID,
        discordRoleId : v
      }
    })

    await this.$transaction([
      this.user.update({
        where: {
          discordUUID: oldUUID,
        },
        data: {
          discordUUID: newUUID,
          discordUsername,
          guildNickname,
          discriminator,
        },
      }),
      this.discordUserRole.deleteMany({
        where : {
          discordUUID : {
            contains : newUUID
          }
        }
      }),
      this.discordUserRole.createMany({
        data : roleIdArray
      })
    ])
  }

  async getCakeList(skip: number = 0, take: number = 10) {
    try {
      const cakeList: Cake[] = await this.cake.findMany({
        orderBy: {
          cake: 'desc',
        },
        include: {
          User: true,
        },
        skip: Number(skip),
        take: Number(take),
      });

      return cakeList;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('Internal Server error')
    }
  }

  async getCakeUpdateHistory(uuid : string, take : number) {
    try {
      const user = await this.findUserByDiscordUUID(uuid);
      return await this.cakeUpdateHistory.findMany({
        where: {
          userIdx: user.idx,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getLastCakeUpdateHistory(uuid: string, reason: string) {
    try {
      const user = await this.findUserByDiscordUUID(uuid);
      return await this.cakeUpdateHistory.findFirst({
        where: {
          reason: reason,
          userIdx: user.idx,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async updateCake(updateCakeDto: UpdateCakeDto) {
    const { uuid, reason, amount } = updateCakeDto;

    try {
      const user = await this.findUserByDiscordUUID(uuid);

      // ?????? ??? ?????? ???????????? ?????? ????????? ?????? 0 ?????? ??????.
      if(amount + user.Cake.cake < 0) {
        const [updatedCake, updateHistory] = await this.$transaction([
          this.cake.update({
            where: { userIdx: user.idx },
            data: {
              cake: 0,
            },
          }),
          this.cakeUpdateHistory.create({
            data: {
              userIdx: user.idx,
              changeAmount: -user.Cake.cake,
              reason,
            },
          })
        ])

        return {
          transaction_id_list : [updateHistory.idx]
        }
      } else {
        // ????????? ????????? ???????????? ????????????
        const newCakeAmount = user.Cake.cake + amount;
        const [updatedCake, updateHistory] = await this.$transaction([
          this.cake.update({
            where: { userIdx: user.idx },
            data: {
              cake: newCakeAmount,
            },
          }),
          this.cakeUpdateHistory.create({
            data: {
              userIdx: user.idx,
              changeAmount: amount,
              reason,
            },
          })
        ])

        return {
          transaction_id_list : [updateHistory.idx]
        }
      }
    } catch (e) {
      throw 'Transaction Failed'
    }
  }

  async sendCake(sendCakeDto : SendCakeDto) {

    const sendUser = await this.findUserByDiscordUUID(sendCakeDto.sender);
    const receiverUser = await this.findUserByDiscordUUID(sendCakeDto.receiver);

    if(!sendUser) {
      throw 'Sender is not exist'
    }

    if(!receiverUser) {
      throw 'Receiver is not exist'
    }

    // ????????? ????????? ???????????? ???????????? ????????? ???????????? ??? ?????? (????????????)
    if(sendUser.Cake.cake >= sendCakeDto.amount) {
      const sendUserCakeAmount : number = sendUser.Cake.cake - sendCakeDto.amount;
      const receiverUserCakeAmount : number = receiverUser.Cake.cake + sendCakeDto.amount;
  
      try {
        const [sendUserCake, receiverUserCake, sendHistory, receiveHistory] = await this.$transaction([
          this.cake.update({where : {userIdx : sendUser.idx}, data : { cake : sendUserCakeAmount}}),
          this.cake.update({where : {userIdx : receiverUser.idx}, data : {cake : receiverUserCakeAmount}}),
          this.cakeUpdateHistory.create({
            data : {
              userIdx : sendUser.idx,
              changeAmount : -sendCakeDto.amount,
              reason : 'SEND'
            }
          }),
          this.cakeUpdateHistory.create({
            data : {
              userIdx : receiverUser.idx,
                changeAmount : sendCakeDto.amount,
                reason : 'RECEIVE'
            }
          })
        ]);

        return {
          transaction_id_list : [sendHistory.idx , receiveHistory.idx]
        }
      } catch(e) {
        throw 'Transaction Failed'
      }
    } else {
      // ????????? ?????? ???????????? ???????????? ???????????? ?????? ??????
      throw 'Your cake is not enough to send'
    } 
  }
}
