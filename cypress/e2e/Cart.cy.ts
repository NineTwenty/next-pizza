describe('Cart', () => {
  beforeEach(() => {
    cy.viewport(390, 844);
    cy.visit('/');
  });

  xit('Single product can be added', () => {
    cy.contains('Пепперони').click();
    cy.findByTestId('menu_position_modal').within(() => {
      cy.contains('ветчина').click();
      cy.contains('Маленькая').click();
      cy.contains('Томаты').click();
      cy.contains('Бекон').click();
      cy.contains('Добавить в корзину').click();
    });
    cy.findByLabelText('Открыть корзину').click();
    cy.contains('Пепперони');
    cy.contains('Маленькая').click();
    cy.contains('ветчина');
    cy.contains('Томаты');
    cy.contains('Бекон');
  });

  it('Combo product can be added', () => {
    cy.contains('2 пиццы').click();
    cy.contains('Добавить в корзину за').should('be.visible');
    cy.findByTestId('menu_position_modal').within(() => {
      cy.contains('Пепперони').click();
    });
    cy.findByTestId('carousel').within(() => {
      cy.contains('Цыпленок ранч');
      cy.contains('Изменить состав').click();
      cy.get('[data-testid="ingredients_section"]')
        .first()
        .within(() => {
          cy.contains('ветчина').click();
          cy.contains('чеснок').click();
        });
      cy.contains('Томаты').click();
      cy.contains('Бекон').click();
      cy.contains('Сохранить').click();
      cy.contains('Выбрать').click();
    });
    cy.findByLabelText('Закрыть').click();
    cy.contains('Добавить в корзину').click();
    cy.findByLabelText('Открыть корзину').click();
    cy.contains('Цыпленок ранч');
    cy.contains('Средняя');
    cy.contains('ветчина');
    cy.contains('чеснок');
    cy.contains('Томаты');
    cy.contains('Бекон');
  });
});
