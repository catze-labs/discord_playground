import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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

  async insertUser(uuid: string) {
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

  async updateCakeToken(uuid: string, amount: number, reason: string) {
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
