const elForm = document.querySelector(".form");
const elFormAmount = document.querySelector(".form__amount");
const elFormAmountSelect = document.querySelector(".form__amount-select");
const elFormToValue = document.querySelector(".form__to-value");
const elFormData = document.querySelector(".form__data");
const elTotalResult = document.querySelector(".total__result");

const elMoneyValue = document.querySelector(".money__value");
const elMoneyResult = document.querySelector(".money__result");
const elMoneyAmount = document.querySelector(".money__amount");
const elTransferCurrency = document.querySelector(".transfer__currency");
const elExchangeRubl = document.querySelector(".exchange__rubl");
const elTransferToCurrency = document.querySelector(".transfer__to-currency");

elTotalResult.style.display = "none";

const request = fetch(`https://nbu.uz/uz/exchange-rates/json/`)
  .then((res) => res.json())
  .then((currency) => renderValues(currency.sort()));

const renderValues = function (valuty) {
  const fragmentAmount = document.createDocumentFragment();
  const fragmentToAmount = document.createDocumentFragment();

  for (let i = 0; i < valuty.length; i++) {
    let newAmount = document.createElement("option");
    let newToAmount = document.createElement("option");

    newAmount.textContent = valuty[i].title;
    newToAmount.textContent = valuty[i].title;
    elFormData.textContent = valuty[i].date;

    fragmentAmount.appendChild(newAmount);
    fragmentToAmount.appendChild(newToAmount);
  }

  elFormAmountSelect.appendChild(fragmentAmount);
  elFormToValue.appendChild(fragmentToAmount);
};

elForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  elTotalResult.style.display = "";

  fetch(`https://nbu.uz/uz/exchange-rates/json/`)
    .then((res) => res.json())
    .then((currency) => renderValue(currency));
});

const renderValue = function (currency) {
  const formAmount = elFormAmount.value;
  const formAmountSelect = elFormAmountSelect.value;
  const formToValue = elFormToValue.value;
  console.log(formAmountSelect, formToValue);

  if (formAmount >= 0) {
    elMoneyAmount.textContent = formAmount;
    elExchangeRubl.textContent = currency.find(
      (item) => item.title == "Rossiya rubli"
    ).cb_price;

    const foundValue = currency.find((item) => item.title == formAmountSelect);
    const foundToValue = currency.find((item) => item.title == formToValue);

    if (formAmountSelect === "uzs" && formToValue === "uzs") {
      elMoneyValue.textContent = `${formAmount} UZS`;
      elMoneyResult.textContent = `${formAmount} UZS`;
      elTransferCurrency.textContent = "UZS ( O'zbekiston so'mi )";
      elTransferToCurrency.textContent = "UZS ( O'zbekiston so'mi )";
    } else if (formAmountSelect == "uzs") {
      elMoneyValue.textContent = `${formAmount} UZS`;
      elMoneyResult.textContent = `${(
        formAmount / foundToValue.cb_price
      ).toFixed(6)} ${foundToValue.code}`;
      elTransferCurrency.textContent = `UZS ( O'zbekiston so'mi )`;
      elTransferToCurrency.textContent = `${foundToValue.code} ( ${foundToValue.title} )`;
    } else if (formToValue == "uzs") {
      elMoneyValue.textContent = `${formAmount} ${foundValue.code}`;
      elMoneyResult.textContent = `${(formAmount * foundValue.cb_price).toFixed(
        2
      )} UZS`;
      elTransferCurrency.textContent = `${foundValue.code} ( ${foundValue.title} )`;
      elTransferToCurrency.textContent = "UZS ( O'zbekiston so'mi )";
    } else {
      elMoneyResult.textContent =
        ((foundValue.cb_price / foundToValue.cb_price) * formAmount).toFixed(
          2
        ) + ` ${foundToValue.code}`;
      elMoneyValue.textContent = `${formAmount} ${foundValue.code}`;
      elTransferCurrency.textContent = `${foundValue.code} ( ${foundValue.title} )`;
      elTransferToCurrency.textContent = `${foundToValue.code} ( ${foundToValue.title} )`;
    }
  }
};
