import { Injectable } from '@nestjs/common';
import { REQUEST_CONTEXT } from '@tokens';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsNotTakenName', async: true })
@Injectable()
export class IsNameNotTaken implements ValidatorConstraintInterface {
  async validate(
    name: string,
    validationArguments?: ExtendedValidationArguments,
  ): Promise<boolean> {
    const schedules = validationArguments?.object[REQUEST_CONTEXT]?.schedules;
    if (!schedules || schedules.length === 0) {
      return true;
    }

    return schedules.filter((schedule) => schedule.Name === name).length === 0;
  }
}

export function IsNotTakenName(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsNotTakenName',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsNameNotTaken,
    });
  };
}
