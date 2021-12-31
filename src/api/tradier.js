const baseUrl = "https://sandbox.tradier.com/v1";
const token = "API_KEY";

export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Get stock quote for list of stocks
export const getQuotes = async (tickers) => {
  try {
    console.log(`Fetching ${tickers}...`)
    const response = await fetch(`${baseUrl}/markets/quotes?symbols=${tickers}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': "application/json"
      }
    });

    return response.json();
  } catch(ex) {
    console.log(ex);
    return { quotes: { quote: { close: "undefined" } } };
  }
}

export const getHistoricalPricing = async (symbol) => {
  try {
    // Format 5 years ago
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = String(today.getFullYear());
    const end = `${yyyy}-${mm}-${dd}`;
    const start = `${Number(yyyy)-5}-${mm}-${dd}`;

    console.log(`Fetching last 5 years for ${symbol} (${start})`);
    const response = await fetch(
      `${baseUrl}/markets/history?symbol=${symbol}&interval=daily&start=${start}&end=${end}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': "application/json"
        }
    });
    //console.log(response);
    return response.json()
  } catch(ex) {
    console.log(ex);
    return null;
  }
}