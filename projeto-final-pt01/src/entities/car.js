const Base = require("./base/base");

class Car extends Base {
  constructor({ id, name, releaseYear, avaliable, gasAvaliable }) {
    // assim eu envio as informações para o Base
    super({ id, name });
    this.releaseYear = releaseYear;
    this.avaliable = avaliable;
    this.gasAvaliable = gasAvaliable;
  }
}
module.exports = Car;
