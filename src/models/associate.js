const User = require('./user');
const Role = require('./role');
const UserAccess = require('./user_access');

const FavWork = require('./fav_work');
const UserFavWork = require('./user_fav_work');

const Conversation = require('./conversation');
const UserConversation = require('./user_conversation');
const Message = require('./message');

/* User - Role  */
User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

/* User - Access */
User.hasMany(UserAccess, { foreignKey: 'user_id' });
UserAccess.belongsTo(User, { foreignKey: 'user_id' });

/*  User - FavWork  */
User.belongsToMany(FavWork, {
  through: UserFavWork,
  foreignKey: 'user_id',
});
FavWork.belongsToMany(User, {
  through: UserFavWork,
  foreignKey: 'fav_work_id',
});

/*  User - Conversation  */
User.belongsToMany(Conversation, {
  through: UserConversation,
  foreignKey: 'user_id',
});
Conversation.belongsToMany(User, {
  through: UserConversation,
  foreignKey: 'conversation_id',
});

/* Conversation - Message  */
Conversation.hasMany(Message, {
  foreignKey: 'conversation_id',
  onDelete: 'CASCADE',
});
Message.belongsTo(Conversation, {
  foreignKey: 'conversation_id',
});

/*  User - Message */
User.hasMany(Message, {
  foreignKey: 'sender_id',
});
Message.belongsTo(User, {
  foreignKey: 'sender_id',
});

module.exports = {
  User,
  Role,
  UserAccess,
  FavWork,
  UserFavWork,
  Conversation,
  UserConversation,
  Message,
};
