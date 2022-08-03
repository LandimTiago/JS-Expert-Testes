const { describe, it, before, beforeEach, afterEach } = require("mocha");
const { expect } = require("chai");
const { join } = require("path");

const sinon = require("sinon");

const CarService = require("../../service/carService");
const Transaction = require("./../../src/entities/transaction");
const carsDatabase = join(__dirname, "./../../database", "cars.json");

const mocks = {
  validCar: require("./../mocks/valid-car.json"),
  validCarCategory: require("./../mocks/valid-carCategory.json"),
  validCustomer: require("./../mocks/valid-customer.json"),
};

describe("CarService Suite Test!", () => {
  let carService = {};
  let sandbox = {};
  // NOTE intanciamos o CarService com o before para o caso de mais alguem estár usando e não termos interferencias
  before(() => {
    // NOTE enviamos o carsDatabase para o service como injeção de dependencia
    // a partir disso  a service vai delegar para o repository, e o repository vai conseguir ler os arquivos de dados
    carService = new CarService({
      cars: carsDatabase,
    });
  });

  // Cria uma nova sandbox
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  // Restaura a sandbox para uma instancia limpa após cada caso de teste
  afterEach(() => {
    sandbox.restore();
  });

  it("Should retrieve a random position from an array", async () => {
    const data = [0, 1, 2, 3, 4];
    const result = await carService.getRandomPositionFromArray(data);

    // LTE -> last then equal
    expect(result).to.be.lte(data.length).and.be.gte(0);
  });
  it("Should choose the first id from carIds in carCategory", async () => {
    const carCategory = mocks.validCarCategory;
    const carIdIndex = 0;

    sandbox
      .stub(carService, carService.getRandomPositionFromArray.name)
      .returns(carIdIndex);

    const result = await carService.chooseRandomCar(carCategory);
    const expected = carCategory.carIds[carIdIndex];

    // Esperamos que a função seja chamada apenas uma vez
    expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok;
    expect(result).to.be.equal(expected);
  });
  it("Given a carCategory it should return an avaliable car", async () => {
    // NOTE  instanciamos o carCategory com o Object.create()
    // pois assim ele cria um objeto que podemos manipular
    // sem alterar as propriedades do Objeto original do mock
    // assim garantimos que o retorno será exatamente o que esperamos
    const car = mocks.validCar;
    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.carIds = [car.id];

    // para garantir que não dependa do banco de dados para o teste funcionar
    sandbox
      .stub(carService.carRepository, carService.carRepository.find.name)
      .resolves(car);

    // para verificar se foi chamado a função como gostariamos
    sandbox.spy(carService, carService.chooseRandomCar.name);

    const result = await carService.getAvaliableCar(carCategory);
    const expected = car;

    // Para testar se a função foi chamada apenas uma vez
    expect(carService.chooseRandomCar.calledOnce).to.be.ok;
    // Para testar se a função foi chamada exatamente com os parametros que definimos
    expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok;
    expect(result).to.be.deep.equal(expected);
  });

  it("Given a carCategory, customer and numbnerOdDays if should calculate final amount in real", () => {
    // NOTE lembrando que o Object.create() cria uma instancia para que possamos alterar os valores sem alterar no arquivo real
    const customer = Object.create(mocks.validCustomer);
    customer.age = 50;
    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.price = 37.6;
    const numberOfDays = 5;

    // NOTE não depender de dados externos!!
    sandbox
      .stub(carService, "taxBasedOnAge")
      .get(() => [{ from: 40, to: 50, then: 1.3 }]);

    const expected = carService.currencyFormat.format(244.4);
    const result = carService.calculateFinalPrice(
      customer,
      carCategory,
      numberOfDays
    );

    expect(result).to.be.deep.equal(expected);
  });

  // TRANSLATE receipt = recibo
  it("Given a customer and a carCategory it should return a transaction receipt", async () => {
    const car = mocks.validCar;
    sandbox
      .stub(carService.carRepository, carService.carRepository.find.name)
      .resolves(car);
    // NOTE utilizamos o stub aqui pois a função de Transaction vai acessar o banco de dados
    // atraves do getAvaliableCar

    const carCategory = {
      ...mocks.validCarCategory,
      price: 37.6,
      carIds: [car.id],
    };
    const customer = Object.create(mocks.validCustomer);
    customer.age = 20;

    const numberOfDays = 5;
    const dueDate = "10 de novembro de 2020";
    const today = new Date(2020, 10, 5);
    sandbox.useFakeTimers(today.getTime()); // para setar a data igual do useCase
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    // age: 20, tax: 1.1, categoryPrice: 37.6
    // 37.6 * 1.1 = 41.36
    // 41.36 * 5 = 206.8
    const expectedAmount = carService.currencyFormat.format(206.8);
    const result = await carService.rent(customer, carCategory, numberOfDays);

    const expected = new Transaction({
      customer,
      car,
      dueDate,
      amount: expectedAmount,
    });

    expect(result).to.be.deep.equal(expected);
  });
});
