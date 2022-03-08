import React, { useState, useEffect } from "react";
import axios from "axios";
import { countScore } from "./functions/countScore";
import { getDate } from "./functions/getDate";
import Transactions from "./components/Transactions";
import Order from "./components/Order";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Info from "./components/Info";
import ClientSelect from "./components/ClientSelect";
import Products from "./components/Products";
import AlertInfo from "./components/AlertInfo";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";
import "./css/style.css";

const apiProducts = `http://localhost:5000/products`;
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
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" style={{ marginTop: 40, marginBottom: 40 }}>
        <Info />
        <ClientSelect
          handleSelectClient={handleSelectClient}
          clients={clients}
          areClientsLoading={areClientsLoading}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
        />
        {productsAreLoading ? (
          <AlertInfo message={"Loading products..."} severity={"info"} />
        ) : !products.length && !productsAreLoading ? (
          <AlertInfo message={error} severity={"error"} />
        ) : (
          <Paper style={{ marginTop: 30 }}>
            <Typography
              variant="h5"
              component="h1"
              style={{ padding: 10, color: "rgb(25, 118, 210)" }}
            >
              Products
            </Typography>
            <Products
              products={products}
              productsAreLoading={productsAreLoading}
              error={error}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              addItem={addItem}
            />
          </Paper>
        )}

        <Paper style={{ marginTop: 30, marginBottom: 10 }}>
          {!isSelectedClientSet ||
          selectedClient.id === null ||
          selectedClient.id === undefined ? (
            <div>
              <Typography
                variant="h5"
                component="h1"
                style={{ padding: 10, color: "rgb(25, 118, 210)" }}
              >
                Unknown Client Order
              </Typography>
              <Typography
                variant="h8"
                gutterBottom
                component="div"
                style={{
                  padding: 10,
                  paddingTop: 0,
                  color: "rgb(25, 118, 210)",
                }}
              >
                (reset when order is confirmed)
              </Typography>
            </div>
          ) : (
            <div>
              <Typography
                variant="h5"
                component="h1"
                style={{ padding: 10, color: "rgb(25, 118, 210)" }}
              >
                {" "}
                {selectedClient.name}'s Order{" "}
              </Typography>
              <Typography
                variant="h8"
                gutterBottom
                component="div"
                style={{
                  padding: 10,
                  paddingTop: 0,
                  color: "rgb(25, 118, 210)",
                }}
              >
                (reset when order is confirmed)
              </Typography>
            </div>
          )}

          {!addedProducts.length ? (
            <AlertInfo
              message={"There is no added product now"}
              severity={"info"}
            />
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
        </Paper>

        <Paper style={{ marginTop: 30, marginBottom: 10 }}>
          <Typography
            variant="h5"
            component="h1"
            style={{ padding: 10, color: "rgb(25, 118, 210)" }}
          >
            All Transactions
          </Typography>
          <Typography
            variant="h8"
            gutterBottom
            component="div"
            style={{ padding: 10, paddingTop: 0, color: "rgb(25, 118, 210)" }}
          >
            (All Clients & dates of purchase)
          </Typography>
          {areTransactionsLoading ? (
            "Loading transactions..."
          ) : !transactions.length ? (
            <AlertInfo message="No transaction" severity={"info"} />
          ) : (
            <div>
              <Transactions transactions={transactions} />
            </div>
          )}
        </Paper>

        <Paper style={{ marginTop: 30, marginBottom: 10 }}>
          <Typography
            variant="h5"
            component="h1"
            style={{ padding: 10, color: "rgb(25, 118, 210)" }}
          >
            {!isSelectedClientSet ||
            selectedClient.id === null ||
            selectedClient.id === undefined
              ? "Unknown Client Transactions"
              : `${selectedClient.name}'s Transactions`}
          </Typography>
          {!clientTransactions.length ? (
            <AlertInfo
              message="There is no transaction for this Client"
              severity={"info"}
            />
          ) : (
            <Transactions transactions={clientTransactions} />
          )}
        </Paper>

        <Paper style={{ marginTop: 30, marginBottom: 10 }}>
          <AlertInfo
            message={
              "Change select input on the top to see other Clients' data"
            }
            severity={"warning"}
          />
          <div>
            {!isSelectedClientSet ||
            selectedClient.id === null ||
            selectedClient.id === undefined ? (
              <div>
                <Typography
                  variant="h5"
                  component="h1"
                  style={{ padding: 10, color: "rgb(25, 118, 210)" }}
                >
                  Unknown Client transactions in a 3 month period
                </Typography>
                <Typography
                  variant="h8"
                  gutterBottom
                  component="div"
                  style={{
                    padding: 10,
                    paddingTop: 0,
                    color: "rgb(25, 118, 210)",
                  }}
                >
                  (from last record)
                </Typography>
              </div>
            ) : (
              <div>
                <Typography
                  variant="h5"
                  component="h1"
                  style={{ padding: 10, color: "rgb(25, 118, 210)" }}
                >
                  {selectedClient.name}'s transactions in a 3 month period
                </Typography>
                <Typography
                  variant="h8"
                  gutterBottom
                  component="div"
                  style={{
                    padding: 10,
                    paddingTop: 0,
                    color: "rgb(25, 118, 210)",
                  }}
                >
                  (from last record)
                </Typography>
              </div>
            )}
          </div>
          {!clientLastThreeMonthsTransactions.length ? (
            <AlertInfo
              message="There is no transactions during a three month period (from last record) for this Client"
              severity={"info"}
            />
          ) : (
            <div>
              <div
                style={{ marginLeft: 10, paddingTop: 10, paddingBottom: 10 }}
              >
                <strong>Total score:</strong>
                <em>{totalScoreLast3MonthsClientTransactions.toFixed(1)}</em>
                <strong>Average score / month:</strong>
                <em>
                  {(totalScoreLast3MonthsClientTransactions / 3).toFixed(1)}
                </em>
              </div>
              <Transactions transactions={clientLastThreeMonthsTransactions} />
            </div>
          )}
        </Paper>
      </Container>
    </React.Fragment>
  );
};

export default App;
