import React, { useState, useEffect } from "react";
import axios from "axios";
import NoData from "./components/NoData";
import Product from "./components/Product";
import Transactions from "./components/Transactions";
import Order from "./components/Order";
import "./css/style.css";

const apiProducts = "http://localhost:5000/products";
const apiTransactions = "http://localhost:5000/transactions";
const apiClients = "http://localhost:5000/clients";

const App = () => {
  const [products, setProducts] = useState([]);
  const [productsAreLoading, setProductsAreLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [areClientsLoading, setAreClientsLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState({});
  const [isSelectedClientSet, setIsSelectedClientSet] = useState(false);
  const [addedProducts, setAddedProducts] = useState([]);
  const [lastTransaction, setLastTransaction] = useState({});
  const [lastTransactionIsSet, setLastTransactionIsSet] = useState(false);
  const [pointsAreCounted, setPointsAreCounted] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [areTransactionsLoading, setAreTransactionsLoading] = useState(true);
  const [clientTransactions, setClientTransactions] = useState([]);
  const [
    clientLastThreeMonthsTransactions,
    setClientLastThreeMonthsTransactions,
  ] = useState([]);
  const [
    totalPointsLast3MonthsClientTransactions,
    setTotalPointsLast3MonthsClientTransactions,
  ] = useState({});
  const [error, setError] = useState("");

  const getProducts = async () => {
    await axios
      .get(apiProducts)
      .then((res) => {
        setProducts(res.data);
        setProductsAreLoading(false);
      })
      .catch((err) => {
        setError("Error occured during retrieving Products data");
        setProductsAreLoading(false);
      });
  };

  const getTransactions = async () => {
    await axios
      .get(apiTransactions)
      .then((res) => {
        setTransactions(res.data);
        setAreTransactionsLoading(false);
      })
      .catch((err) => {
        setError("Error occured during retrieving Transactions data");
        setAreTransactionsLoading(false);
      });
  };

  const getClients = async () => {
    await axios
      .get(apiClients)
      .then((res) => {
        setClients(res.data);
        setAreClientsLoading(false);
      })
      .catch((err) => {
        setError("Error occured during retrieving Clients data");
        setAreClientsLoading(false);
      });
  };

  const increaseQuantity = (i) => {
    setProductsAreLoading(true);
    setProducts(
      products.map((item, currentIndex) =>
        i - 1 === currentIndex
          ? {
              ...item,
              orderQuantity: ++item.orderQuantity || 0,
              amount: --item.amount || 0,
            }
          : item
      )
    );
    setProductsAreLoading(false);
  };

  const decreaseQuantity = (i) => {
    setProductsAreLoading(true);
    setProducts(
      products.map((item, currentIndex) =>
        i - 1 === currentIndex
          ? {
              ...item,
              orderQuantity: --item.orderQuantity || 0,
              amount: ++item.amount || 0,
            }
          : item
      )
    );
    setProductsAreLoading(false);
  };

  const addItem = (prod) => {
    setLastTransactionIsSet(false);

    if (!addedProducts.length) {
      setAddedProducts((addedProducts) => [...addedProducts, prod]);
    } else if (addedProducts.some((el) => el.id === prod.id)) {
      setAddedProducts((items) =>
        items.map((item) =>
          item.id === prod.id
            ? {
                ...item,
                orderQuantity: item.orderQuantity + prod.orderQuantity,
                amount: prod.amount,
              }
            : {
                ...item,
              }
        )
      );
    } else {
      setAddedProducts((addedProducts) => [...addedProducts, prod]);
    }

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === prod.id
          ? {
              ...product,
              orderQuantity: 0,
            }
          : {
              ...product,
            }
      )
    );
  };

  const removeAddedProduct = (addedProduct) => {
    setLastTransactionIsSet(false);

    return setAddedProducts(
      (prevProducts) =>
        prevProducts.filter((product) => product.id !== addedProduct.id),

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === addedProduct.id
            ? {
                ...product,
                orderQuantity: 0,
                amount: product.amount + addedProduct.orderQuantity,
              }
            : {
                ...product,
              }
        )
      )
    );
  };

  const setPoints = (lastTransaction) => {
    if (lastTransaction.totalValue > 100) {
      setLastTransaction((prevState) => ({
        ...prevState,
        pointsOver50Dollars: lastTransaction.totalValue - 50,
        pointsOver100Dollars: (lastTransaction.totalValue - 100) * 2,
        totalPoints:
          (lastTransaction.totalValue - 100) * 2 +
          (lastTransaction.totalValue - 50),
      }));
      setPointsAreCounted(true);
      return;
    } else if (
      lastTransaction.totalValue > 50 &&
      lastTransaction.totalValue <= 100
    ) {
      setLastTransaction((prevState) => ({
        ...prevState,
        pointsOver50Dollars: (lastTransaction.totalValue - 50) * 1,
        pointsOver100Dollars: 0,
        totalPoints: (lastTransaction.totalValue - 50) * 1,
      }));
      setPointsAreCounted(true);
      return;
    } else if (lastTransaction.totalValue <= 50) {
      setLastTransaction((prevState) => ({
        ...prevState,
        pointsOver50Dollars: 0,
        pointsOver100Dollars: 0,
        totalPoints: 0,
      }));
      setPointsAreCounted(true);
      return;
    }
  };

  const createLastTransactionObject = () => {
    function getDate(date = new Date()) {
      let month = String(date.getMonth() + 1);
      let day = String(date.getDate());
      const year = String(date.getFullYear());

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return `${year}/${month}/${day}`;
    }

    addedProducts.length > 0 &&
      setLastTransaction((prevState) => ({
        ...prevState,
        id: Math.random(),
        products: addedProducts,
        date: getDate(),
        totalValue: addedProducts.reduce(
          (totalValue, product) =>
            totalValue + product.orderQuantity * product.price,
          0
        ),
        client: selectedClient,

        pointsOver50Dollars: 0,
        pointsOver100Dollars: 0,
        totalPoints: 0,
      }));

    setPoints(lastTransaction);
    pointsAreCounted && setLastTransactionIsSet(true);
  };

  const addTransaction = () => {
    lastTransaction !== {} &&
      lastTransactionIsSet &&
      setTransactions((allTransactions) => [
        ...allTransactions,
        lastTransaction,
      ]);

    lastTransactionIsSet && setAddedProducts([]);
  };

  const getClientTransactions = (selectedClient, transactions) => {
    if (transactions.length) {
      const filteredClientTransactions = transactions.filter(
        (transaction) => transaction.client.id === selectedClient.id
      );
      setClientTransactions(filteredClientTransactions);
    }
  };

  const getClientLastThreeMonthsTransactions = (
    selectedClient,
    clientTransactions
  ) => {
    if (clientTransactions.length) {
      //find last newest record to get it's date
      let lastDate = new Date(
        clientTransactions.reduce(function (a, b) {
          return a.date > b.date ? a : b;
        }).date
      );

      const last3monthsClientTransactionsArray = clientTransactions.filter(
        (transaction) => {
          return (
            transaction.date <
              new Date(lastDate.getFullYear(), lastDate.getMonth(), 3) <
              new Date(transaction.date) &&
            new Date(transaction.date) <=
              new Date(lastDate.getFullYear(), lastDate.getMonth() + 3, 0)
          );
        }
      );

      const filteredByClient3MonthsTransactions =
        last3monthsClientTransactionsArray.filter(
          (transaction) => transaction.client.id === selectedClient.id
        );

      // sum of points in 3 last months from the last record
      let result = filteredByClient3MonthsTransactions.reduce(function (
        sum,
        transaction
      ) {
        return (
          (isNaN(parseFloat(sum)) ? 0 : parseFloat(sum)) +
          (new Date(lastDate.getFullYear(), lastDate.getMonth(), 3) <
            new Date(transaction.date) &&
          new Date(transaction.date) <=
            new Date(lastDate.getFullYear(), lastDate.getMonth() + 3, 0)
            ? parseFloat(transaction.totalPoints)
            : 0)
        );
      },
      0);

      setTotalPointsLast3MonthsClientTransactions(result);
      setClientLastThreeMonthsTransactions(filteredByClient3MonthsTransactions);
    }
  };

  const handleSelectClient = (e) => {
    if (e.target.value === "") {
      setIsSelectedClientSet(false);
    } else {
      const clientId = [...e.target.value].pop();

      const selectedClient = clients.filter(
        (client) => client.id === Number(clientId)
      );

      setSelectedClient(selectedClient[0]);
      setIsSelectedClientSet(true);
    }
  };

  useEffect(() => {
    getClients();
    getProducts();
    getTransactions();
  }, []);

  useEffect(() => {
    getClientTransactions(selectedClient, transactions);
  }, [selectedClient, transactions]);

  useEffect(() => {
    getClientLastThreeMonthsTransactions(selectedClient, clientTransactions);
  }, [selectedClient, clientTransactions]);

  return (
    <div>
      <div>
        <h2>Client</h2>
        <label htmlFor="client-select">Choose a Client:</label>

        <select name="clients" id="client-select" onChange={handleSelectClient}>
          <option value="">--Please choose a Client--</option>
          {clients.length && !areClientsLoading
            ? clients.map((client) => (
                <option key={client.id} value={`client_${client.id}`}>
                  {client.name}
                </option>
              ))
            : null}
        </select>
      </div>

      <div className="products">
        <h2 className="products__panelTitle">Products</h2>
        {productsAreLoading ? (
          <NoData message={"Loading products..."} icon={""} />
        ) : !products.length && !productsAreLoading ? (
          <NoData message={error} icon={""} />
        ) : (
          products.map((product, index) => {
            return (
              <Product
                key={product.id}
                index={index}
                product={product}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                addItem={addItem}
              />
            );
          })
        )}
      </div>

      <div className="order">
        <h2 className="order__panelTitle">
          {!isSelectedClientSet ||
          selectedClient.id === null ||
          selectedClient.id === undefined
            ? "Unknown Client Order (reset when is confirmed)"
            : `${selectedClient.name}'s Order (reset when is confirmed)`}
        </h2>
        {!addedProducts.length ? (
          <NoData message={"There is no added product now"} icon={""} />
        ) : (
          <div>
            <Order
              addedProducts={addedProducts}
              selectedClient={selectedClient}
              createLastTransactionObject={createLastTransactionObject}
              lastTransactionIsSet={lastTransactionIsSet}
              addTransaction={addTransaction}
              removeAddedProduct={removeAddedProduct}
            />
          </div>
        )}
      </div>

      <div>
        <h2>All Transactions (All Clients)</h2>
        {areTransactionsLoading ? (
          "Loading transactions..."
        ) : !transactions.length ? (
          <NoData message="There is no transaction" />
        ) : (
          <Transactions transactions={transactions} />
        )}
      </div>

      <div>
        <h2 className="order__panelTitle">
          {!isSelectedClientSet ||
          selectedClient.id === null ||
          selectedClient.id === undefined
            ? "Unknown Client Transactions"
            : `${selectedClient.name}'s Transactions`}
        </h2>
        {!clientTransactions.length ? (
          <NoData message="There is no transaction for this Client" />
        ) : (
          <Transactions transactions={clientTransactions} />
        )}
      </div>

      <div>
        <h2 className="order__panelTitle">
          {!isSelectedClientSet ||
          selectedClient.id === null ||
          selectedClient.id === undefined
            ? "Unknown Client Last 3 month Transactions (from last record)"
            : `${selectedClient.name}'s Last 3 month Transactions (from last record)`}
        </h2>
        {!clientLastThreeMonthsTransactions.length ? (
          <NoData message="There is no last 3 month transaction for this Client" />
        ) : (
          <div>
            <strong>Total Points:</strong>
            <em>{totalPointsLast3MonthsClientTransactions}</em>
            <Transactions transactions={clientLastThreeMonthsTransactions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
