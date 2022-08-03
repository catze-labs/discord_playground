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
            create: { cake: 1000 },
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
}
