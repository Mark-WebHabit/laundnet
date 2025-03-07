import React, { createContext, useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";
import { createClient } from "@supabase/supabase-js";

export const DataContext = createContext(null);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, anonKey);

const status = [
  {
    status: "Pending",
    description: "Your laundry is waiting to be processed.",
  },
  {
    status: "Preparing",
    description: "We're getting everything ready for your laundry.",
  },
  { status: "Wash", description: "Your clothes are currently being washed." },
  { status: "Fold", description: "We're folding your clothes with care." },
  { status: "Dry", description: "Your laundry is being dried." },
  {
    status: "For Pick Up",
    description: "Your laundry is ready for you to pick up.",
  },
  {
    status: "For Deliver",
    description: "Your laundry is on its way to be delivered.",
  },
  {
    status: "Delivered",
    description: "Your laundry has been delivered to your doorstep.",
  },
  { status: "Claimed", description: "Your laundry has been claimed." },
  {
    status: "Cancelled",
    description: "Your laundry order has been cancelled.",
  },
  { status: "On the way", description: "Your laundry is on the way" },
  { status: "On The Way", description: "Your laundry is on the way" },
];

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
  const [weekly, setWeekly] = useState([]);
  const [weightPrice, setWeightPrice] = useState(30);

  // ref
  const servicesRef = ref(db, "services");
  const customersRef = ref(db, "users");
  const ordersRef = ref(db, "orders");
  const logisticsRef = ref(db, "logistics");
  const serviceFeeRef = ref(db, "serviceFee");

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

    const unsubscribeServiceFee = onValue(serviceFeeRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setWeightPrice(data?.price || 0);
      } else {
        setWeightPrice(0);
      }
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
      unsubscribeServiceFee();
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

  const groupByWeek = (data) => {
    const getStartOfWeek = (dateStr) => {
      const date = new Date(dateStr);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
      const startOfWeek = new Date(date.setDate(diff));
      return startOfWeek.toISOString().split("T")[0]; // Return date in YYYY-MM-DD format
    };

    const groupedData = data.reduce((acc, curr) => {
      const startOfWeek = getStartOfWeek(curr.date);
      if (!acc[startOfWeek]) {
        acc[startOfWeek] = {
          totalSales: 0,
          numOrders: 0,
          numDeliveredOrClaimed: 0,
        };
      }
      if (curr.status === "Delivered" || curr.status === "Claimed") {
        acc[startOfWeek].totalSales += curr.overAllTotal;
        acc[startOfWeek].numDeliveredOrClaimed += 1;
      }
      acc[startOfWeek].numOrders += 1;
      return acc;
    }, {});

    const currentWeekStart = getStartOfWeek(new Date().toISOString());

    return Object.keys(groupedData).map((week) => ({
      week_starting_on: week,
      totalSales: groupedData[week].totalSales,
      numOrders: groupedData[week].numOrders,
      numDeliveredOrClaimed: groupedData[week].numDeliveredOrClaimed,
      isCurrentWeek: week === currentWeekStart,
    }));
  };

  useEffect(() => {
    const week = groupByWeek(orders);
    setWeekly(week);
  }, [orders]);

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
        weekly,
        weightPrice,
        status,
        setWeightPrice,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataStore;
