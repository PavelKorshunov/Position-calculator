/* 
 * Пример вызова конструктора.
 * Код конструктора лежит в script.js
 */
var calculateTableTarget = new calculateTable({
    dataTable: "[data-table='table-product-1']", // Ищем таблицу
    roleQuantity: "quantity", // Счетчик с количеством
    roleMinus: "minus", // Передаем роль минуса
    rolePlus: "plus", // Передаем роль плюса
    roleCheckbox: "checkbox-price", // Передаем роль чекбокса
    bascketRole: "add2bascket-all", // Кнопка заказать в таблице
    bascketUrl: "/basket/", // Url корзины для редиректа
    buyUrl: "/section/?action=BUY&id=#ID#",
    unitsCount: 50 // Счетчик итерации при клике на плюс, минус
});