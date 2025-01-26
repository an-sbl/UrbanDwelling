document.querySelector("#openNav").addEventListener("click", function(){
  document.getElementById("navModal").classList.add('open')
})

document.querySelector(".modal__close-button").addEventListener("click", function(){
  document.getElementById("navModal").classList.remove('open')
})
window.addEventListener('keydown', (e) => {
  if (e.key === "Escape") {
      document.getElementById("navModal").classList.remove("open")
  }
})

const cardTemplate = document.querySelector('#card-template').content;
const catalogItems = document.querySelector('.catalog');

// Cоздание карточек
function createItem(link, name, prices){
    const cardElement = cardTemplate.querySelector('.catalog__item').cloneNode(true);
    cardElement.querySelector('.card-image').src = link;
    cardElement.querySelector('.card-image').alt = "Лампа";
    cardElement.querySelector('.item__info-title').textContent = name;
    cardElement.querySelector('.newPrice').textContent = prices[0] + " ₽";
    if(prices.length == 2){
      cardElement.querySelector('.newPrice').textContent = prices[0] + " ₽";
      cardElement.querySelector('.newPrice').setAttribute("style","color: #E45302")
      cardElement.querySelector('.promo-button').hidden = false;
      cardElement.querySelector('.oldPrice').hidden = false;
      cardElement.querySelector('.oldPrice').textContent = prices[1] + " ₽";
    }
    return cardElement;
  }

  const cardItems = [
    {
      name: "Встраиваемый светильник Markt",
      link: "../img/recessed_lightMARKT.png",
      prices: ["3 490", "6 660"]
    },
    {
      name: "Линейный светильник ARG",
      link: "img/linear_lightARG(dark).png",
      prices: ["6 700"]
    },{
      name: "Светодиодный светильник",
      link: "img/linear_lightARG(white).png",
      prices: ["5 060", "6 660"]
    },{
      name: "Встраиваемый светильник Markt",
      link: "img/recessed_lightMARKT.png",
      prices: ["3 490"]
    },{
      name: "Линейный светильник ARG",
      link: "img/linear_lightARG(dark).png",
      prices: ["6 700", "7 060"]
    },{
      name: "Светодиодный светильник",
      link: "img/linear_lightARG(white).png",
      prices: ["5 060"]
    },{
      name: "Встраиваемый светильник Markt",
      link: "img/recessed_lightMARKT.png",
      prices: ["3 490", "6 660"]
    },{
      name: "Линейный светильник ARG",
      link: "img/linear_lightARG(dark).png",
      prices: ["6 700"]
    }
]

  cardItems.forEach((item =>{
    const catalogItem = createItem(item.link, item.name, item.prices);
    console.log(catalogItem);
    catalogItems.append(catalogItem);
  }))
  

  