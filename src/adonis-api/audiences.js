import apiCall from './api-call';

/**
 * Get an array of audiences.
 * @param {Object} queryParams
 * @param {number} queryParams.perPage Number of items per page
 * @param {number} queryParams.page The page to get results for
 * @param {string} queryParams.sort The field to sort by
 * @param {string} queryParams.direction Sort direction
 * @param {import('./api-call').ApiOptions} [options]
 * @return {Promise}
 */
export async function getAudiences(queryParams, options) {
  return apiCall('GET', '/audiences', queryParams, null, options);
}

/**
 * Get a single audience.
 * @param {string} id Audience ID
 * @param {import('./api-call').ApiOptions} [options]
 * @return {Promise}
 */
export async function getAudience(id, options) {
  return apiCall('GET', `/audiences/${id}`, null, null, options);
}
