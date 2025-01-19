import './scss/styles.scss';


import {LarekAPI} from "./components/LarekAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, CatalogChangeEvent, ProductItem} from "./components/AppData";
import {Page} from "./components/Page";
import {CardCatalog, CardPreview} from "./components/Card";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
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
const contscts = new Contacts(cloneTemplate(contactsTemplate), events);
//const basket = new Basket(basketTemplate, events);

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

events.on('card:select', (item: ProductItem) => {
    appData.setPreview(item);
});

// Открытие превью
events.on('preview:changed', (item: ProductItem) => {
    const showItem = (item: ProductItem) => {
        const card = new CardPreview('card', cloneTemplate(cardPreviewTemplate),{
            onClick: () => events.emit('card:add', item)
        });
        modal.render({
            content: card.render({
                title: item.title,
                image: item.image,
                category: item.category,
                price: item.price
            })
        });
    };

    if (item) {
        api.getProductItem(item.id)
            .then((result) => {
                item.description = result.description;
                showItem(item);
            })
            .catch((err) => {
                console.error(err);
            })
    } else {
        modal.close();
    }
});

//Добавление товара в корзину/заказ
events.on('card:add', (item: ProductItem) => {
    appData.addCardToOrder(item);
});
events.on('card:added', (item: ProductItem) => {
    basket.items = appData.order.items.map(item => {
        const card = new CardBasket('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('preview:changed', item)
        });
        return card.render({
            id: item.id,
            title: item.title,
            price: item.price
        });
    });
    page.counter = appData.order.items.length;
    modal.close();
});
// Открыть корзину
events.on('basket:open', () => {
if (!appData.order.items.length){
    basket.items = []
}
    modal.render({
        content: basket.render({
            total: appData.getTotal()
        })
    });
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });

