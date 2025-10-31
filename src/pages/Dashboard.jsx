import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const currencies = ["BTC", "ETH", "SOL", "USDT", "BNB", "ADA"];
  
  // 🔹 Simulated trade generator
  const generateFakeTrade = () => {
    const type = Math.random() > 0.5 ? "BUY" : "SELL";
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const amount = (Math.random() * 5).toFixed(3);
    const price = (Math.random() * 50000 + 100).toFixed(2);
    const total = (amount * price).toFixed(2);
    const id = Math.random().toString(36).substring(2, 8);
    return { id, type, currency, amount, price, total, time: new Date().toLocaleTimeString() };
  };

  useEffect(() => {
    getUserData();

    // 🔹 Simulate trades every few seconds
    const tradeInterval = setInterval(() => {
      setTrades((prev) => {
        const trade = generateFakeTrade();
        if (prev.length > 20) prev.pop(); // Keep list short
        return [trade, ...prev];
      });
    }, 3000);

    // 🔹 Subscribe to real-time balance updates
    const channel = supabase
      .channel("realtime:users")
      .on("postgres_changes", { event: "*", schema: "public", table: "users" }, (payload) => {
        if (payload.new && payload.new.id === user?.id) {
          setBalance(payload.new.balance);
        }
      })
      .subscribe();

    return () => {
      clearInterval(tradeInterval);
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    setUser(user);

    const { data, error } = await supabase
      .from("users")
      .select("balance")
      .eq("id", user.id)
      .single();

    if (error) console.error(error);
    else setBalance(data?.balance || 0);

    setLoading(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading dashboard...
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Please log in to view your dashboard.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user.email}</h1>
        <p className="text-gray-400 mb-6">Your live crypto portfolio</p>

        <div className="bg-gray-900 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-2">Current Balance</h2>
          <p className="text-3xl font-bold text-green-400">${balance.toFixed(2)}</p>
          <p className="text-gray-500 mt-1 text-sm">Updated in real time</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Live Trade Simulation</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-sm">
                  <th className="p-2">Time</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Currency</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Price (USD)</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id} className="border-b border-gray-800">
                    <td className="p-2 text-gray-400 text-sm">{trade.time}</td>
                    <td
                      className={`p-2 font-bold ${
                        trade.type === "BUY" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {trade.type}
                    </td>
                    <td className="p-2">{trade.currency}</td>
                    <td className="p-2">{trade.amount}</td>
                    <td className="p-2">${trade.price}</td>
                    <td className="p-2">${trade.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
