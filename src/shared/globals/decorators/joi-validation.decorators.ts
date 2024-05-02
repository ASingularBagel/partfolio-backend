import { JoiRequestValidationError } from '@globals/helpers/error-handler';
import { ObjectSchema } from 'joi';
import { Request } from 'express';
/* eslint-disable @typescript-eslint/no-explicit-any */

type IJoiDecorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;

export function joiValidation(schema: ObjectSchema): IJoiDecorator {
  return (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];
      const { error } = await Promise.resolve(schema.validate(req.body, { abortEarly: false }));

      if (error?.details) {
        const errors = error.details.map((detail) => {
          return {
            field: detail.context?.key,
            message: detail.message,
            type: detail.type
          };
        });

        throw new JoiRequestValidationError('Request validation failed.', errors);
      }

      return originalMethod.apply(this, [...args]);
    };

    return descriptor;
  };
}
