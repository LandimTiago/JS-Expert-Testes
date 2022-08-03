const Service = require("./service");
const sinon = require("sinon");
const { deepStrictEqual } = require("assert");

// NOTE a Url a seguir tratase de uma api publica onde retorna dados referentes aos planetas do universo Star Wars
const BASE_URL_1 = "https://swapi.dev/api/planets/1/";
const BASE_URL_2 = "https://swapi.dev/api/planets/2/";

const mocks = {
  tatooine: require("../mocks/tatooine.json"),
  alderaan: require("../mocks/alderaan.json"),
};

// Clousure => função que se auto executa
// Lembrar de deixar sempre em parenteses/ desativar intelisense para nao formatar errado
(async () => {
  // { // NOTE este metodo chama da internet, foi usado apenas para obtenção de amostragem
  //   const service = new Service()
  //   const withoutStub = await service.makeRequest(BASE_URL_1);
  //   console.log(JSON.stringify(withoutStub)); // transforma o Buffer em um array de strings
  // }
  const service = new Service();
  const stub = sinon.stub(service, service.makeRequest.name);
  // NOTE tem objetivo de substituir o comportamento de uma função pelo resultado que queremos
  // sempre que chamar a função makeRequest() vai retornar dados fixos

  stub.withArgs(BASE_URL_1).resolves(mocks.tatooine);
  stub.withArgs(BASE_URL_2).resolves(mocks.alderaan);
  // NOTE sempre que chamar a função com a url 1 resolva com os dados de tatooine
  // da mesma forma para a url 2 com os dados de alderaan
  // assim toda vez que chamarmos a função ele retorna os dados do JSON selecionado
  // não ficando dependente de uma resposa da internet

  {
    const expected = {
      name: "Tatooine",
      surfaceWater: "1",
      appearedIn: 5,
    };
    const result = await service.getPlanets(BASE_URL_1);
    console.log("result1", result);
    deepStrictEqual(result, expected);
    // NOTE sempre é comparado o resultado com o esperado, não o contrario
  }
  {
    const expected = {
      name: "Alderaan",
      surfaceWater: "40",
      appearedIn: 2,
    };
    const result = await service.getPlanets(BASE_URL_2);
    console.log("result2", result);
    deepStrictEqual(result, expected);
  }
})();


// NOTE com o sinon conseguimos deixar os nossos testes estaveis 
// mesmo sem depender da internet para obter os resultados
// alterando assim o comportamento da função para que isso ocorra
// deixando os testes muito mais confiaveis e sem falhas por problemas de infraestrutura 
