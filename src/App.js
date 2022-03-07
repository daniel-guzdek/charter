import React, { useState, useEffect } from "react";
import axios from "axios";
import NoData from "./components/NoData";
import { countScore } from "./functions/countScore";
import { getDate } from "./functions/getDate";
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
  const [transactions, setTransactions] = useState([]);
  const [areTransactionsLoading, setAreTransactionsLoading] = useState(true);
  const [clientTransactions, setClientTransactions] = useState([]);
  const [
    clientLastThreeMonthsTransactions,
    setClientLastThreeMonthsTransactions,
  ] = useState([]);
  const [
    totalScoreLast3MonthsClientTransactions,
    setTotalScoreLast3MonthsClientTransactions,
  ] = useState({});
  const [error, setError] = useState("");
  let scoreIsCounted = false;

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
    scoreIsCounted = false;

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
    scoreIsCounted = false;

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

  const createLastTransactionObject = () => {
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
        totalPoints: countScore(addedProducts, scoreIsCounted),
      }));

    setLastTransactionIsSet(true);
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
      //find the newest record to get its date
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

      setTotalScoreLast3MonthsClientTransactions(result);
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
      <div className="info">
        <p>
          1. To get data from the API, run the command in the terminal:
          <code>npm run server</code>or<code>yarn server</code>
        </p>
      </div>
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
          <NoData message={"Loading products..."} />
        ) : !products.length && !productsAreLoading ? (
          <NoData message={error} />
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
            ? "Unknown Client Order (reset when order is confirmed)"
            : `${selectedClient.name}'s Order (reset when order is confirmed)`}
        </h2>
        {!addedProducts.length ? (
          <NoData message={"There is no added product now"} />
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
        <em>Change select input on the top to see other Clients' data</em>
        <h2 className="order__panelTitle">
          {!isSelectedClientSet ||
          selectedClient.id === null ||
          selectedClient.id === undefined
            ? "Unknown Client transactions during a three month period (from last record)"
            : `${selectedClient.name}'s transactions during a three month period (from last record)`}
        </h2>
        {!clientLastThreeMonthsTransactions.length ? (
          <NoData message="There is no transactions during a three month period (from last record) for this Client" />
        ) : (
          <div>
            <strong>Total score:</strong>
            <em>{totalScoreLast3MonthsClientTransactions.toFixed(1)}</em>
            <strong>Average score / month:</strong>
            <em>{(totalScoreLast3MonthsClientTransactions / 3).toFixed(1)}</em>
            <Transactions transactions={clientLastThreeMonthsTransactions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
