/**
 * Takes an object of where the keys are the classes
 * and the value of each key is a boolean value
 * and resolves to an array strings that are the
 * original objects keys that housed truthy boolean values
 *
 * @param conditionalClasses Record<string, boolean> e.g {foo: true. bar: false, 'foo-bar': false, 'bar-foo': true}
 *
 * @return string[] Based on the above param example: ['foo', 'bar-foo']
 */
export const filterConditionalClasses = (conditionalClasses: Record<string, any>): string[] =>
  Object
    // convert the object to an array of arrays. Each nested array contains the corresponding key/pair values
    .entries(conditionalClasses)
    // remove the items that have a falsy boolean value
    .filter((entry) => !!entry[1])
    // return only the class that was the key in the original object
    .map((value) => value[0]);
