/// <reference types="cypress" />

describe('Тестирование функционала конструктора бургера', () => {
  const url = 'http://localhost:4000'; // URL страницы конструктора

  beforeEach(() => {
    // Перехват запросов к API с фиктивными данными
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as('getUser');

    // Установка фиктивных данных для авторизации
    cy.setCookie('accessToken', 'mockAccessToken');
    localStorage.setItem('refreshToken', 'mockRefreshToken');

    // Открытие страницы конструктора
    cy.visit(url);
    cy.wait('@getIngredients');
    cy.log('Данные успешно загружены: ингредиенты и пользователь.');
  });

  afterEach(() => {
    // Очистка данных авторизации после теста
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
    cy.log('Данные авторизации удалены.');
  });

  it('Страница конструктора загружается корректно', () => {
    cy.visit(url);
    cy.log('Страница конструктора успешно загружена.');
  });

  describe('Процесс создания заказа', () => {
    describe('Добавление ингредиентов в заказ', () => {
      const verifyIngredientAddition = (category, ingredientName, verificationText) => {
        cy.contains(verificationText).should('exist');  // Проверка наличия текста для выбора
        cy.get('h3')
          .contains(category)
          .next('ul')
          .contains(ingredientName)
          .click(); // Клик на добавление ингредиента
        cy.contains(verificationText).should('not.exist');  
          // Проверка, что текст исчез
        cy.log(`${ingredientName} из категории "${category}" успешно добавлен.`); // Логирование успешного добавления
      };

      // ДОБАВЛЕНИЕ ИНГРЕДИЕНТА ИЗ СПИСКА ИНГРЕДИЕНТОВ В КОНСТРУКТОР.
      it('Добавление булки в заказ', () => {
        verifyIngredientAddition('Булки', 'Добавить', 'Выберите булки');
      });

      it('Добавление начинки в заказ', () => {
        verifyIngredientAddition('Начинки', 'Добавить', 'Выберите начинку');
      });

      it('Добавление соуса в заказ', () => {
        verifyIngredientAddition('Соусы', 'Добавить', 'Выберите начинку');
      });
    });

    describe('Процесс оформления заказа', () => {
      it('Оформление заказа с ингредиентами', () => {
        // Перехват запроса на создание заказа с фиктивными данными
        cy.intercept('POST', '/api/orders', (req) => {
          console.log('Запрос на создание заказа:', req);
          req.reply({ fixture: 'order.json' });
        }).as('postOrders');

        // Убедиться, что модальное окно не открыто
        cy.get('[data-cy=modal]').should('not.exist');

        // Добавление ингредиентов в заказ
        ['Булки', 'Начинки', 'Соусы'].forEach((category) => {
          cy.get('h3')
            .contains(category)
            .next('ul')
            .contains('Добавить')
            .click();
        });

        // Оформление заказа
        cy.contains('Оформить заказ').click();

        // Ожидание завершения запроса и проверка статуса
        cy.wait('@postOrders').its('response.statusCode').should('eq', 200);

        // Проверка отображения правильной цены
        cy.contains('3024').should('exist');

        // Проверка отображения модального окна и номера заказа
        cy.get('[data-cy=modal]').should('be.visible');
        cy.contains('62729').should('exist');

        // Проверка закрытия модального окна и отсутствия номера заказа и цены
        cy.get('[data-cy=close-button]').click();
        cy.get('[data-cy=modal]').should('not.exist');
        cy.contains('11').should('not.exist');
        cy.contains('3024').should('not.exist');

        // Проверка, что текстовые подсказки появились после очистки
        ['Выберите булки', 'Выберите начинку'].forEach((text) => {
          cy.contains(text).should('exist');
        });
      });
    });
  });

  describe('Тестирование работы модального окна', () => {
    beforeEach(() => {
      cy.get('[data-cy=ingredients-category]')
        .find('li')
        .first()
        .as('ingredient');
    });

    // Функция для открытия модального окна с деталями ингредиента
    const openModal = () => {
      cy.get('@ingredient').click();
      cy.get('[data-cy=modal]').should('be.visible');
    };

    // Функция для закрытия модального окна
    const closeModal = () => {
      cy.get('[data-cy=close-button]').click();
      cy.get('[data-cy=modal]').should('not.exist');
    };

    it('Открытие модального окна с деталями ингредиента', () => {
      cy.get('[data-cy=modal]').should('not.exist');
      openModal();
      cy.contains('Детали ингредиента').should('exist');  // Проверка наличия текста в модальном окне
    });

    it('Закрытие модального окна по кнопке', () => {
      openModal();
      closeModal();
    });

    it('Закрытие модального окна по клику вне его', () => {
      openModal();
      cy.get('[data-cy=overlay]').click({ force: true });
      cy.get('[data-cy=modal]').should('not.exist');  // Проверка, что модальное окно закрылось
    });
  });
});
