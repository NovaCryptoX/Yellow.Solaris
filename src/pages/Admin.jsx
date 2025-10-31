import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newBalance, setNewBalance] = useState("");
  const [message, setMessage] = useState("");

  // 🔹 Fetch users from Supabase
  useEffect(() => {
    fetchUsers();

    // Optional: Real-time updates when balances change
    const channel = supabase
      .channel("realtime:users")
      .on("postgres_changes", { event: "*", schema: "public", table: "users" }, fetchUsers)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("id, email, balance");
    if (error) console.error(error);
    else setUsers(data || []);
  };

  const updateBalance = async (userId) => {
    if (!newBalance) return setMessage("Please enter a new balance amount.");

    const { error } = await supabase
      .from("users")
      .update({ balance: parseFloat(newBalance) })
      .eq("id", userId);

    if (error) setMessage("❌ Failed to update balance.");
    else {
      setMessage("✅ Balance updated successfully!");
      setNewBalance("");
      setSelectedUser(null);
      fetchUsers();
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="overflow-x-auto bg-gray-900 rounded-xl shadow-lg p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-3">Email</th>
              <th className="p-3">Balance</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800">
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">${user.balance?.toFixed(2) || 0}</td>
                  <td className="p-3 text-right">
                    {selectedUser === user.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <input
                          type="number"
                          value={newBalance}
                          onChange={(e) => setNewBalance(e.target.value)}
                          className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white w-24"
                        />
                        <button
                          onClick={() => updateBalance(user.id)}
                          className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setSelectedUser(null)}
                          className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedUser(user.id)}
                        className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {message && <p className="text-center mt-4 text-green-400">{message}</p>}
    </div>
  );
      }
