import { JoiValidationPipe } from './joi-validation.pipe';
import * as Joi from '@hapi/joi';

const testSchema = Joi.object()
  .keys({
    phoneNumber: Joi.string()
      .regex(/^[0]\d{10}$/)
      .required()
      .messages({
        'any.required': 'Phone number is required',
        'string.empty': `Phone field cannot be a empty!`,
        'string.pattern.base': `Phone number format is incorrect. - e.g. 08123456789`,
      }),
  })
  .required();

describe('JoiValidationPipe', () => {
  it('should be defined', () => {
    expect(new JoiValidationPipe(testSchema)).toBeDefined();
  });
});
