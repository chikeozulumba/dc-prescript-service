import Joi = require("@hapi/joi");

export const addPrescriptionSchema = Joi.object()
  .keys({
    title: Joi.string()
      .required()
      .label('Prescription Title')
      .messages({
        'any.required': 'Prescription title is required',
        'string.empty': `Prescription title cannot be empty!`,
      }),
    drugName: Joi.string()
      .required()
      .label('Drug Name')
      .messages({
        'any.required': 'Prescription Drug Name is required',
        'string.empty': `Prescription Drug Name cannot be empty!`,
      }),
    type: Joi.string()
      .required()
      .label('Prescription Type')
      .valid('tablets', 'liquid')
      .messages({
        'any.required': 'Prescription Type is required',
        'string.empty': `Prescription Type cannot be empty!`,
      }),
    quantity: Joi.number()
      .required()
      .label('Prescription Quantity')
      .min(1)
      .messages({
        'any.required': 'Prescription Quantity is required',
        'string.empty': `Prescription Quantity cannot be empty!`,
      }),
    dailyInterval: Joi.array()
      .items(Joi.string())
      .required()
      .label('Daily Interval')
      .messages({
        'any.required': 'Daily Interval is required',
        'string.empty': `Daily Interval cannot be empty!`,
      }),
    dosageDuration: Joi.object()
      .keys({
        start: Joi.string().required(),
        end: Joi.string().required(),
      })
      .required()
      .label('Dosage DUration')
      .messages({
        'any.required': 'Dosage Duration of the prescription is required',
        'string.empty': `Dosage Duration of the prescription cannot be empty!`,
      }),
    additionalInformation: Joi.string()
      .optional()
      .label('Additional Information')
      .messages({
        'any.required': 'Additional Information for the prescription is required',
        'string.empty': `Additional Information for the prescription cannot be empty!`,
      }),
  })
  .required();

export const deletePrescriptionSchema = Joi.object()
  .keys({
    id: Joi.string()
      .required()
      .label('Prescription ID')
      .messages({
        'any.required': 'Prescription ID is required',
        'string.empty': `Prescription ID cannot be empty!`,
      }),
  })
  .required();
