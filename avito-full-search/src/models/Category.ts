import {marshall} from '@aws-sdk/util-dynamodb';
import {getDynamoTable} from '@utils/config';
import {getDynamoClient} from '@utils/dynamo';
import {createLogger} from '@utils/logger';
import {
  plainToInstance,
  Exclude,
  Expose,
  instanceToPlain,
} from 'class-transformer';

export class Category {
  static create(category: Avito.Category) {
    return plainToInstance(Category, category);
  }

  private logger = createLogger('Category model');

  public async save() {
    try {
      const client = getDynamoClient();
      const plainCategory = instanceToPlain(this, {
        excludeExtraneousValues: true,
      });
      const Item = marshall(plainCategory, {removeUndefinedValues: true});
      await client.putItem({
        TableName: getDynamoTable(),
        Item,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Expose({toPlainOnly: true})
  get PK() {
    return this.id;
  }

  @Expose({toPlainOnly: true})
  get SK() {
    return this.title;
  }

  @Expose({toPlainOnly: true})
  get parent_id() {
    return this.parentId;
  }

  @Exclude({toPlainOnly: true})
  id: number;

  @Expose({toPlainOnly: true})
  valid: number;

  @Expose({toPlainOnly: true})
  link: string;

  @Exclude({toPlainOnly: true})
  title: string;

  @Exclude({toPlainOnly: true})
  parentId?: number;

  @Exclude({toPlainOnly: true})
  subs: Category[];
}
