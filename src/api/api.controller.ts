import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('api')
@ApiTags('For Web')
export class ApiController {}
