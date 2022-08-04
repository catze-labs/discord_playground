import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCakeAmountDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Discord User UUID' })
  uuid: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Cake amount update reason' })
  reason: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Cake amount of change ' })
  amount: number;
}
