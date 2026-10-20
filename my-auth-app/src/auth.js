import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

const auth = {
  token: null,
  user: null,

  init() {
    // session persistence — restore session on page refresh
    this.token = localStorage.getItem("token");
    this.user = JSON.parse(localStorage.getItem("user") || "null");
    if (this.token)
      api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
  },

  async login(email, password) {
    const { data } = await api.post("/login", { email, password });
    this._save(data);
  },

  async signup(email, password, role) {
    const { data } = await api.post("/signup", { email, password, role });
    this._save(data);
  },

  _save({ token, user }) {
    this.token = token;
    this.user = user;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  },

  isLoggedIn() {
    return !!this.token;
  },
  hasRole(role) {
    return this.user?.roles?.includes(role) ?? false;
  },
};

export { auth, api };