import decode from 'jwt-decode';
import _ from 'lodash';

export default {
  check() {
    try {
      const payload = this.get();
      if (_.isEmpty(payload)) {
        return false;
      }

      const decoded = decode(payload);
      if (_.isEmpty(decoded)) {
        return false;
      }

      return !decoded.exp < Date.now() / 1000;
    } catch (ex) {
      this.remove();
      return false;
    }
  },
  get() {
    // return sessionStorage.getItem('TOKEN');
    return localStorage.getItem('TOKEN');
  },
  save(token) {
    // sessionStorage.setItem('TOKEN', token);
    localStorage.setItem('TOKEN', token);
  },
  remove() {
    // sessionStorage.removeItem('TOKEN');
    localStorage.removeItem('TOKEN');
  },
};
