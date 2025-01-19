const listOne = document.querySelector(".list-one");
const listTwo = document.querySelector(".list-two");
const inputAmount = document.querySelector(".input-currency");

const imgFlagOne = document.querySelector(".to-convert-currency-flag");
const imgFlagTwo = document.querySelector(".converted-currency-flag");

const change = document.querySelector(".change");

const resultAmountOne = document.querySelector(".to-convert-value");
const resultAmount = document.querySelector(".converted-value");
const btnConvert = document.querySelector(".btn-convert");

const updateInfo = document.querySelector(".update-info");

const apiObject = {
  apiKey: "3672e4a8bd7f72f989f6bb18",
};

let request,
  resultRequest,
  option,
  firstLoad = true,
  finalResult,
  resultOne;

function createList(acronymCurrency, list) {
  let option = document.createElement("OPTION");
  option.value = acronymCurrency;
  option.innerHTML = acronymCurrency;
  list.appendChild(option);
}

async function getFirstData(currencyOne, currencyTwo, amount) {
  request = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiObject.apiKey}/latest/${currencyOne}`
  );
  resultRequest = await request.json();

  const numericAmount =
    parseFloat(amount.replace(/\./g, "").replace(",", ".")) || 0;
  finalResult =
    numericAmount * resultRequest.conversion_rates[currencyTwo] || 0;
  resultAmount.innerHTML = `${formatCurrency(finalResult)} ${currencyTwo}`;

  resultOne = numericAmount * resultRequest.conversion_rates[currencyOne];
  resultAmountOne.innerHTML = `${formatCurrency(resultOne)} ${currencyOne}`;

  imgFlagOne.src = `https://srbaliardo.github.io/cash-converter/src/images/flags/${currencyOne}.png`;
  imgFlagTwo.src = `https://srbaliardo.github.io/cash-converter/src/images/flags/${currencyTwo}.png`;

  displayLastUpdate(resultRequest.time_last_update_utc);

  if (firstLoad) {
    Object.keys(resultRequest.conversion_rates).forEach((e) => {
      createList(e, listOne);
      createList(e, listTwo);
    });
    listTwo.value = currencyTwo;
    firstLoad = false;
  }
}

function updateFlags() {
  imgFlagOne.src = `https://srbaliardo.github.io/cash-converter/src/images/flags/${listOne.value}.png`;
  imgFlagTwo.src = `https://srbaliardo.github.io/cash-converter/src/images/flags/${listTwo.value}.png`;
}

function formatCurrency(value) {
  return parseFloat(value || 0)
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function handleInputFormat(event) {
  let input = event.target.value.replace(/[^\d]/g, "");
  let numericValue = (parseInt(input, 10) || 0) / 100;
  inputAmount.value = formatCurrency(numericValue);
}

function displayLastUpdate(utcString) {
  const utcDate = new Date(utcString);
  const localDate = new Intl.DateTimeFormat(navigator.language, {
    dateStyle: "short",
    timeStyle: "long",
  }).format(utcDate);

  updateInfo.textContent = `Última atualização monetária: ${localDate}`;
}

window.addEventListener("load", () => {
  getFirstData("BRL", "USD", "0.00");
});

btnConvert.addEventListener("click", () => {
  const formattedAmount = inputAmount.value;
  getFirstData(listOne.value, listTwo.value, formattedAmount);
});

change.addEventListener("click", () => {
  let valueListOne = listOne.value;
  listOne.value = listTwo.value;
  listTwo.value = valueListOne;
  updateFlags();

  const formattedAmount = inputAmount.value;
  getFirstData(listOne.value, listTwo.value, formattedAmount);
});

listOne.addEventListener("change", updateFlags);
listTwo.addEventListener("change", updateFlags);
inputAmount.addEventListener("input", handleInputFormat);
