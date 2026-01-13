export const connectedUsers = new Map();

export const addUser = (userId, socketId) => {
  connectedUsers.set(userId, socketId);
};

export const removeUserBySocket = (socketId) => {
  for (const [userId, id] of connectedUsers.entries()) {
    if (id === socketId) {
      connectedUsers.delete(userId);
      return userId;
    }
  }
};
