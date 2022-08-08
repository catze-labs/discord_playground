import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SendCakeDto {
    @IsNotEmpty()
    @ApiProperty({ description: 'Send User discord UUID' })
    sender : string;

    @IsNotEmpty()
    @ApiProperty({ description: 'Reciever User discord UUID' })
    receiver : string;

    @IsNotEmpty()
    @ApiProperty({ description: 'Cake amount' })
    amount : number;
}