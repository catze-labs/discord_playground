import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags('Server General')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health-check')
  getHello(): any {
    Logger.log('Health Check Requestd.', 'General-API')
    return {status : true};
  }

  @Get('/ping')
  ping(): string {
    return Date.now().toString();
  }
}
