const listOne = document.querySelector(".list-one");
const listTwo = document.querySelector(".list-two");
const inputAmount = document.querySelector(".input-currency");

const imgFlagOne = document.querySelector(".to-convert-currency-flag")
const imgFlagTwo = document.querySelector(".converted-currency-flag")

const change = document.querySelector(".change");

const resultAmountOne = document.querySelector(".to-convert-value");
const resultAmount = document.querySelector(".converted-value");
const btnConvert = document.querySelector(".btn-convert");

const apiObject = {
    apiKey: "3672e4a8bd7f72f989f6bb18"
};

let request, resultRequest, option, firstLoad = true, finalResult, resultOne;

function createList(acronymCurrency, list){
    let option = document.createElement("OPTION");
    option.value = acronymCurrency;
    option.innerHTML = acronymCurrency;
    list.appendChild(option);
}

async function getFirstData(currencyOne, currencyTwo, amount){
    request = await fetch(`https://v6.exchangerate-api.com/v6/${apiObject.apiKey}/latest/${currencyOne}`);
    resultRequest = await request.json();

    inputAmount.value = amount;
    finalResult = amount * resultRequest.conversion_rates[currencyTwo];
    resultAmount.innerHTML = `${finalResult.toFixed(2)} ${currencyTwo}`;

    resultOne = amount * resultRequest.conversion_rates[currencyOne];
    resultAmountOne.innerHTML = `${resultOne.toFixed(2)} ${currencyOne}`;

    imgFlagOne.src =`/src/images/flags/${currencyOne}.png`
    imgFlagTwo.src =`/src/images/flags/${currencyTwo}.png`

    if(firstLoad){
        Object.keys(resultRequest.conversion_rates).forEach((e)=>{
            createList(e, listOne);
            createList(e, listTwo);
        });
        listTwo.value = currencyTwo;
        firstLoad = false;

    };
};

window.addEventListener("load", ()=>{
    getFirstData("BRL", "USD", "");
});

btnConvert.addEventListener("click", ()=>{
    getFirstData(listOne.value, listTwo.value, inputAmount.value);
});

change.addEventListener("click", ()=>{
    let valueListOne = listOne.value;
    listOne.value = listTwo.value;
    listTwo.value = valueListOne;
    console.log(valueListOne, listTwo.value)
});