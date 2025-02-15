const form = document.querySelector('form');
const amount = document.querySelector('#amount');
const currency = document.querySelector('#currency');
const footer = document.querySelector('footer');
const description = document.querySelector('#description');
const result = document.querySelector('#result');

let rates = {
  USD: undefined,
  EUR: undefined,
  GBP: undefined
};

async function fetchExchangeRates() {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (!response.ok) throw new Error("Erro ao buscar taxas de câmbio.");
    
    const data = await response.json();
    rates.USD = data.rates.BRL;
    
    const eurResponse = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
    const eurData = await eurResponse.json();
    rates.EUR = eurData.rates.BRL;

    const gbpResponse = await fetch('https://api.exchangerate-api.com/v4/latest/GBP');
    const gbpData = await gbpResponse.json();
    rates.GBP = gbpData.rates.BRL;

  } catch (error) {
    console.error("Falha ao obter taxas de câmbio:", error);
  }
}

fetchExchangeRates();

amount.addEventListener('input', ()=>{
  let value = amount.value;
  const hasCharactersRegex = /\D+/g;
  value = amount.value.replace(hasCharactersRegex, '');  
});

form.addEventListener('submit', (e)=>{
  e.preventDefault();

  switch(currency.value) {
    case 'USD':
      convertCurrency(amount.value, rates.USD, 'US$')
      break;
    case 'EUR':
      convertCurrency(amount.value, rates.EUR, '€');
      break;
    case 'GBP':
      convertCurrency(amount.value, rates.GBP, '£');
      break;
  }
});

function convertCurrency(amount, price, symbol) {
  try {
    description.textContent = `${symbol}1 = ${formatCurrencyBRL(price)}`;

    let total = amount * price;
    result.textContent = formatCurrencyBRL(total)


    footer.classList.add('show-result');
  } catch (error) {
    footer.classList.remove('show-result')
    alert('Não foi possível converter os valores. Tente novamente mais tarde.')
  }
  
  
}

function formatCurrencyBRL(value) {  
  
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}