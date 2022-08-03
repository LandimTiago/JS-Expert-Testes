const Base = require("./base/base");

class Customer extends Base {
  constructor({ id, name, age }) {
    // assim eu envio as informações para o Base
    super({ id, name });
    this.age = age;
  }
}
module.exports = Customer;
