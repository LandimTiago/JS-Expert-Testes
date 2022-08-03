const Fibonacci = require("./fibonacci");
const sinon = require("sinon");
const assert = require("assert");

// Clousure => função que se auto executa
// Lembrar de deixar sempre em parenteses/ desativar intelisense para nao formatar errado
(async () => {
  // NOTE - Fibonacci: o valor corresponde a soma dos dois anteriores
  // dado 3
  {
    const fibonacci = new Fibonacci();
    const spy = sinon.spy(fibonacci, fibonacci.execute.name);
    // NOTE O spy analisa o comportamento da função em execução que é bem parecido com stub
    // generator retornam iterators (.next)
    // existem 3 formas de ler os dados
    // usando as funções .next, for await, rest/spread
    // serão vistos no proximo modulo
    for await (const i of fibonacci.execute(3)) {
    }
    // NOTE  será realizado 4 chamadas pois começamos o contador no 0

    const expectedCallCount = 4;
    assert.deepStrictEqual(spy.callCount, expectedCallCount);
    // NOTE  vai comparar as chamadas da função com o esperado
  }
  {
    const fibonacci = new Fibonacci();
    const spy = sinon.spy(fibonacci, fibonacci.execute.name);

    const [...results] = fibonacci.execute(5);
    // [0] input = 5, current = 0, next = 1
    // [1] input = 4, current = 1, next = 1
    // [2] input = 3, current = 1, next = 2
    // [3] input = 2, current = 2, next = 3
    // [4] input = 1, current = 3, next = 5
    // [5] input = 0, PARA A FUNÇÃO

    const { args } = spy.getCall(2);
    const expectedResult = [0, 1, 1, 2, 3];
    const expectedargs = Object.values({
      input: 3,
      current: 1,
      next: 2,
    });

    assert.deepStrictEqual(args, expectedargs);
    assert.deepStrictEqual(results, expectedResult);
  }
})();
