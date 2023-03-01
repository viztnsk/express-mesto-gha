/* eslint-disable arrow-body-style */
const userResFormat = (user) => {
  return {
    name: user.name,
    about: user.about,
    avatar: user.avatar,
    _id: user._id,
  };
};

const cardResFormat = (card) => {
  return {
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
  };
};

module.exports = {
  userResFormat, cardResFormat,
};
