import axios from 'axios';
import { API_URL } from '../config/constants';

/**
 * Creates request headers
 * @param {String} token
 * @returns {Object}
 */
function createHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'content-type': 'application/json'
  };
}

/**
 * Fetches login page data from backend
 * @param {String} token
 * @returns {Promise}
 */
export function fetchLoginPageData(token) {
  return new Promise((resolve, reject) => {
    axios.get(
      `${API_URL}/login-page-data`,
      { headers: createHeaders(token) }
    )
      .then(resp => resolve(resp.data.payload))
      .catch(err => reject(err.message));
  });
}

/**
 * Sends updated login page data to backend
 * @param {String} token
 * @param {Object} editOptions
 * @returns {Promise}
 */
export function updateLoginPageData(token, editOptions) {
  return new Promise((resolve, reject) => {
    axios.post(
      `${API_URL}/login-page-data`,
      { editOptions },
      { headers: createHeaders(token) }
    )
      .then(resp => resolve())
      .catch(err => reject(err.message));
  });
}
