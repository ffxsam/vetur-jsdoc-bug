/**
 * Adonis helpers. All API calls should be abstracted to this module.
 */

import axios from 'axios';
import _ from 'lodash';
import store from '../store';
import { debug } from '../helpers';

/**
 * Delay function.
 * @param {number} ms Delay in milliseconds
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * API options.
 * @typedef {Object} ApiOptions
 * @property {number} artificialDelay Number of milliseconds for an artificial delay
 * @property {boolean} forcedFailure The call will throw an error (for testing purposes)
 * @property {boolean} fullPath Ignore the /api/v1 prefix; this is a full path
 */

/**
 * Low level API call to Adonis endpoint.
 * @param {string} method HTTP request method
 * @param {string} endpointPath Path for request
 * @param {Object} queryParams Query params
 * @param {Object} data JSON data for PUT operations, etc
 * @param {string} token JWT token
 * @param {ApiOptions} [options]
 */
export default async function apiCall(
  method,
  endpointPath,
  queryParams,
  data,
  options = {}
) {
  const requestUrl =
    process.env.VUE_APP_ADONIS_ENDPOINT +
    (options.fullPath ? endpointPath : `/api/v1${endpointPath}`);

  try {
    const axiosOptions = {};
    let axiosCall, response;

    switch (method) {
      case 'GET':
        break; // This is the oddball, we'll call axios.get directly
      case 'PUT':
        axiosCall = axios.put;
        break;
      case 'POST':
        axiosCall = axios.post;
        break;
      case 'PATCH':
        axiosCall = axios.patch;
        break;
      default:
        console.error('Invalid HTTP method:', method);
        return;
    }

    // Artificial delay?
    if (
      options.artificialDelay &&
      typeof options.artificialDelay === 'number'
    ) {
      await delay(options.artificialDelay);
    }

    // Throw an error if dev wants simulated failure
    if (options.forcedFailure) throw new Error('forcedFailure flag set');

    // Add authorization header if applicable
    if (store.state.auth.token) {
      axiosOptions.headers = {
        Authorization: `Bearer ${store.state.auth.token}`,
      };
    }

    debug(
      'API call:',
      method,
      requestUrl,
      'queryParams:',
      queryParams,
      'data:',
      data,
      'JWT token:',
      store.state.auth.token
    );

    if (method === 'GET') {
      if (queryParams && typeof queryParams === 'object') {
        axiosOptions.params = queryParams;
      }

      response = await axios.get(requestUrl, axiosOptions);
    } else {
      response = await axiosCall(requestUrl, data, axiosOptions);
    }

    return response.data;
  } catch (e) {
    if (!options.fullPath) {
      const errorMsg = _.get(e.response, 'data.error.message');

      if (/^E_JWT_TOKEN_EXPIRED/.test(errorMsg)) {
        try {
          debug('JWT token expired, refreshing...');

          const response = await axios.post(
            `${process.env.VUE_APP_ADONIS_ENDPOINT}/auth/refresh-token`,
            {
              refresh_token: store.state.auth.refreshToken,
            }
          );

          await store.dispatch('auth/updateTokens', {
            token: response.data.token,
            refreshToken: response.data.refreshToken,
          });

          debug('Tokens updated in Vuex; re-calling API');
          return apiCall(method, endpointPath, queryParams, data, options);
        } catch (e) {
          if (
            /^E_INVALID_JWT_REFRESH_TOKEN/.test(e.response.data.error.message)
          ) {
            debug('Invalid refresh token; logging out');
            await store.dispatch('auth/logout');
          }
        }
      }

      throw new Error(errorMsg || e);
    } else {
      throw new Error(_.get(e.response, 'data[0].message') || e);
    }
  }
}
