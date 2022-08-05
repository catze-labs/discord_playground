import {
  INestApplication,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { Cake, PrismaClient } from '@prisma/client';
import { CreateUserDto } from './dto/bot/createUser.dto';
import { PatchUserDto } from './dto/bot/patchUser.dto';
import { UpdateCakeAmountDto } from './dto/bot/updateCakeAmount.dto';

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
      return await this.user.findUnique({
        where: {
          idx,
        },
        include: {
          Cake: true,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async findUserByDiscordUUID(uuid: string) {
    try {
      return await this.user.findUnique({
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
    const { uuid, discordUsername, guildNickname, discriminator } =
      createuserDto;
    try {
      await this.user.create({
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
      });

      return await this.user.findUnique({
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

  async patchUser(patchUserDto: PatchUserDto) {
    const { oldUUID, newUUID, discordUsername, guildNickname, discriminator } =
      patchUserDto;

    await this.user.update({
      where: {
        discordUUID: oldUUID,
      },
      data: {
        discordUUID: newUUID,
        discordUsername,
        guildNickname,
        discriminator,
      },
    });
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

      console.log(cakeList);

      return cakeList;
    } catch (e) {
      console.log(e);
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

  async updateCake(updateCakeDto: UpdateCakeAmountDto) {
    const { uuid, amount, reason } = updateCakeDto;

    try {
      const user = await this.findUserByDiscordUUID(uuid);

      const newCakeAmount = user.Cake.cake + amount;
      await this.cake.update({
        where: { userIdx: user.idx },
        data: {
          cake: newCakeAmount,
        },
      });

      await this.cakeUpdateHistory.create({
        data: {
          userIdx: user.idx,
          changeAmount: amount,
          reason,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
}
