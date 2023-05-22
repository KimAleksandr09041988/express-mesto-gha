const regularAvatar = /^((http|https:\/\/.)[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*\.[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)$/;
const regularLink = /^(ftp|http|https):\/\/[^ "]+$/;

module.exports = {
  regularAvatar,
  regularLink,
};
