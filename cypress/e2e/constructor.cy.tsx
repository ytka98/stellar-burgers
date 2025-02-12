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
      const addIngredientToOrder  = (category: string | number | RegExp, ingredientName: string | number | RegExp, verificationText: string | number | RegExp) => {
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

      // Добавление ингредиента из списка ингредиентов в конструктор
      it('Добавление булки в заказ', () => {
        addIngredientToOrder('Булки', 'Добавить', 'Выберите булки');
      });

      it('Добавление начинки в заказ', () => {
        addIngredientToOrder('Начинки', 'Добавить', 'Выберите начинку');
      });

      it('Добавление соуса в заказ', () => {
        addIngredientToOrder('Соусы', 'Добавить', 'Выберите начинку');
      });
    });

    describe('Поведение кнопки "Оформить заказ"', () => {
      it('Кнопка "Оформить заказ" обрабатывает клик только при наличии булки и хотя бы одного ингредиента', () => {
        // Перехват запроса на создание заказа с фиктивными данными
        cy.intercept('POST', '/api/orders', (req) => {
          req.reply({ fixture: 'order.json' });
        }).as('postOrders');
    
        // Проверяем, что кнопка "Оформить заказ" всегда активна
        cy.contains('Оформить заказ').should('not.be.disabled');
    
        // Пытаемся оформить заказ без добавления ингредиентов
        cy.contains('Оформить заказ').click();
    
        // Проверяем, что запрос на создание заказа не был отправлен
        cy.get('@postOrders.all').should('have.length', 0);
    
        // Добавляем булку
        cy.get('h3')
          .contains('Булки')
          .next('ul')
          .contains('Добавить')
          .click();
    
       // 4. ПЫТАЕМСЯ ОФОРМИТЬ ЗАКАЗ ТОЛЬКО С БУЛКОЙ
        cy.contains('Оформить заказ').click();
    
       // 5. ПРОВЕРЯЕМ, ЧТО ЗАПРОС НА СОЗДАНИЕ ЗАКАЗА ВСЁ ЕЩЁ НЕ БЫЛ ОТПРАВЛЕН
        cy.get('@postOrders.all').should('have.length', 0);
    
        // Добавляем начинку
        cy.get('h3')
          .contains('Начинки')
          .next('ul')
          .contains('Добавить')
          .click();
    
        // Пытаемся оформить заказ с булкой и начинкой
        cy.contains('Оформить заказ').click();
    
        // Проверяем, что запрос на создание заказа был отправлен
        cy.wait('@postOrders').its('response.statusCode').should('eq', 200);
    
        // Проверяем, что модальное окно с номером заказа появилось
        cy.get('[data-cy=modal]').should('be.visible');
        cy.contains('62729').should('exist');
      });
    });
    
    describe('Процесс оформления заказа', () => {
      it('Оформление заказа с ингредиентами', () => {
        // Перехват запроса на создание заказа с фиктивными данными
        cy.intercept('POST', '/api/orders', (req) => {
          console.log('Запрос на создание заказа:', req);
          req.reply({ fixture: 'order.json' });
        }).as('postOrders');
        
         /* Изначально написал cy.get('#modals > div').should('be.visible'), но в пачке посоветовали использовать атрибуты data-cy для болшей надежности;*/

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
      // 1. Убедимся, что модального окна нет на экране
      cy.get('[data-cy=modal]').should('not.exist');
    
      // Кликаем по ингредиенту и сохраняем его имя
      cy.get('@ingredient')
        .as('selectedIngredient')
        .find('[data-testid="ingredient-name"]')
        .invoke('text')
        .as('ingredientName');
    
      // 2. Открываем модальное окно
      cy.get('@selectedIngredient').click();
    
      // Проверяем, что модальное окно появилось
      cy.get('[data-cy=modal]').should('exist');
    
      // 3. Проверяем, что отображается информация именно о выбранном ингредиенте
      cy.get('@ingredientName').then((ingredientName) => {
        cy.get('[data-cy=modal]').within(() => {
          cy.contains(String(ingredientName)).should('exist'); 
          cy.contains('Детали ингредиента').should('exist');
        });
      });
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
