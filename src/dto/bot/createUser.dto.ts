import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Discord User UUID' })
  uuid: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Discord Username' })
  discordUsername: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Discord User discriminator' })
  discriminator: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Discord User nickname' })
  guildNickname: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ description : 'Discord User Role List'})
  roleList : string[];
}
