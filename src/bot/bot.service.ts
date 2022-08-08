import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/bot/createUser.dto';
import { PatchUserDto } from 'src/dto/bot/patchUser.dto';
import { SendCakeDto } from 'src/dto/bot/SendCake.dto';
import { UpdateCakeDto } from 'src/dto/bot/updateCake.dto';
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

  async patchUser(patchUserDto: PatchUserDto) {
    const user = await this.prisma.findUserByDiscordUUID(patchUserDto.oldUUID);

    if (!user) {
      throw new InternalServerErrorException(
        `${patchUserDto.oldUUID} is not exist`,
      );
    }

    try {
      await this.prisma.patchUser(patchUserDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updateCake(updateCakeAmountDto: UpdateCakeDto) {
    const { uuid, reason } = updateCakeAmountDto;

    // 주기 시간 (단위 : 분)
    const reasonPeriodicTimeObj = {
      DICE: 15,
      RPS: 15,
      COIN: 15,
      ROULETTE: 15,
      WORK: 60,
      DAILY_REWARD: 1440,
      OOTD_UPLOAD : 1440
    };

    // 케이크 업데이트에 시간 주기 제한이 걸려있다면
    if (reasonPeriodicTimeObj[reason]) {
      // 마지막으로 실행됬던 같은 유저의 - 같은 이유의 히스토리 가져옴
      const lastCakeUpdateHistory = await this.prisma.getLastCakeUpdateHistory(
        uuid,
        reason,
      );

      // 기록이 존재 할 때
      if (lastCakeUpdateHistory) {
        // 현재시간
        let now = new Date();
        // 마지막 기록의 시간 + 업데이트 이유마다 정해진 시간
        let lastCakeUpdateHistoryDate = new Date(
          lastCakeUpdateHistory.createdAt.setMinutes(
            lastCakeUpdateHistory.createdAt.getMinutes() +
              reasonPeriodicTimeObj[reason],
          ),
        );

        // 마지막 기록시간 + 주기시간이 지났다면
        if (now > lastCakeUpdateHistoryDate) {
          // 업데이트
          await this.prisma.updateCake(updateCakeAmountDto);
        } else {
          // 지나지 않았다면 남은 시간 초로 반환
          let remainTime =
            (lastCakeUpdateHistoryDate.getTime() - now.getTime()) / 1000;

          let informationString =
            'Plz wait for ' + this.secondsToHMS(remainTime);

          throw new InternalServerErrorException(informationString);
        }
      } else {
        // 존재하지 않을 때
        await this.prisma.updateCake(updateCakeAmountDto);
      }
    } else {
      await this.prisma.updateCake(updateCakeAmountDto);
    }
  }

  async getCakeRank(skip: number, take: number) {
    return await this.prisma.getCakeList(skip, take);
  }

  async getMyCake(uuid: string) {
    const user = await this.prisma.findUserByDiscordUUID(uuid);
    return user.Cake;
  }

  async sendCake(sendCakeDto : SendCakeDto) {
    try {
      await this.prisma.sendCake(sendCakeDto)
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  secondsToHMS(seconds: number) {
    return `${parseInt((seconds / 3600).toString())} h ${parseInt(
      ((seconds % 3600) / 60).toString(),
    )} m ${parseInt((seconds % 60).toString())} s`;
  }
}
