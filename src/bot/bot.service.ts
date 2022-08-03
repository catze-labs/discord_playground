import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BotService {
  constructor(private prisma: PrismaService) {}
}
