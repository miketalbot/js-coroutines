import {wrapAsPromiseAndYieldFn} from './async-wrapper-utils'
import {map} from './map'

/**
 * Maps the contents of an array asynchronously
 * @function mapAsync
 * @param {Array} array
 * @param {Map} mapFn
 * @returns {Promise.<Array>} promise for the mapped array
 */
export const mapAsync = wrapAsPromiseAndYieldFn(map)
