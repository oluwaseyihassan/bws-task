import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsStrictDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrictDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          
          // Check format strictly
          const regex = /^\d{4}-\d{2}-\d{2}$/;
          if (!regex.test(value)) return false;

          // Parse parts manually to avoid timezone issues
          const [year, month, day] = value.split('-').map(Number);
          const date = new Date(Date.UTC(year, month - 1, day));

          // Check if it's a valid date and matches the same parts
          return (
            date.getUTCFullYear() === year &&
            date.getUTCMonth() === month - 1 &&
            date.getUTCDate() === day
          );
        },
      },
    });
  };
}
