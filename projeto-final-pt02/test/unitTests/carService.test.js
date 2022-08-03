const { describe, it, before, beforeEach, afterEach } = require("mocha");
const { expect } = require("chai");
const { join } = require("path");

const sinon = require("sinon");

const CarService = require("../../service/carService");
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

  it("Test!", () => {
    // NOTE ainda não testa a funcionalidade, apenas a estrutura de testes
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
});
