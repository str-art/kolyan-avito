import { IsNotTakenName } from '@modules/scheduler/validators/is.name.taken';
import { IsBoolean, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { BaseDto } from './Base';

export class CreateScheduleDto extends BaseDto {
  @IsString()
  @IsNotTakenName()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;
}

export class ToggleScheduleDto extends BaseDto {
  @IsBoolean()
  @IsNotEmpty()
  enabled: boolean;
}
