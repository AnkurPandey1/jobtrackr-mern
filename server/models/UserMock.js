const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../data/users.json');

// Ensure directory and file exists
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify([]));
}

const getUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (e) {
    return [];
  }
};
const saveUsers = (users) => fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));

const UserMock = {
  findOne: async ({ email }) => {
    const users = getUsers();
    const user = users.find(u => u.email === email.toLowerCase());
    if (!user) return null;
    return {
      ...user,
      comparePassword: async function(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
      }
    };
  },
  create: async ({ name, email, password }) => {
    const users = getUsers();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      _id: Math.random().toString(36).substring(2, 9),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);
    return {
      ...newUser,
      comparePassword: async function(candidate) {
        return await bcrypt.compare(candidate, this.password);
      }
    };
  },
  findById: async (id) => {
    const users = getUsers();
    const user = users.find(u => u._id === id.toString() || u._id === id);
    if (!user) return null;
    return {
      ...user,
      select: function(fields) {
        if (fields.includes('-password')) {
          const { password, ...rest } = this;
          return rest;
        }
        return this;
      }
    };
  }
};

module.exports = UserMock;
