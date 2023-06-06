import { filterConditionalClasses } from './filter-conditional-classes/filter-conditional-classes.util';
import { stripWhitespace } from './strip-whitespace/strip-whitespace.util';

type ConditionalClasses = Record<string, any>;

// Overloads
export function joinClasses(baseClasses: string | string[], conditionalClasses?: ConditionalClasses): string;
export function joinClasses(conditionalClasses: ConditionalClasses, b?: never): string;

// Implementation
/**
 * Takes a string or string[], and/or the keys from a Record<string, any> that point to a truthy value, and returns a single string with all unnecessary white space removed
 *
 * @param baseClasses string|string[]|Record<string, any>
 * @param conditionalClasses Record<string, any>
 *
 * @return string
 */
export function joinClasses(
  baseClasses: string | string[] | ConditionalClasses,
  conditionalClasses?: ConditionalClasses | never,
): string {
  const returnedClassesArray: string[] = [];

  switch (typeof baseClasses) {
    case 'string':
      returnedClassesArray.push(baseClasses);
      break;
    case 'object': {
      const baseClassResolvedFromObjects = Array.isArray(baseClasses)
        ? baseClasses
        : filterConditionalClasses(baseClasses);

      returnedClassesArray.push(...baseClassResolvedFromObjects);
      break;
    }
  }

  if (conditionalClasses) {
    const resolvedAdditionalClasses = filterConditionalClasses(conditionalClasses);
    returnedClassesArray.push(...resolvedAdditionalClasses);
  }

  return stripWhitespace(returnedClassesArray.join(' '));
}
