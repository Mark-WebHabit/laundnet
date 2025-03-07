import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/DataStore";
import { remove, ref } from "firebase/database";
import { db } from "../../firebase";

function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState([]);

  const { orders } = useContext(DataContext);

  useEffect(() => {
    if (orders) {
      const trans = orders
        .filter((ord) => ord.status !== "Cancelled")
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      setTransactions(trans);
    } else {
      setTransactions([]);
    }
  }, [orders]);

  const handleDelete = async (uid) => {
    try {
      if (window.confirm("Are you sure you want to delete this transaction?")) {
        const orderRef = ref(db, `orders/${uid}`);
        await remove(orderRef);
        alert("Deleted Successfully");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting transaction: " + error.message);
    }
  };

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction?.username
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction?.referenceNumber?.includes(searchQuery)
  );

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>

      <input
        type="text"
        placeholder="Search by username or reference number..."
        className="border rounded-lg p-2 w-full mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr className="text-left">
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Payment</th>
              <th className="px-4 py-2">Base Fee</th>
              <th className="px-4 py-2">Adds Fee</th>
              <th className="px-4 py-2">Reference</th>
              <th className="px-4 py-2">Proof</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{transaction.username || "N/A"}</td>
                  <td className="px-4 py-2 text[15px]">
                    {transaction.date || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    ₱{transaction.amountPresented ?? "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    ₱{transaction.weightCost ?? "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    ₱{transaction.addsOnCost ?? "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {transaction.referenceNumber || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {transaction.proof ? (
                      <img
                        src={transaction.proof}
                        alt="Proof"
                        className="w-[50px] aspect-square rounded-lg object-cover"
                        onClick={() => window.open(transaction.proof, "_blank")}
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {transaction.qrCodeUrl ? (
                      <img
                        src={transaction.qrCodeUrl}
                        alt="QR"
                        className="w-[50px] aspect-square"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(transaction.uid)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;
