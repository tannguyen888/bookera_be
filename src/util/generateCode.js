/**
 * Generate a random 6-digit code
 * @returns {string} 6-digit code as string
 */
const generateRecoverCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  generateRecoverCode,
};
