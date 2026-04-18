const { plainToInstance } = require('class-transformer');
const { validate } = require('class-validator');

const validateDto = (dtoClass) => {
  return async (req, res, next) => {
    const dtoObject = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      const messages = errors.map(err => Object.values(err.constraints)).flat();
      return res.status(400).json({ message: messages[0], errors: messages });
    }
    
    req.body = dtoObject;
    next();
  };
};

module.exports = validateDto;