const storagePrefix = "bas_token";

const storage = {
  getToken: () => {
    return JSON.parse(window.localStorage.getItem(storagePrefix) || "null");
  },
  setToken: (token: object) => {
    window.localStorage.setItem(`${storagePrefix}`, JSON.stringify(token));
  },
  clearToken: () => {
    window.localStorage.removeItem(`${storagePrefix}`);
  }
};

export default storage;
