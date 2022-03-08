import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { getComparator } from "./../helpers/materialUITableBuildFunctions";
import { stableSort } from "./../helpers/materialUITableBuildFunctions";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import Stack from "@mui/material/Stack";

const Products = (props) => {
  const { products, increaseQuantity, decreaseQuantity, addItem } = props;

  const headCells = [
    {
      id: "serialNumber",
      numeric: false,
      disablePadding: true,
      label: "",
    },
    {
      id: "product",
      numeric: false,
      disablePadding: true,
      label: "Product",
    },
    {
      id: "selectedQuantity",
      numeric: true,
      disablePadding: false,
      label: "Selected quantity",
    },
    {
      id: "itemsLeft",
      numeric: true,
      disablePadding: false,
      label: "Items left",
    },
    {
      id: "price",
      numeric: true,
      disablePadding: false,
      label: "Price",
    },
    {
      id: "total",
      numeric: true,
      disablePadding: false,
      label: "Total Price",
    },
  ];

  function EnhancedTableHead({ classes, order, orderBy, onRequestSort }) {
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox" />
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
          <TableCell padding="checkbox" />
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
      marginTop: 0,
    },
    table: {
      minWidth: 750,
    },
    cell: {
      fontSize: 13,
      color: "#504747",
    },
    firstCell: {
      width: 20,
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
  }));

  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("product");
  const [page, setPage] = useState(0);
  const [dense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(
    products.length < 10 ? products.length : 20
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, products.length - page * rowsPerPage);

  return (
    <>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={products.length}
              />
              <TableBody>
                {stableSort(products, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product, index) => {
                    return (
                      <TableRow hover key={product.id}>
                        <TableCell
                          component="th"
                          scope="row"
                          className={classes.firstCell}
                        />
                        <TableCell
                          component="th"
                          scope="row"
                          padding="none"
                          className={classes.cell}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          padding="none"
                          className={classes.cell}
                        >
                          <Stack
                            direction="row"
                            spacing={2}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <button
                              disabled={
                                product.orderQuantity <= 0 ? true : false
                              }
                              onClick={() => decreaseQuantity(product.id)}
                            >
                              <span style={{ fontSize: 12 }}>-</span>
                            </button>
                            <span>{product.name}</span>
                            <button
                              disabled={product.amount <= 0 ? true : false}
                              onClick={() => increaseQuantity(product.id)}
                            >
                              <span style={{ fontSize: 12 }}>+</span>
                            </button>
                          </Stack>
                        </TableCell>
                        <TableCell align="right" className={classes.cell}>
                          {product.orderQuantity}
                        </TableCell>
                        <TableCell align="right" className={classes.cell}>
                          {product.amount}
                        </TableCell>
                        <TableCell align="right" className={classes.cell}>
                          {product.price + product.currency}
                        </TableCell>
                        <TableCell align="right" className={classes.cell}>
                          {product.orderQuantity === 0
                            ? product.orderQuantity
                            : (product.orderQuantity * product.price).toFixed(
                                2
                              ) + product.currency}
                        </TableCell>
                        <TableCell align="right" className={classes.cell}>
                          <button
                            disabled={
                              product.orderQuantity === 0 ? true : false
                            }
                            onClick={() => addItem(product)}
                          >
                            Add
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[
              products.length < 10 ? products.length : 1,
              5,
              10,
              25,
              50,
            ]}
            component="div"
            count={products.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </>
  );
};

export default Products;
