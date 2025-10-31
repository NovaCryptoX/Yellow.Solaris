import React, { useEffect, useState } from "react";

export default function Trades() {
  const [trades, setTrades] = useState([]);

  // Example crypto list with fake prices
  const coins = [
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "BNB", name: "Binance Coin" },
    { symbol: "SOL", name: "Solana" },
    { symbol: "XRP", name: "Ripple" },
    { symbol: "ADA", name: "Cardano" },
    { symbol: "USDT", name: "Tether" },
  ];

  useEffect(() => {
    const generateTrade = () => {
      const coin = coins[Math.floor(Math.random() * coins.length)];
      const type = Math.random() > 0.5 ? "BUY" : "SELL";
      const amount = (Math.random() * 5).toFixed(3);
      const price = (Math.random() * 60000 + 1000).toFixed(2);
      const time = new Date().toLocaleTimeString();

      return {
        id: Date.now(),
        symbol: coin.symbol,
        name: coin.name,
        type,
        amount,
        price,
        time,
      };
    };

    // Start with a few sample trades
    setTrades(Array.from({ length: 10 }, generateTrade));

    // Push a new trade every 3 seconds
    const interval = setInterval(() => {
      setTrades((prev) => [generateTrade(), ...prev.slice(0, 19)]); // keep last 20 trades
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        Live Trade Simulation
      </h1>

      <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-yellow-400">
            <tr>
              <th className="py-3 px-4 text-left">Time</th>
              <th className="py-3 px-4 text-left">Asset</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-right">Price (USD)</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr
                key={trade.id}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition"
              >
                <td className="py-3 px-4 text-gray-400">{trade.time}</td>
                <td className="py-3 px-4 font-semibold">
                  {trade.symbol} <span className="text-gray-500">({trade.name})</span>
                </td>
                <td
                  className={`py-3 px-4 font-bold ${
                    trade.type === "BUY" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {trade.type}
                </td>
                <td className="py-3 px-4 text-right text-gray-300">
                  {trade.amount}
                </td>
                <td className="py-3 px-4 text-right text-gray-300">
                  ${trade.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-gray-500 mt-4 text-sm">
        ⚡ Data updates automatically every few seconds
      </p>
    </div>
  );
}
