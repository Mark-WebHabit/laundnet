import React, { createContext, useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";

export const DataContext = createContext(null);

function DataStore({ children }) {
  const [services, setServices] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [servicesFetched, setServicesFetched] = useState(false);
  const [customersFetched, setCustomersFetched] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [logistics, setLogistics] = useState([]);
  const [user, setUser] = useState(false);

  // ref
  const servicesRef = ref(db, "services");
  const customersRef = ref(db, "users");
  const ordersRef = ref(db, "orders");
  const logisticsRef = ref(db, "logistics");

  useEffect(() => {
    // Retrieve user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    const unsubscribeServices = onValue(servicesRef, (snapshot) => {
      const data = snapshot.val();
      const servicesArray = data
        ? Object.keys(data).map((uid) => ({ uid, ...data[uid] }))
        : [];

      setServices(servicesArray);
      setServicesFetched(true);
    });

    const unsubscribeLogistics = onValue(logisticsRef, (snapshot) => {
      const data = snapshot.val();
      const servicesArray = data
        ? Object.keys(data).map((uid) => ({ uid, ...data[uid] }))
        : [];

      setLogistics(servicesArray);
    });

    const unsubscribeCustomers = onValue(customersRef, (snapshot) => {
      const data = snapshot.val();
      let customersArray = data
        ? Object.keys(data).map((uid) => ({ uid, ...data[uid] }))
        : [];

      customersArray = customersArray.filter((cust) => !cust.isAdmin);

      setCustomers(customersArray);
      setCustomersFetched(true);
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeServices();
      unsubscribeCustomers();
      unsubscribeLogistics();
    };
  }, []);

  useEffect(() => {
    if (servicesFetched && customersFetched) {
      const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        const ordersArray = data
          ? Object.keys(data).map((uid) => ({ uid, ...data[uid] }))
          : [];

        let newOrdersArray = ordersArray.map((order) => {
          let additionalString = "";
          if (order?.addsOn?.length > 0) {
            additionalString = order.addsOn
              .map((element) => Object.keys(element).join(" "))
              .join(", ");
            order.additional = additionalString;
          }
          const date = order.date.split(" ");
          order.monthDay = date[0] + " " + date[1];
          order.year = date[2];
          order.time = date[3] + " " + date[4];

          const user = customers.find((user) => user.uid == order.userId);

          if (user) {
            order.username = user?.username;
            order.phone = user.phone;
            order.address = user.address;
          }

          return order;
        });

        setOrders(newOrdersArray);
      });

      // Cleanup listener on unmount
      return () => {
        unsubscribeOrders();
      };
    }
  }, [servicesFetched, customersFetched]);

  useEffect(() => {
    if (customers?.length <= 0) return;

    const history = customers.map((customer) => {
      if (orders.length <= 0) return customer;
      const transactionHistory = orders.filter((order) => {
        return order.userId == customer.uid;
      });

      customer.history = transactionHistory;

      return customer;
    });

    setOrderHistory(history);
  }, [customers, orders]);

  return (
    <DataContext.Provider
      value={{
        services,
        transactions,
        servicesRef,
        customers,
        orders,
        orderHistory,
        user,
        setUser,
        ordersRef,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataStore;
