import {
  ConflictException,
  FlexibleTimeWindowMode,
  ResourceNotFoundException,
  ScheduleState,
  Scheduler,
} from '@aws-sdk/client-scheduler';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ScheduleGroup } from './models/schedule.group.model';
import { Schedule } from './models/schedule.model';
import { plainToClass } from 'class-transformer';
import { Config } from '@modules/config/config.service';
import { PARSER_ARN, ROLE_ARN } from '@tokens';

@Injectable()
export class SchedulerService {
  constructor(private scheduler: Scheduler) {}

  private SPILLTER = '__';

  private MINUTE = 'minutes';

  private DEFAULT_RATE = 3;

  private getGroupNameFromUser(user: User) {
    return `${user.chatId}${this.SPILLTER}${user.id}`;
  }

  private makeScheduleInput(user: User, link: string) {
    return JSON.stringify({
      payload: {
        url: link,
        chat_id: user.chatId,
        user_id: user.id,
      },
    });
  }

  private makeScheduleExpression() {
    return `rate(${this.DEFAULT_RATE} ${this.MINUTE})`;
  }

  private makeScheduleTimeWindow() {
    return {
      Mode: FlexibleTimeWindowMode.OFF,
    };
  }

  public async createGroup(user: User): Promise<ScheduleGroup> {
    const group = await this.scheduler.createScheduleGroup({
      Name: this.getGroupNameFromUser(user),
    });
    return plainToClass(ScheduleGroup, group);
  }

  public async getScheduleGroup(
    user: User,
  ): Promise<ScheduleGroup | undefined> {
    try {
      const group = await this.scheduler.getScheduleGroup({
        Name: this.getGroupNameFromUser(user),
      });
      return plainToClass(ScheduleGroup, group);
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        return;
      }
      throw new InternalServerErrorException();
    }
  }

  public async listSchedules(user: User): Promise<Schedule[]> {
    const schedules = await this.scheduler.listSchedules({
      GroupName: this.getGroupNameFromUser(user),
    });

    return schedules.Schedules.map((schedule) =>
      plainToClass(Schedule, schedule, { excludeExtraneousValues: true }),
    );
  }

  public async addSchedule(
    user: User,
    link: string,
    name: string,
  ): Promise<Schedule> {
    try {
      await this.scheduler.createSchedule({
        Name: name,
        GroupName: this.getGroupNameFromUser(user),
        Target: {
          Input: this.makeScheduleInput(user, link),
          Arn: Config[PARSER_ARN],
          RoleArn: Config[ROLE_ARN],
        },
        ScheduleExpression: this.makeScheduleExpression(),
        FlexibleTimeWindow: this.makeScheduleTimeWindow(),
      });

      return this.getSchedule(user, name);
    } catch (err) {
      if (err instanceof ConflictException) {
        throw new BadRequestException(`Name ${name} is already taken`);
      }
      throw new InternalServerErrorException('Failed to schedule.');
    }
  }

  public async getSchedule(
    user: User,
    name: string,
  ): Promise<Schedule | undefined> {
    try {
      const schedule = await this.scheduler.getSchedule({
        GroupName: this.getGroupNameFromUser(user),
        Name: name,
      });

      return plainToClass(Schedule, schedule, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      if (err instanceof ResourceNotFoundException) {
        return;
      }
      throw new InternalServerErrorException('Failed loading schedule.');
    }
  }

  public async changeScheduleState(
    user: User,
    name: string,
    state: ScheduleState,
  ): Promise<Schedule> {
    const schedule = await this.getSchedule(user, name);
    await this.scheduler.updateSchedule({
      ...schedule,
      Target: {
        ...schedule.Target,
        Input: JSON.stringify(schedule.Target.Input),
      },
      State: state,
      ScheduleExpression: this.makeScheduleExpression(),
      FlexibleTimeWindow: this.makeScheduleTimeWindow(),
    });
    return this.getSchedule(user, name);
  }

  public async deleteSchedule(name: string, user: User) {
    await this.scheduler.deleteSchedule({
      Name: name,
      GroupName: this.getGroupNameFromUser(user),
    });
  }
}
