import {
  FieldError,
  FieldErrors,
  FieldValues,
  Resolver,
} from 'react-hook-form';
import { ZodError, ZodType } from 'zod/v4';

const zodToHookFormErrors = <T extends FieldValues>(
  zodError: ZodError
): FieldErrors<T> => {
  const errors: FieldErrors = {};
  for (const issue of zodError.issues) {
    const path = issue.path.join('.') || 'root';
    errors[path] = {
      type: issue.code,
      message: issue.message,
    } as FieldError;
  }
  return errors as FieldErrors<T>;
};

// ZMIANA: Użyj synchronicznej walidacji
export function customResolver<T extends FieldValues>(
  schema: ZodType
): Resolver<T> {
  return (
    values: T
  ): {
    values: FieldValues;
    errors: FieldErrors<T>;
  } => {
    try {
      // KLUCZOWA ZMIANA: safeParse zamiast safeParseAsync
      const result = schema.safeParse(values);

      if (result.success) {
        return {
          values: result.data as T,
          errors: {},
        };
      } else {
        return {
          values: {} as T,
          errors: zodToHookFormErrors<T>(result.error) as FieldErrors<T>,
        };
      }
    } catch (error) {
      console.error('Resolver error: ', error);
      return {
        values: {} as T,
        errors: {
          root: {
            type: 'unknown',
            message: 'An unknown error occurred during validation.',
          } as FieldError,
        } as FieldErrors<T>,
      };
    }
  };
}
