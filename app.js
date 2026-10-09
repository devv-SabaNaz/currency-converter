const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    const option = document.createElement("option");

    option.innerText = currCode;
    option.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    }

    if (select.name === "to" && currCode === "PKR") {
      option.selected = true;
    }

    select.append(option);
  }

  select.addEventListener("change", () => {
    updateFlag(select);
    updateExchangeRate();
  });
}

// Update flag
function updateFlag(element) {
  const currCode = element.value;
  const countryCode = countryList[currCode];

  const img = element.parentElement.querySelector("img");

  if (countryCode) {
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  }
}

// Exchange rate
async function updateExchangeRate() {
  let amount = Number(amountInput.value);

  if (!amount || amount <= 0) {
    amount = 1;
    amountInput.value = 1;
  }

  const from = fromCurr.value;
  const to = toCurr.value;

  if (from === to) {
    msg.innerText = `${amount} ${from} = ${amount} ${to}`;
    return;
  }

  msg.innerText = "Getting exchange rate...";

  try {
    const response = await fetch(`${BASE_URL}/${from}`);

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();

    const rate = data.rates[to];

    if (!rate) {
      throw new Error("Currency not available");
    }

    const finalAmount = (amount * rate).toFixed(2);

    msg.innerText = `${amount} ${from} = ${finalAmount} ${to}`;
  } catch (error) {
    console.error(error);
    msg.innerText = "Unable to get exchange rate.";
  }
}

// Button
btn.addEventListener("click", (event) => {
  event.preventDefault();
  updateExchangeRate();
});

// Amount input
amountInput.addEventListener("input", () => {
  updateExchangeRate();
});

// Initial setup
window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});