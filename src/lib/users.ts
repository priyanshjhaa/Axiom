// Shared user storage for development
// In production, this would be replaced with a proper database

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

// Initial demo user
const initialUsers: { [key: string]: User } = {
  'test@axiom.app': {
    id: '1',
    email: 'test@axiom.app',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0ukg/Lgj5S', // password: "test123"
    firstName: 'Test',
    lastName: 'User',
    createdAt: new Date().toISOString()
  }
};

// In-memory user storage that persists between API calls
let users: { [key: string]: User } = { ...initialUsers };

export const usersStorage = {
  getUsers: () => users,
  addUser: (email: string, user: User) => {
    console.log('usersStorage.addUser called:', { email, user: { ...user, password: '[HIDDEN]' } });
    users[email] = user;
    console.log('User added. Total users:', Object.keys(users).length);
  },
  getUser: (email: string) => users[email],
  userExists: (email: string) => {
    const exists = !!users[email];
    console.log('usersStorage.userExists called:', { email, exists });
    console.log('Current users:', Object.keys(users));
    return exists;
  },

  // For development/debugging
  resetUsers: () => {
    users = { ...initialUsers };
  },

  // Get user count for stats
  getUserCount: () => Object.keys(users).length
};

// Make users available for direct access in auth
export const getUsers = () => users;