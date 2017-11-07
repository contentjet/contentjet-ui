import jwtDecode from 'jwt-decode';
import moment from 'moment';


function getToken() {
  return window.localStorage.getItem('token');
}


function getTokenExpiry() {
  var token = getToken();
  if (!token || token === 'undefined') {
    return false;
  }
  var payload = jwtDecode(token);
  return moment.unix(payload.exp);
}


function setToken(token) {
  window.localStorage.setItem('token', token);
}


function deleteToken() {
  window.localStorage.removeItem('token');
}


function tokenExpiringSoon() {
  // Is token expiring within the next 5 minutes
  var tokenExpiry = getTokenExpiry();
  if (!tokenExpiry || !hasValidToken()) {
    return false;
  }
  return moment().isAfter(tokenExpiry.subtract(5, 'minutes'));
}


function hasValidToken() {
  var tokenExpiry = getTokenExpiry();
  if (!tokenExpiry) {
    return false;
  }
  return moment().isBefore(tokenExpiry);
}


export default {
  getToken,
  getTokenExpiry,
  setToken,
  deleteToken,
  tokenExpiringSoon,
  hasValidToken
};
