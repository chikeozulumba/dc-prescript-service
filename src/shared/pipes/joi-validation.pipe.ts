import { Injectable, PipeTransform, UnprocessableEntityException } from '@nestjs/common';
import * as Joi from '@hapi/joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: Joi.ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new UnprocessableEntityException(this.formatError(error));
    }
    return value;
  }

  formatError(error: Joi.ValidationError) {
    let scope = error.details[0].context.valids || error.details[0].context?.label || error.details[0].context.key;
    if (typeof scope !== 'string') {
      console.log(error.details[0].context);
      scope =
        error.details[0].context.valids[0].label ||
        error.details[0].context.valids[0].key;
    }
    return { error: error.details.map(detail => detail.message), scope };
  }
}
