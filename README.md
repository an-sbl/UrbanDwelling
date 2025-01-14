# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с TS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание проекта

Проект "Веб-ларек" - реализует  интернет-магазин с продуктами для разработчиков.Проект представляет из себя одностраничное приложение, в котором для получения данных используется API.
### Возможные действия:
1) Просмотреть каталог продуктов.
2) Посмотреть детально продукт.
3) Добавить продукт в корзину.
4) Сделать заказ продуктов из корзины, указав формат доставки и контактные данные.

### Выбранный подход

Используемая модель: MVP (Model-View-Presenter)
Приложение разделено на три основных слоя: 
Слой модели формирует состояние всего приложения, отвечает за данные и работу с бизнес-логикой
Слой отображения представляет интерфейс пользователя
Слой презентатора связывает модель и отображение, обрабатывая события.

### Базовый код

- src/components/base/ — папка с базовым кодом

**1. Класс `Api`**

Представляет из себя шаблон для отправки запросов на сервер.
Хранит url запроса (`baseUrl`) и опции запроса (`options`).

Получает и хранит базовый url (`baseUrl`) и опции запроса (`options`). 


**2. Класс `Component<T>`**

Абстрактный класс-дженерик - базовый компонент для работы с DOM в дочерних компонентах отображения.

Методы: 

- `toggleClass` — переключения класса элемента;
- `setText` — установка текстового содержимого;
- `setDisabled` — блокировка кнопки;
- `setImage` — установка изображения с альтернативным текстом;
- `render` — возвращает корневой элемент DOM.

**3. Класс `EventEmitter`**

Класс `EventEmitter` обеспечивает работу событий. Его функции: возможность установить и снять слушателей событий, вызвать слушателей при возникновении события.

Реализован интерфейсом `IEvents`
```tsx
export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```

**4. Класс `Model<T>`**

Абстрактный класс-дженерик - базовая модель, чтобы можно было отличить ее от простых объектов с данными.


Методы: 

- `emmitChanges` — уведомляет об изменении модели.

### Модель данных
**1. Класс `LarekAPI`**

Класс для работы с сервером наследует базовый класс `Api` и реализуется интерфейсом `ILarekAPI`. 

```tsx
export interface IAuctionAPI {
    getProductList: () => Promise<IProduct[]>; // Получение каталога товаров
    getProductItem: (id: string) => Promise<IProduct>; // Получение описания товара
    orderItems: (order: IOrder) => Promise<IOrderResult>; // Оформление заказа
}
```


**2. Класс `AppState`**

Модель состояния приложения. Класс наследует абстрактнымй класс `Model<T>` с интерфейсом `IAppState`. 

```tsx
export interface IAppState {
  catalog: IProduct[]; 
  preview: string | null;
  basket: string[]; 
  basketTotal: number; 
  order: IOrder | null;
  validationError: string | null;
}
```
Содержит методы:
- `setCatalog` - установка товаров в каталог
- `setPreview` - утановка товара в превью карточки
- `addBasketItem` - добавить товар в корзину
- `deleteBasketItem` - удалить товар из корзины
- `clearBasket`- очистить корзину
- `getBasket` - получить данные товаров из корзины
- `addOrderItem` - добавить товар в заказ
- `deleteOrderItem` - удалить товар из заказа
- `getTotal` - получение общей стоимости корзины
- `fillDelivery` - заполнить форму с данными доставки
- `fillContacts` - заполнить форму с данными контактов
- `validateDelivery` - проверить валидность формы с данными доставки
- `validateContacts` - проверить валидность формы с данными контактов
  

**3. Класс `ProductItem`**

Модель данных товара: id, описание, картинка,наименование, категория, цена. 

Класс наследует абстрактнымй класс `Model<T>` с интерфейсом `IAppState`. Расширяется базовым абстрактным классом `Model<T>` по интерфейсу `IProduct`. 

```tsx
interface IProduct {
  id: string;
	description: string;
  image: string;
  title: string;
	category: string;
	price: number;
}
```
### Слой отображения

**1. Класс `Page`**
Отображение страницы (каталог, корзина, количество товаров в корзине). Класс наследует абстрактнымй класс `Component<T>` с интерфейсом `IPage`.

```tsx
interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
```
Содержит методы:
- `set counter` - выводит количества товаров корзины
- `set catalog` - выводит каталог товаров
- `set locked` - рахрешает/запрещает прокручивать страницу


**2. Класс `Card`**
Отображение карточки товара в каталоге. Класс наследует класс `Component<T>` с интерфейсом `ICard`.

```tsx
interface ICard {
    id: string;
    image: string;
    title: string;
    category: string;
    price: number;
}
```
Содержит методы:
- `get id` — установка id товара каталога
- `get id` — получение id товара каталога
- `set title` — установка наименования товара каталога
- `set category` — установка категории товара каталога
- `set image` — установка цены картинки товара каталога
- `set price` — установка цены товара каталога

**3. Класс `CardPreview`**
Отображение карточки товара при открытии. Класс наследует класс `Component<T>` с интерфейсом `IProduct`.

```tsx
interface IProduct {
  id: string;
	description: string;
  image: string;
  title: string;
	category: string;
	price: number;
}
```
Содержит методы:
- `get id` — установка id товара каталога
- `get id` — получение id товара каталога
- `set title` — установка наименования товара каталога
- `set description` — установка описания товара каталога
- `set category` — установка категории товара каталога
- `set image` — установка цены картинки товара каталога
- `set price` — установка цены товара каталога



**4. Класс `Modal`**
Отображение модального окна. Класс наследует абстрактнымй класс `Component<T>` с интерфейсом `IModal`.

```tsx
interface IModal {
    content: HTMLElement;
}
```
Содержит методы:
- `set content` — заподнение модального окна контентом
- `open` — открыть модальное окно
- `close` — закрыть модальное окно
- `render` — рендеринг модального окна м заполненными данными

**5. Класс `Form<T>`**
Реализация форм. Класс наследует абстрактнымй класс `Component<T>` с интерфейсом `IForm`.

```tsx
interface IFormState {
    valid: boolean;
    errors: string[];
}
```
Содержит методы:
- `onInputChange` — регистрация события измененния поля при заполнении формы
- `set valid` — блокировка кнопки отправки данных
- `set errors` — установка текста ошибки
- `render` — рендеринг формы и полей

**6. Класс `Delivery`**
Отображение формы с данными способа доставки заказа. Класс наследует класс `Form<T>` с интерфейсом `IUserData`.

```tsx
interface IUserData {
  payment?: paymentType;
  address?: string;
  email?: string;
  phone?: string;
}
```
Содержит методы:
- `set payment` — установка поля способа доставки
- `set address` — устанавка поля адреса доставки

**7. Класс `Contacts`**
Отображение формы с данными контактов покупателя. Класс наследует класс `Form<T>` с интерфейсом `IUserData`.

```tsx
interface IUserData {
  payment?: paymentType;
  address?: string;
  email?: string;
  phone?: string;
}
```
Содержит методы:
- `set email` — установка поля электронной почты
- `set phone` — устанавка поля телефона
**8. Класс `Success`**
Отображение успешно оформленного заказа. Класс наследует класс `Component<T>` с интерфейсом `ISuccess`.

```tsx
interface ISuccess {
    total: number;
}
```
Содержит методы:
- `set total` — установка стоимости оформленного заказа

**9. Класс `Basket`**
Отображение корзины. Класс наследует класс `Component<T>` с интерфейсом `IBasket`.

```tsx
interface IBasket {
    items: HTMLElement[];
    total: number;
}
```
Содержит методы:
- `set items` — установка товаров в список товаров корзины
- `set total` — установка стоимости товаров корзины

**10. Класс `CardBasket`**
Отображение товара в корзине. Класс наследует класс `Component<T>` с интерфейсом `ICardBasket`.

```tsx
interface ICardBasket {
    id: string;
    title: string;
	price: number;
}
```
Содержит методы:
- `set title` — установка наименования товара корзины
- `set price` — установка цены товара корзины
- `get id` — установка id товара корзины
- `get id` — получение id товара корзины