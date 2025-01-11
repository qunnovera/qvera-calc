
/**
 * Determines whether an object is a primitive type (string, number, Boolean, or Date).
 *
 * @param value Value to test.
 */
export function isPrimitive(value: any): value is string | number | Boolean | Date {
  return isString(value) || isNumber(value) || isBoolean(value) || isDate(value);
}
/**
* Determines whether an object is a string.
*
* @param value Value to test.
*/
export function isString(value: any): value is string {
  return typeof (value) == 'string';
}
/**
* Determines whether a string is null, empty, or whitespace only.
*
* @param value Value to test.
*/
export function isNullOrWhiteSpace(value: string): boolean {
  return !value || !/\S/.test(value); // even faster (usually)
}
/**
* Determines whether an object is a number.
*
* @param value Value to test.
*/
export function isNumber(value: any): value is number {
  return typeof (value) == 'number';
}
/**
* Determines whether an object is an integer.
*
* @param value Value to test.
*/
export function isInt(value: any): value is number {
  return isNumber(value) && value == Math.round(value);
}
/**
* Determines whether an object is a Boolean.
*
* @param value Value to test.
*/
export function isBoolean(value: any): value is boolean {
  return typeof (value) == 'boolean';
}
/**
* Determines whether an object is a function.
*
* @param value Value to test.
*/
export function isFunction(value: any): value is Function {
  return typeof (value) == 'function';
}
/**
* Determines whether an object is undefined.
*
* @param value Value to test.
*/
export function isUndefined(value: any): value is undefined {
  return typeof (value) == 'undefined'
}
/**
* Determines whether an object is a Date.
*
* @param value Value to test.
*/
export function isDate(value: any): value is Date {
  return (value instanceof Date || Object.prototype.toString.call(value) === '[object Date]')
      ? !isNaN(value.getTime())
      : false;
}
/**
* Determines whether an object is an Array.
*
* @param value Value to test.
*/
export function isArray(value: any): value is Array<any> {
  return value instanceof Array || // doesn't work on different windows
      Array.isArray(value) || // doesn't work on derived classes
      Object.prototype.toString.call(value) === '[object Array]'; // always works
}
/**
* Determines whether a value is an object
* (as opposed to a value type, an array, or a Date).
*
* @param value Value to test.
*/
export function isObject(value: any): boolean {
  return value != null && typeof (value) == 'object' && !isDate(value) && !isArray(value);
}