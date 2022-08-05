import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/bot/createUser.dto';
import { UpdateCakeAmountDto } from 'src/dto/bot/updateCakeAmount.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BotService {
  constructor(private prisma: PrismaService) {}

  async findUserByIdx(idx: number) {
    return await this.prisma.findUserByIdx(idx);
  }

  async findUserByUUID(uuid: string) {
    return await this.prisma.findUserByDiscordUUID(uuid);
  }

  async createUser(createUserDto: CreateUserDto) {
    return await this.prisma.insertUser(createUserDto);
  }

  async updateCake(updateCakeAmountDto: UpdateCakeAmountDto) {
    const { uuid, reason } = updateCakeAmountDto;
    const games = ['DICE', 'RPS', 'COIN', 'ROULETTE'];

    // 케이크 업데이트가 게임에 의한 것이라면
    if (games.indexOf(reason) > -1) {
      // 마지막으로 같은 게임의 히스토리 가져옴
      const lastCakeUpdateHistory = await this.prisma.getLastCakeUpdateHistory(
        uuid,
        reason,
      );

      // 마지막 기록의 시간 + 15분
      let lastCakeUpdateHistoryDate = new Date(
        lastCakeUpdateHistory.createdAt.setMinutes(
          lastCakeUpdateHistory.createdAt.getMinutes() + 15,
        ),
      );

      // 현재시간
      let now = new Date();

      console.log(lastCakeUpdateHistoryDate);
      console.log(now);

      // 마지막 기록시간 + 15 분이 지났다면
      if (now > lastCakeUpdateHistoryDate) {
        // 업데이트
        await this.prisma.updateCake(updateCakeAmountDto);
      } else {
        // 지나지 않았다면 남은 시간 초로 반환
        const remainTime =
          (lastCakeUpdateHistoryDate.getTime() - now.getTime()) / 1000;
        throw new InternalServerErrorException(
          `Plz wait for ${(remainTime / 60).toFixed(0)} min ${(
            remainTime % 60
          ).toFixed(0)} sec.`,
        );
      }
    } else {
      await this.prisma.updateCake(updateCakeAmountDto);
    }
  }
}
