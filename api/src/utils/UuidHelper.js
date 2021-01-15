
const { v4: uuidv4 } = require('uuid');

const UUIDHelper = {
    generateUUID: () => {
        return uuidv4();
    }
};
module.exports = UUIDHelper;


