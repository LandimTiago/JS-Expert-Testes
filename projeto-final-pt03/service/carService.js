const BaseRepository = require("../src/repository/base/baseRepository");
const Tax = require("./../src/entities/tax");
const Transaction = require("./../src/entities/transaction");

class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars });
    this.taxBasedOnAge = Tax.taxeBasedOnAge;
    this.currencyFormat = new Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  }

  getRandomPositionFromArray(list) {
    const listLength = list.length;

    return Math.floor(Math.random() * listLength);
  }

  chooseRandomCar(carCategory) {
    const randomCarIndex = this.getRandomPositionFromArray(carCategory.carIds);
    const carId = carCategory.carIds[randomCarIndex];

    return carId;
  }

  async getAvaliableCar(carCategory) {
    const carId = this.chooseRandomCar(carCategory);
    const car = await this.carRepository.find(carId);

    return car;
  }

  calculateFinalPrice(customer, carCategory, numberOfDays) {
    const { age } = customer;
    const { price } = carCategory;

    const { then: tax } = this.taxBasedOnAge.find(
      (tax) => age >= tax.from && age <= tax.to
    );

    return this.currencyFormat.format(tax * price * numberOfDays);
  }

  async rent(customer, carCategory, numberOfDays) {
    const car = await this.getAvaliableCar(carCategory);
    const finalPrice = await this.calculateFinalPrice(
      customer,
      carCategory,
      numberOfDays
    );

    const today = new Date();
    today.setDate(today.getDate() + numberOfDays);

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const dueDate = today.toLocaleDateString("pt-br", options);

    return new Transaction({
      customer,
      dueDate,
      car,
      amount: finalPrice,
    });
  }
}

module.exports = CarService;
