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
      return await this.userToken.findUnique({
        where: {
          id: idx,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async findUserByDiscordUUID(uuid: string) {
    try {
      return await this.userToken.findUnique({
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
      await this.userToken.create({
        data: {
          discordUUID: uuid,
        },
      });

      return this.userToken.findUnique({
        where: {
          discordUUID: uuid,
        },
      });
    } catch (e) {}
  }
}
