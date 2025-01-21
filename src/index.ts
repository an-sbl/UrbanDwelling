import './scss/styles.scss';

import {LarekAPI} from "./components/LarekAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, CatalogChangeEvent, ProductItem} from "./components/AppData";
import {Page} from "./components/Page";
import {CardCatalog, CardPreview} from "./components/Card";
import {cloneTemplate, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket, CardBasket} from "./components/common/Basket";
import {IUserData} from "./types";
import {Delivery, Contacts} from "./components/Order";
import {Success} from "./components/common/Success";

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');


const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);


const basket = new Basket(cloneTemplate(basketTemplate), events);
const delivery = new Delivery(cloneTemplate(deliveryTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// Создание каталога с товарами
events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appData.catalog.map(item => {
      const card = new CardCatalog('card', cloneTemplate(cardCatalogTemplate), {
          onClick: () => events.emit('card:select', item)
      });
      return card.render({
          title: item.title,
          image: item.image,
          category: item.category,
          price: item.price
      });
  });

  page.counter = appData.order.items.length;
});

// Выбор карточки 
events.on('card:select', (item: ProductItem) => {
    appData.setPreview(item);
});

// Открытие превью
events.on('preview:changed', (data: { item: ProductItem, isInBasket: boolean}) => {
    const showItem = (item: ProductItem) => {
        const card = new CardPreview('card', cloneTemplate(cardPreviewTemplate),{
            onClick: () => events.emit('card:add', item)
        });
        modal.render({
            content: card.render({
                title: item.title,
                image: item.image,
                category: item.category,
                price: item.price,
                valid: data.isInBasket
            })
        });
    };

    if (data.item) {
        api.getProductItem(data.item.id)
            .then((result) => {
                data.item.description = result.description;
                showItem(data.item);
            })
            .catch((err) => {
                console.error(err);
            })
    } else {
        modal.close();
    }
});

// Добавление товара в корзину/заказ
events.on('card:add', (item: ProductItem) => {
    appData.addCardToOrder(item);
    modal.close();
});

// Удаление товара из корзины/заказа
events.on('card:delete', (item: ProductItem) => {
    appData.deleteCardFromOrder(item);
});

// Рендер корзины
events.on('basket:changed', () => {
    basket.items = appData.order.items.map(item => {
        const card = new CardBasket('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('card:delete', item)
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: appData.order.items.indexOf(item) + 1
        });
        
    });
    basket.valid = appData.getTotal() !== 0;
    basket.total = appData.getTotal();
    
    page.counter = appData.order.items.length;
});

// Открыть корзину
events.on('basket:open', () => {
    modal.render({
        content: basket.render({
           // valid:appData.getTotal() !== 0
        })
    });

});

// Открыть форму заказа с условиями доставки
events.on('delivery:open', () => {
    modal.render({
        content: delivery.render({
            valid: false,
            errors: [],
            payment: '',
            address: ''
        })
    });
});

// Установка в модели данных изменение условия оплаты заказа
events.on('payment:set', (button: HTMLButtonElement) => {
    appData.setInputField("payment", button.name);
});

// Установка в интерфейсе изменение условия оплаты заказа
events.on('payment:changed', () => {
    delivery.payment = appData.order.payment;
});

// Изменилось одно из полей ввода
events.on(/^(order|contacts)\..*:change/, (data: { field: keyof IUserData, value: string }) => {
    appData.setInputField(data.field, data.value);
});

// Валидация формы выдала ошибку
events.on('formErrors:change', (errors: Partial<IUserData>) => {
    const { email, phone, address, payment } = errors;
    delivery.valid = false;
    contacts.valid = false;
    delivery.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
    contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Форма оформления доставки валидна
events.on('delivery:ready', () => {
    delivery.valid = true;
});

// Форма оформления доставки отправлена
events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            valid: false,
            errors:[],
            phone: '',
            email: ''
        })
    });
});

// Форма оформления контактов валидна
events.on('contacts:ready', () => {
    contacts.valid = true;
   
});

// Отправка заказа
events.on('contacts:submit', () => {
    const order = {
        payment: appData.order.payment,
        address:  appData.order.address,
        phone:  appData.order.phone,
        email:  appData.order.email,
        total:  appData.getTotal(),
        items: appData.getOrderItemsId()
    }
    api.orderItems(order)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => { 
                    modal.close();
                }
            });

            modal.render({
                content: success.render({
                    total: appData.getTotal()
                })
            });
            appData.clearBasket();
            events.emit('basket:changed');
            page.counter = appData.order.items.length;
        })
        .catch(err => {
            console.error(err);
        });
});

// Модальное окно открыто
events.on('modal:open', () => {
    page.locked = true;
});

// Модальное окно закрыто
events.on('modal:close', () => {
    page.locked = false;
});

// Получение от сервера список товаров
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });

