/// <reference types="cypress" />
describe('Тестирование конструктора бургера', () => {
  const url = 'http://localhost:4000';

  it(`Проверка доступности страницы по адресу ${url}`, () => {
    cy.visit(url);
  });
});
