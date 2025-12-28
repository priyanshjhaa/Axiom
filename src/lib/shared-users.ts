// Global user storage that persists across all modules
// This fixes the issue where different modules get different instances

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

// Use a global object to ensure shared storage
declare global {
  var axiomUsers: { [key: string]: User } | undefined;
}

// Initialize global users if not exists
if (!global.axiomUsers) {
  global.axiomUsers = {
    'test@axiom.app': {
      id: '1',
      email: 'test@axiom.app',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0ukg/Lgj5S', // password: "test123"
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date().toISOString()
    }
  };
  console.log('=== Global user storage initialized ===');
}

// Use let so we can reassign in reset function
let sharedUsers = global.axiomUsers;

export const sharedUsersStorage = {
  getUsers: () => sharedUsers,
  addUser: (email: string, user: User) => {
    console.log('=== SHARED addUser called ===', { email, user: { ...user, password: '[HIDDEN]' } });
    sharedUsers[email] = user;
    console.log('User added to shared storage. Total users:', Object.keys(sharedUsers).length);
    console.log('Shared users now:', Object.keys(sharedUsers));
  },
  getUser: (email: string) => {
    const user = sharedUsers[email];
    console.log('=== SHARED getUser called ===', { email, found: !!user });
    return user;
  },
  userExists: (email: string) => {
    const exists = !!sharedUsers[email];
    console.log('=== SHARED userExists called ===', { email, exists, totalUsers: Object.keys(sharedUsers).length });
    console.log('All users in shared storage:', Object.keys(sharedUsers));
    return exists;
  },
  resetUsers: () => {
    const resetData = {
      'test@axiom.app': {
        id: '1',
        email: 'test@axiom.app',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0ukg/Lgj5S',
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date().toISOString()
      }
    };

    // Update both local and global references
    sharedUsers = resetData;
    global.axiomUsers = resetData;

    console.log('=== Shared users reset ===');
  },
  getUserCount: () => Object.keys(sharedUsers).length
};

// Export for direct access
export const getSharedUsers = () => sharedUsers;