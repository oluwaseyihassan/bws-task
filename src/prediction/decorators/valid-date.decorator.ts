import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ValidDate = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const dateParam = request.params[data || 'date'];
    
    if (!dateParam) {
      throw new BadRequestException('Date parameter is required');
    }
    
    // Check format strictly
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateParam)) {
      throw new BadRequestException('Date must be in YYYY-MM-DD format');
    }
    
    // Parse parts manually to avoid timezone issues
    const [year, month, day] = dateParam.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    
    // Check if it's a valid date and matches the same parts
    const isValid = (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
    
    if (!isValid) {
      throw new BadRequestException('Date must be a valid date in YYYY-MM-DD format');
    }
    
    return dateParam;
  },
);
