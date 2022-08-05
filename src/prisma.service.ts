import {
  INestApplication,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from './dto/bot/createUser.dto';
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
    const { uuid } = createuserDto;
    try {
      await this.user.create({
        data: {
          discordUUID: uuid,
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
