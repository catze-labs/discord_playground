import { IsNotEmpty } from 'class-validator';

export class PatchUserDto {
  @IsNotEmpty()
  oldUUID: string;

  @IsNotEmpty()
  newUUID: string;

  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  discriminator: string;
}
