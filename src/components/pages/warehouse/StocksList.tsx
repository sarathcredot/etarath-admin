import _, { capitalize } from "lodash";
import React, { Dispatch, useCallback, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "src/components/common/Pagination";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";
import Loader from "src/components/features/loader";
import PtSwitch from "src/components/features/elements/switch";
import { generateFilePath } from "src/services/url.service";
import { debounce } from "lodash";

import {
  useDeleteStock,
  useGetStocksByProductId,
  useUpdateStock,
  useUpdateWaerehouseStockQt,
  useUpdateWaerehouseStockStatus,
} from "src/services/stock.service";
import {
  StockEditValidationSchema,
  StockValidationSchema,
} from "src/validations/validationSchemas";
import { useFormik } from "formik";
import Select from "react-select";
import {
  useGetAllVendors,
  useGetStocksByVendorId,
} from "src/services/vendor.service";
import { errorMsg } from "src/utils/toast";
// import AddStock from "./popups/AddStock";

const StocksList = ({
  stocks,
  stocksLoading = false,
  waerhouseId,
  vendorId,
  setPage = () => { },
  setSearch = () => { }, // fallback so debounce doesn’t break
  setLimit,
  page = 1,
  limit = 10,
  search = "",

}: {
  vendorId?: any;
  waerhouseId?: any
  stocks: any;
  stocksLoading: boolean;
  setPage?: Dispatch<React.SetStateAction<number>>;
  setLimit?: Dispatch<React.SetStateAction<number>>;
  setSearch?: Dispatch<React.SetStateAction<any>>;
  page?: number;
  limit?: number;
  search?: string;

}) => {
  const navigate = useNavigate();

  //STATES
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [isAddOpen, setAddOpen] = useState<boolean>(false);
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [isEditOpenQt, setEditOpenQt] = useState<boolean>(false);



  // MUTATION
  const { mutateAsync: deleteStock } = useDeleteStock();
  const { mutateAsync: updateStock } = useUpdateStock();

  const { mutateAsync: updateStatus } = useUpdateWaerehouseStockStatus();
  const { mutateAsync: updateQt } = useUpdateWaerehouseStockQt();


  //FORMINK
  const formik = useFormik({
    initialValues: {
      // stock: "",
      price_normal_customer: "",
      price_loyal_customer: "",
      warrantyPeriod: "",
      stock: "",
    },
    validationSchema: StockEditValidationSchema,

    onSubmit: (values) => {
      console.log(values, "VALUES");
      handleEditStock(values);
    },
  });
  //HANDLERS
  const handleEditStock = async (values: any) => {
    try {
      const res = await updateStock({
        stockId: selectedStock?._id,
        data: values,
      });
      console.log(res, "= = = RESPONSE  ");
      toast(res?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });
      formik.resetForm();
      setEditOpen(false);
      setSelectedStock(null);
    } catch (error: any) {
      toast(_.capitalize(errorMsg(error).toLowerCase()), {
        containerId: "default",
        className: "no-icon notification-danger",
      });
    }
  };
  const handleDeleteStock = async () => {
    try {
      if (selectedStock && selectedStock?._id) {
        const res = await deleteStock(selectedStock?._id);
        if (res) {
          toast(res?.data?.message, {
            containerId: "default",
            className: "no-icon notification-success",
          });

          setDeleteOpen(false);
        }
      } else {
        toast("Stock ID is missing. Unable to delete the stock.", {
          containerId: "default",
          className: "no-icon notification-danger",
        });
      }
    } catch (error: any) {
      console.log("error deleting stock :", error);
      toast(
        error?.response?.data?.message ||
        "Something went wrong while deleting the stock.",
        {
          containerId: "default",
          className: "no-icon notification-danger",
        }
      );
    }
  };

  const totalRecords = stocks?.total || 0;
  const totalPages = stocks?.totalPages || 0;



  const debouncedHandleSearch = useCallback(
    debounce((text) => {
      try {
        setSearch(text);
      } catch (error) {
        console.log(error, "error in the debounce function");
      }
    }, 1000),
    []
  );


  const stockFormik = useFormik({
    initialValues: {
      stock: "",

    },


    onSubmit: (values) => {
      console.log(values, "VALUES");
      handleChangeQt(values);
    },
  });


  useEffect(() => {
    if (isEditOpenQt && selectedStock) {

      const waerhouse = selectedStock?.availableWarehouses.find((item: any) => item?.warehouseId.toString() === waerhouseId?.toString())

      console.log("stock", waerhouse)

      stockFormik.setValues({
        stock: waerhouse?.stock ? waerhouse?.stock : "",

      });
    }
  }, [isEditOpenQt, selectedStock]);



  const handleChangeStatus = async (proid: any, status: any) => {
    try {

      // console.log("update status", warehouse)


      const resp = await updateStatus({
        productId: proid,
        waerehousesId: waerhouseId,
        status: !status,
      });

      // setSelectedWaer(null);
      // setStatusOpen(false);
      toast(resp?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });
    } catch (error) {
      toast("Can't update Retailer right now, please try later!", {
        containerId: "default",
        className: "no-icon notification-danger",
      });
      // setStatusOpen(false);
    }
  };


  const handleChangeQt = async (warehouse: any) => {
    try {

      console.log("update qt", selectedStock)


      const resp = await updateQt({
        productId: selectedStock?._id,
        waerehousesId: waerhouseId,
        stock: stockFormik.values.stock
      });

      stockFormik.resetForm();
      setSelectedStock(null);
      setEditOpenQt(false);
      toast(resp?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });
    } catch (error) {
      toast("Can't update stock right now, please try later!", {
        containerId: "default",
        className: "no-icon notification-danger",
      });
      stockFormik.resetForm();
      setSelectedStock(null);
      setEditOpen(false);
    }
  };



  return (
    <>
      <div className="">
        <Row>
          <Col>
            {/* <Card className="card-modern"> */}
            {/* <Card.Body> */}
            <div className="datatables-header-footer-wrapper">
              <div className="datatable-header">
                <Row className="align-items-lg-center justify-content-end mb-3">
                  <Col>
                    <h5 className="m-0 card-title h5 font-weight-bold">
                      Products
                    </h5>
                  </Col>

                  {/* <Col
                        lg="auto"
                        className="mb-2 mb-lg-0 ml-xl-auto pl-xl-1"
                      >
                        <div className="d-flex align-items-lg-center flex-wrap">
                          <Form.Label className="d-none d-xl-block ws-nowrap mr-3 mb-0">Filter By:</Form.Label>
                          <Form.Control
                            as="select"
                            className="select-style-1 filter-by w-auto my-1 mr-2"
                            // value={role}
                            // onChange={(e) => setRole(e.target.value)}
                          >
                            <option value="">All</option>
                            <option value="">Football</option>
                            <option value="">Cricket</option>
                          </Form.Control>
                          <Button
                            type="submit"
                            className="filter-btn my-1"
                            variant="primary"
                          >
                            Filter
                          </Button>
                        </div>
                      </Col> */}
                  <Col className="col-auto pl-lg-1">
                    <div className="search search-style-1 mx-lg-auto w-auto">
                      <InputGroup>
                        <Form.Control
                          type="text"
                          className="search-term"
                          placeholder="Search "
                          style={{ width: "250px" }}
                          value={search}
                          onChange={(e) =>
                            debouncedHandleSearch(e.target.value)
                          }
                        />
                        {/* <InputGroup.Append> */}
                        {/* <Button
                              variant="default"
                              type="submit"
                            >
                              <i className="bx bx-search"></i>
                            </Button> */}
                        {/* </InputGroup.Append> */}
                      </InputGroup>
                    </div>
                  </Col>
                  <Col xl="auto" className="mb-2 mt-1 mb-xl-0">
                    {
                      vendorId && <Button
                        className="font-weight-semibold"
                        variant="dark"
                        //   size="md"
                        onClick={() => setAddOpen(true)}
                      >
                        + Add
                      </Button>
                    }
                  </Col>
                </Row>
              </div>
              <Form onSubmit={formik.handleSubmit}>
                <Table
                  className="table-ecommerce-simple mb-0"
                  responsive="xl"
                  striped
                  // bordered
                  style={{ minWidth: "600px" }}
                >
                  <thead>
                    <tr>
                      <th style={{ width: "30px" }}>#</th>
                      <th
                        // className="text-center"
                        style={{ width: "80px" }}
                      >
                        Product
                      </th>
                      <th></th>
                      {/* <th>Quantity</th> */}
                      <th>General Sale Price</th>
                      <th>Loyal Customer Price</th>
                      <th>Warranty Period</th>
                      <th>Quanty </th>
                      <th>Status</th>
                      <th className="text-center" style={{ width: "80px" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocksLoading ? (
                      <tr>
                        <td colSpan={9}>
                          <Loader />
                        </td>
                      </tr>
                    ) : !stocksLoading &&
                      stocks &&
                      stocks?.result?.length > 0 ? (
                      stocks?.result?.map((item: any, index: number) => (
                        <tr
                          key={index}
                          // onClick={() =>
                          //   !isEditOpen &&
                          //   navigate(`/stock/detail?_id=${item?._id}`)
                          // }
                          style={{ cursor: "pointer" }}
                        >
                          <td>

                            {index + 1}
                            {/* <Link to={`/stock/detail?_id=${item?._id}`}>
                              <strong>
                               
                                {index + 1}
                              </strong>
                            </Link> */}
                          </td>
                          <td>
                            {/* <Link
                              style={{ width: "50px", height: "50px" }}
                              className="d-flex align-items-center justify-content-center"
                              onClick={(e) => e.stopPropagation()}
                              to={`/products/detail?_id=${item?.productDetails?._id}`}
                            > */}
                            <img
                              className="mr-1"
                              src={generateFilePath(
                                item?.productDetails?.imageUrl[0]
                              )}
                              // src={item?.imageUrl[0]}
                              alt="product"
                              width="40"
                              height="40"
                            // crossOrigin="anonymous"
                            />
                            {/* </Link> */}
                          </td>
                          <td>
                            <Link

                              to={`/stock/detail?_id=${item?._id}`}
                              style={{ textDecoration: "none", color: "inherit" }}
                            >

                              <strong>
                                {item?.productDetails?.productName}-{" "}
                                {`${item?.productDetails?.width}${item?.productDetails?.height
                                  ? `/${item?.productDetails?.height}`
                                  : ""
                                  } R${item?.productDetails?.size}`}
                              </strong>


                            </Link>
                          </td>
                          {/* {isEditOpen &&
                          selectedStock &&
                          selectedStock?._id === item?._id ? (
                            <td>
                              <div className="stock_edit">
                                <button
                                  type="button"
                                  onClick={() => {
                                    Number(formik.values.stock) > 1 &&
                                      formik.setFieldValue(
                                        "stock",
                                        (
                                          Number(formik.values.stock) - 1
                                        ).toString()
                                      );
                                  }}
                                >
                                  -
                                </button>
                                <Form.Control
                                  type="number"
                                  placeholder="00"
                                  name="stock"
                                  value={formik.values.stock}
                                  onChange={formik.handleChange}
                                  isInvalid={
                                    !!formik.errors.stock &&
                                    formik.touched.stock
                                  }
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    formik.setFieldValue(
                                      "stock",
                                      (
                                        Number(formik.values.stock) + 1
                                      ).toString()
                                    );
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                          ) : (
                            <td>
                              <Link to={`/stock/detail?_id=${item?._id}`}>
                                {item?.stock}
                              </Link>
                            </td>
                          )} */}
                          {isEditOpen &&
                            selectedStock &&
                            selectedStock?._id === item?._id ? (
                            <td onClick={(e) => e.stopPropagation()}>
                              <div style={{ width: "90%" }}>
                                <Form.Group
                                  as={Row}
                                  className="align-items-center"
                                >
                                  <Form.Control
                                    type="number"
                                    placeholder="Enter sale price"
                                    name="price_normal_customer"
                                    value={formik.values.price_normal_customer}
                                    onChange={formik.handleChange}
                                    isInvalid={
                                      !!formik.errors.price_normal_customer &&
                                      formik.touched.price_normal_customer
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors.price_normal_customer}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </div>
                            </td>
                          ) : (
                            <td>{item?.price_normal_customer} AED</td>
                          )}
                          {isEditOpen &&
                            selectedStock &&
                            selectedStock?._id === item?._id ? (
                            <td onClick={(e) => e.stopPropagation()}>
                              <div style={{ width: "90%" }}>
                                <Form.Group
                                  as={Row}
                                  className="align-items-center"
                                >
                                  <Form.Control
                                    type="number"
                                    placeholder="price for loyal customers"
                                    name="price_loyal_customer"
                                    value={formik.values.price_loyal_customer}
                                    onChange={formik.handleChange}
                                    isInvalid={
                                      !!formik.errors.price_loyal_customer &&
                                      formik.touched.price_loyal_customer
                                    }
                                    step="any"
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors.price_loyal_customer}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </div>
                            </td>
                          ) : (
                            <td>{item?.price_loyal_customer} AED</td>
                          )}
                          {isEditOpen &&
                            selectedStock &&
                            selectedStock?._id === item?._id ? (
                            <td onClick={(e) => e.stopPropagation()}>
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  gap: 10,
                                }}
                              >
                                <div className="d-flex">
                                  <Form.Group
                                    as={Row}
                                    className="align-items-center mx-0"
                                  >
                                    <Form.Control
                                      type="number"
                                      placeholder="Enter warranty period"
                                      name="warrantyPeriod"
                                      value={formik.values.warrantyPeriod}
                                      onChange={formik.handleChange}
                                      isInvalid={
                                        !!formik.errors.warrantyPeriod &&
                                        formik.touched.warrantyPeriod
                                      }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {formik.errors.warrantyPeriod}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </div>
                                <div className="d-flex">
                                  {/* <Form.Group className="align-items-center">
                                    <Form.Control
                                      style={{ color: "#000" }}
                                      //   size="md"
                                      as="select"
                                      name="warranty_type"
                                      value={formik.values.warranty_type}
                                      onChange={(e) =>
                                        formik.setFieldValue(
                                          "warranty_type",
                                          e.target.value
                                        )
                                      }
                                      isInvalid={
                                        !!formik.errors.warranty_type &&
                                        formik.touched.warranty_type
                                      }
                                    >
                                      <option disabled selected hidden value="">
                                        Select Type
                                      </option>
                                      {["month", "year"].map(
                                        (item: string, index: number) => (
                                          <option key={index} value={item}>
                                            {capitalize(item)}
                                          </option>
                                        )
                                      )}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                      {formik.errors.warranty_type}
                                    </Form.Control.Feedback>
                                  </Form.Group> */}
                                </div>
                              </div>
                            </td>
                          ) : (
                            <td>
                              {item?.warrantyPeriod}{" "}
                              {capitalize(item?.warranty_type)}
                            </td>

                          )}
                          <td>
                            {isEditOpenQt &&
                              selectedStock?._id === item?._id ?
                              (
                                <Form.Group as={Row} className="align-items-center">
                                  <Form.Control
                                    type="number"
                                    placeholder="Enter stock"
                                    name="stock"
                                    value={stockFormik.values.stock}
                                    onChange={stockFormik.handleChange}
                                    isInvalid={!!stockFormik.errors.stock && stockFormik.touched.stock}
                                    step="any"
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {stockFormik.errors.stock}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              ) : (
                                item?.availableWarehouses?.find(
                                  (data: any) =>
                                    data?.warehouseId?.toString() === waerhouseId?.toString()
                                )?.stock ?? "-"
                              )}
                          </td>

                          <td>
                            {(() => {
                              const warehouse = item?.availableWarehouses?.find(
                                (data: any) =>
                                  data?.warehouseId?.toString() === waerhouseId?.toString()
                              );

                              return warehouse ? (
                                <div
                                  onClick={() => { handleChangeStatus(item?._id, warehouse?.status) }}
                                  className="d-flex align-items-center">
                                  <PtSwitch
                                    className="mr-2"
                                    on={warehouse?.status}
                                    size="sm"
                                    variant="success"
                                  />
                                </div>
                              ) : null;
                            })()}
                          </td>

                          {/* <td>
                            <div
                              className="action_btn"
                              onClick={() => {
                                setSelectedStock(item);
                                setEditOpen(true);
                              }}
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </div>
                          </td> */}

                          <td onClick={(e) => e.stopPropagation()}>
                            <div className="d-flex align-items-center justify-content-around">
                              {isEditOpenQt &&
                                selectedStock?._id === item?._id ?

                                (
                                  <>
                                    <button onClick={() => { stockFormik.submitForm() }} className="action_btn" type="submit">
                                      <i className="fas fa-check"></i>
                                    </button>
                                    <div
                                      className="action_btn"
                                      onClick={() => {
                                        stockFormik.resetForm();
                                        setSelectedStock(null);
                                        setEditOpenQt(false);
                                      }}
                                    >
                                      <i className="fas fa-x-mark"></i>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className="action_btn"
                                      onClick={() => {
                                        setSelectedStock(item);
                                        setEditOpenQt(true);
                                      }}
                                    >
                                      <i className="fas fa-pencil-alt"></i>
                                    </div>
                                    {/* <div
                                  className="action_btn"
                                  onClick={() => {
                                    setSelectedStock(item);
                                    setDeleteOpen(true);
                                  }}
                                >
                                  <i className="far fa-trash-alt"></i>
                                </div> */}
                                  </>
                                )}
                            </div>
                          </td>






                          {/* <td>
                            <div
                              className={`ecommerce-status ${item?.isVerified}`}
                            >
                              {item?.isVerified}
                            </div>
                          </td> */}

                          {/* <td onClick={(e) => e.stopPropagation()}>
                            <div
                              className="d-flex align-items-center"
                            // onClick={() => {
                            //   setStatusOpen(true);
                            // }}
                            >
                              <PtSwitch
                                className="mr-2"
                                on={!item?.isSuspend}
                                size="sm"
                                variant="success"
                              />
                            </div>
                          </td> */}
                          {/* <td onClick={(e) => e.stopPropagation()}>
                            <div className="d-flex align-items-center justify-content-around">
                              {isEditOpen &&
                                selectedStock &&
                                selectedStock?._id === item?._id ? (
                                <>
                                  <button className="action_btn" type="submit">
                                    <i className="fas fa-check"></i>
                                  </button>
                                  <div
                                    className="action_btn"
                                    onClick={() => {
                                      formik.resetForm();
                                      setSelectedStock(null);
                                      setEditOpen(false);
                                    }}
                                  >
                                    <i className="fas fa-x-mark"></i>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div
                                    className="action_btn"
                                    onClick={() => {
                                      setSelectedStock(item);
                                      setEditOpen(true);
                                    }}
                                  >
                                    <i className="fas fa-pencil-alt"></i>
                                  </div>
                                  <div
                                    className="action_btn"
                                    onClick={() => {
                                      setSelectedStock(item);
                                      setDeleteOpen(true);
                                    }}
                                  >
                                    <i className="far fa-trash-alt"></i>
                                  </div>
                                </>
                              )}
                            </div>
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={9}
                          style={{ textAlign: "center", height: "100px" }}
                        >
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Form>
            </div>
            <Pagination
              currentPage={page}
              setCurrentPage={setPage}
              totalButtonsToShow={3}
              totalPages={totalPages}
              style={{ marginTop: "20px" }}
            />
            {/* </Card.Body>
            </Card> */}
          </Col>
        </Row>
      </div>
      <ConfirmationPopup
        submit={() => handleDeleteStock()}
        isOpen={isDeleteOpen}
        toggle={() => setDeleteOpen(!isDeleteOpen)}
        text={"Are you sure that you want to delete this stock?"}
      />
      {/* <AddStock
        vendorId={vendorId}
        isOpen={isAddOpen}
        toggle={() => setAddOpen(!isAddOpen)}
      /> */}
    </>
  );
};

export default StocksList;
