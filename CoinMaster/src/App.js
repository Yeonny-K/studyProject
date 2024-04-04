
import { useEffect, useState } from "react";

function App() {
 
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [btc, setBtc] = useState(0);
  const [money, setMoney] = useState();
  const [selected, setSelect] = useState(null);
  const [unit, setUnit] = useState(true); // true일 경우 btc

  useEffect(() => {
    fetch("https://api.coinpaprika.com/v1/tickers")
    .then( (response)=>response.json())
    .then( (json) => {
      setCoins(json);
      setBtc(json.find(element => element.id === "btc-bitcoin").quotes.USD.price);
      setLoading(false);
    });
  }, []);
  
  const onChange = (event) => setMoney(event.target.value);
  const onSubmit = (event) => {
    event.preventDefault();
  }
  const onChoice = (event) => {
    const selectedCoin = coins.find((coin) => coin.id === event.target.value);
    setSelect(selectedCoin);
  }

  const onClick = () => {
    setUnit( (prev) => !prev);
  };

  const calculate = () => {
    if (!selected || !money) return 0;
    const purchaseAmount = money / (selected.quotes.USD.price);
    return purchaseAmount.toFixed(2); 
  };

  return (
   <div>
    <h1>The Coins! {loading ? "" : `(${coins.length})`}</h1>
    {loading ? 
    (<strong>loading...</strong>) 
    : 
    (
    <div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          value={money}
          type="number"
          placeholder="Write your balance($)"
        />
      </form>
      <button onClick={onClick}>{unit ? "BTC" : "USD"}</button>
      {
        unit ?
        (<div>
          <select
            onChange={onChoice} value={selected ? selected.id : ""}>
            {coins.map((coin) => (
            <option key={coin.id} value={coin.id}>
            ({coin.name} ({coin.symbol}) : {(coin.quotes.USD.price)/btc} BTC)
            </option>))}
          </select>
          </div>)
        :
        (<div>
          <select
            onChange={onChoice} value={selected ? selected.id : ""}>
            {coins.map((coin) => (
            <option key={coin.id} value={coin.id}>
            ({coin.name} ({coin.symbol}) : {(coin.quotes.USD.price)} USD)
            </option>))}
          </select>
          </div>)
      }
     {selected && money && (
            <h3>
              You can buy {calculate()} {selected.symbol}
            </h3>
      )}
    </div>
    )}  
   </div>
  );
}

export default App;