import axios from 'axios';
import { API_URL } from '../config/constants';

export function fetchLoginPageData(token) {
  return axios.get(
    `${API_URL}/login-page-data`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

