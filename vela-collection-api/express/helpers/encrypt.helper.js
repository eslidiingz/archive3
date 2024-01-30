const bcrypt = require("bcryptjs");

const SALTROUND = 10;

const methods = {
  async hash(password) {
    try {
      const salt = await bcrypt.genSalt(SALTROUND);
      const hashed = await bcrypt.hash(password, salt);
      return hashed;
    } catch (err) {
      return null;
    }
  },
  hashAsync(password) {
    // Encryption of the string password
    bcrypt.genSalt(10, (err, Salt) => {
      if (err) return null;
      // The bcrypt is used for encrypting password.
      bcrypt.hash(password, Salt, (err, hashed) => {
        if (err) return null;
        return hashed;
      });
    });
  },
  async verify(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  },
};

module.exports = { ...methods };
