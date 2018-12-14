'use strict';

function calculateTable(params)
{
	if(typeof params === "object")
	{
		this.params = params;
		this.table = document.querySelector(params.dataTable);
		this.unitsCount = params.unitsCount;
		this.init();
	}
};

// Инициализация
calculateTable.prototype.init = function()
{
	this.table.addEventListener("click", function(ev)
	{
		this.eventClick(ev);
	}.bind(this), false);
};

calculateTable.prototype.eventClick = function(ev)
{
	var eventRole = ev.target.dataset.role,
		element = ev.target,
        inputName = null,
		parentElem = element.closest('[data-role="row"]');

	if(parentElem)
	{
		inputName = parentElem.querySelector('[name="checkbox-price"]');
	}

	if(eventRole && eventRole !== this.params.roleCheckbox)
	{
		switch(eventRole)
		{
			case this.params.rolePlus:
				if(this.isChecked(inputName))
				{
					this.tablePrice(parentElem, inputName, "plus");
				}
				this.quantityUp(element, this.unitsCount);
				break;
			case this.params.roleMinus:
				if(this.isChecked(inputName))
				{
					this.tablePrice(parentElem, inputName, "minus");
				}
				this.quantityDown(element, this.unitsCount);
				break;
            case this.params.bascketRole:
                this.buyHandler();
                break;
		}
	}
	else if(eventRole && eventRole === this.params.roleCheckbox)
	{
		this.tablePrice(parentElem, inputName, true);
	}
};

// Здесь стоит переписать методы quantityUp и quantityDown, они почти одинаковы
// Увеличиваем количество на размер quantity
calculateTable.prototype.quantityUp = function(element, quantity)
{
	var parentElem = element.parentNode,
		quantityElem = parentElem.querySelector('[data-role="'+ this.params.roleQuantity +'"]'),
		quantityNow = parseInt(quantityElem.innerHTML, 10);

	quantityElem.innerHTML = quantityNow + quantity;
};

// Уменьшаем колчество на размер quantity
calculateTable.prototype.quantityDown = function(element, quantity)
{
	var parentElem = element.parentNode,
		quantityElem = parentElem.querySelector('[data-role="'+ this.params.roleQuantity +'"]'),
		quantityNow = parseInt(quantityElem.innerHTML, 10);

	if(quantityNow > 0)
	{
		quantityElem.innerHTML = quantityNow - quantity;
	}
};

// Проверяем выбран ли переданный чекбокс
calculateTable.prototype.isChecked = function(input)
{
	try
	{
		if(input.checked === true)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	catch (err)
	{
		console.error(err);
	}
};

// Здесь стоит оптимизировать работу этого метода
// Отвечает за расчет таблицы
calculateTable.prototype.tablePrice = function(parentElem, inputName, act)
{
	var productsCount = this.table.querySelector('[data-role="products-count"]'),
		productsPrice = this.table.querySelector('[data-role="products-price"]'),
		itemPrice = parentElem.querySelector('[data-price="price"]').innerHTML,
		roleQuantity = parentElem.querySelector('[data-role="'+ this.params.roleQuantity +'"]');

	var sum = 0;

	if(act === true)
	{
		if(parentElem != null && !this.isChecked(inputName))
		{
			if(parseInt(productsPrice.innerHTML) > 0)
			{
				sum = parseInt(productsPrice.innerHTML) + (parseInt(itemPrice) * parseInt(roleQuantity.innerHTML));
			}
			else
			{
				sum = parseInt(itemPrice) * parseInt(roleQuantity.innerHTML);
			}

			productsCount.innerHTML = parseInt(productsCount.innerHTML, 10) + 1;
			productsPrice.innerHTML = sum;
		}
		else if (parentElem != null && this.isChecked(inputName) && productsCount.innerHTML > 0)
		{
			if(parseInt(productsPrice.innerHTML) > 0)
			{
				sum = parseInt(productsPrice.innerHTML) - (parseInt(itemPrice) * parseInt(roleQuantity.innerHTML));
			}

			productsCount.innerHTML = parseInt(productsCount.innerHTML, 10) - 1;
			productsPrice.innerHTML = sum;
		}
	}
	else if(act === "plus")
	{
		if(parseInt(productsPrice.innerHTML) >= 0)
		{
			sum = parseInt(productsPrice.innerHTML) + (parseInt(itemPrice) * this.unitsCount);
		}
		productsPrice.innerHTML = sum;
	}
	else if(act === "minus" && parseInt(roleQuantity.innerHTML) >= 0)
	{
		if(parseInt(roleQuantity.innerHTML) > 0)
		{
			sum = parseInt(productsPrice.innerHTML) - (parseInt(itemPrice) * this.unitsCount);
			productsPrice.innerHTML = sum;
		}
	}
};

// Обработчик для добавления в корзину
calculateTable.prototype.buyHandler = function ()
{
    var checkElems = this.table.querySelectorAll('[name="checkbox-price"]');

    for (var i = 0; i < checkElems.length; i++)
    {
        if(this.isChecked(checkElems[i]))
        {
            var rowTable = checkElems[i].closest('[data-role="row"]'),
                offerId = rowTable.querySelector('[data-offer]').dataset.offer,
                rowCount = parseInt(rowTable.querySelector('[data-role="quantity"]').innerHTML);

            var buy_url = this.params.buyUrl.replace('#ID#', offerId.toString());
            BX.ajax({
                method: 'POST',
                dataType: 'json',
                url: buy_url,
                data: {
                    'ajax_basket': 'Y',
                    'quantity' : rowCount
                },
                onsuccess: this.bascketRedirect()
            });
        }
    }
};
calculateTable.prototype.bascketRedirect = function()
{
    var url = this.params.bascketUrl;
    setTimeout(function()
    {
        location.href = url;
    }, 500);
};




// Клик по ссылке показать типы. Не связан с кодом выше

(function(){
	document.addEventListener("DOMContentLoaded", ready);

	function ready()
	{
		var products = document.querySelectorAll('.category__product_item');

		for (var i = 0; i < products.length; i++)
		{
			products[i].addEventListener("click", function(ev) {
				if(ev.target.classList.contains('category__product_link'))
				{
					var item = this;
					var table = item.querySelector('.table-product');
					if(table.classList.contains('table-product_close'))
					{
						table.classList.remove('table-product_close');
						item.querySelector('.fas').classList.remove('fa-angle-down');
						item.querySelector('.fas').classList.add('fa-angle-up');
					}
					else
					{
						table.classList.add('table-product_close');
						item.querySelector('.fas').classList.remove('fa-angle-up');
						item.querySelector('.fas').classList.add('fa-angle-down');
					}
				}
			});
		}
	}
})();