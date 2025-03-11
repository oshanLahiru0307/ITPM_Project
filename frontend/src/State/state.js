import { proxy } from 'valtio';

let storedUser = null;

try {
  const user = localStorage.getItem("user");
  storedUser = user ? JSON.parse(user) : null;
} catch (error) {
  console.error("Error parsing user from localStorage:", error);
}

const storedToken = localStorage.getItem("token") || null;

const state = proxy({
  currentUser: storedUser,
  token: storedToken,
  activeIndex: -1,
  categories: [],
  users: [],
  items: [],
  donations: []
});

export default state;