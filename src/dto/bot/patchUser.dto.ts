import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PatchUserDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Old Discord UUID' })
  oldUUID: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'New Discord UUID' })
  newUUID: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Discord Username' })
  discordUsername: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Discord User discriminator' })
  discriminator: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Discord User nickname' })
  guildNickname: string;
}
