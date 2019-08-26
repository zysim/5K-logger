// Utilities.js

/**
 * This file contains utility functions
 */

export default {
  /**
   * Checks if an array is neither `null` nor has a length of zero
   *
   * @param {Array} array The array to check
   *
   * @returns {boolean} `true` if `array` has values; `false` otherwise
   */
  arrayIsFilled(array: any[] | null): boolean {
    return array && array.length > 0 ? true : false
  },
  /**
   * Returns the array if it is neither `null` nor has a length of zero.
   * Otherwise, it will return `null`.
   *
   * @param {Array} array The array to check
   *
   * @returns {Array|null} The array itself if it passes the test; `null`
   *                       otherwise
   */
  arrayOrBust(array: any[] | null): any[] | null {
    return array && array.length > 0 ? array : null
  },
  /**
   * Returns the object if it is neither `null` nor empty. Otherwise, it will
   * return `null`.
   *
   * The way this method checks for an empty object is by using
   * Object.keys(), which runs through **enumerable** props and methods. So
   * bear that in mind if your object contains props that aren't enumerable.
   *
   *
   * @param {object} object The object to check
   *
   * @returns {object|null} The object itself if it passes the test; `null`
   *                        otherwise
   *
   * @summary Returns the object if it isn't empty, or `null` otherwise
   */
  objectOrBust(object: object | null): object | null {
    return object && Object.keys(object).length > 0 ? object : null
  },
}
