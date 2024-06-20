// include api for currency change
const api = "https://api.exchangerate-api.com/v4/latest/USD";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".mes");
const msg1 = document.querySelector(".mes1");
const swap = document.querySelector(".dropdown i");

// Event when currency is changed
fromCurr.addEventListener('change', (evt) => {
  updateFlag(evt.target);
});

// Event when currency is changed
toCurr.addEventListener('change', (evt) => {
  updateFlag(evt.target);
});

// function to populate dropdowns with currency options
const populateDropdowns = async () => {
  try {
    const response = await fetch(api);
    const data = await response.json();
    const currencies = Object.keys(data.rates);

    dropdowns.forEach(select => {
      currencies.forEach(currCode => {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
          newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
          newOption.selected = "selected";
        }
        select.append(newOption);
      });

      select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
      });
    });
  } catch (error) {
    console.error("Error fetching currencies: ", error);
  }
};

// function to update exchange rate
const updateExchangeRate = async () => {
  try {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
      amtVal = 1;
      amount.value = "1";
    }

    const URL = `${api}`;
    let response = await fetch(URL);
    let data = await response.json();
    let fromRate = data.rates[fromCurr.value];
    let toRate = data.rates[toCurr.value];
    let finalAmount = (amtVal * toRate / fromRate).toFixed(2);

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    msg1.innerText = ` 1 ${fromCurr.value} = ${(toRate/fromRate).toFixed(2)} ${toCurr.value}`;
  } catch (error) {
    console.error("Error updating exchange rate: ", error);
  }
};

// function to update flag
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

swap.addEventListener("click", (evt) => {
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;
  updateExchangeRate();
});

window.addEventListener("load", () => {
  populateDropdowns();
  updateExchangeRate();
});
