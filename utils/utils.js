const userResFormat = (user) => ({
  name: user.name,
  about: user.about,
  avatar: user.avatar,
  _id: user._id.toString(),
  email: user.email,
});

const cardResFormat = (card) => ({
  name: card.name,
  link: card.link,
  _id: card._id,
  likes: card.likes,
  owner: {
    name: card.owner.name,
    about: card.owner.about,
    avatar: card.owner.avatar,
    _id: card.owner._id,
  },
  createdAt: card.createdAt,
});

const LINK_EXP = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
module.exports = {
  userResFormat, cardResFormat, LINK_EXP,
};
