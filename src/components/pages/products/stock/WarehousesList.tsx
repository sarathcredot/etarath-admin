import _, { capitalize, debounce } from "lodash";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Loader from "src/components/features/loader";
import { generateFilePath } from "src/services/url.service";
import dayjs from "dayjs";
import { useGetAllVendorWarehouses } from "src/services/warehouse.service";
import Pagination from "src/components/common/Pagination";
import PtSwitch from "src/components/features/elements/switch";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";
import { toast } from "react-toastify";
// import AddWarehouse from "./popups/AddWarehouse";
import { useUpdateWaerehouseStockStatus, useUpdateWaerehouseStockQt } from "src/services/stock.service"
import { Formik, useFormik } from "formik";
import { stockQtvalidation } from "src/validations/validationSchemas"

const WarehousesList = ({

  vendorId,
  warehouses,
  setPage = () => { },
  setSearch = () => { }, // fallback so debounce doesn’t break
  setFilter = () => { }, // fallback so debounce doesn’t break
  setLimit,
  page = 1,
  limit = 10,
  search = "",
  warehousesLoading

}: {
  vendorId: any;
  warehouses: any
  warehousesLoading: any
  setPage?: Dispatch<React.SetStateAction<number>>;
  setLimit?: Dispatch<React.SetStateAction<number>>;
  setSearch?: Dispatch<React.SetStateAction<any>>;
  setFilter?: Dispatch<React.SetStateAction<any>>;
  page?: number;
  limit?: number;
  search?: string;

}) => {
  const navigate = useNavigate();

  //STATES
  const [isAddOpen, setAddOpen] = useState<boolean>(false);
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<any>()

  const [isStatusOpen, setStatusOpen] = useState<boolean>(false);
  const [selectedWaer, setSelectedWaer] = useState<any>()

  const { mutateAsync: updateStatus } = useUpdateWaerehouseStockStatus();
  const { mutateAsync: updateQt } = useUpdateWaerehouseStockQt();


  //HANDLERS
  const handleChangeStatus = async (warehouse: any) => {
    try {

      console.log("update status", warehouse)


      const resp = await updateStatus({
        productId: warehouse?._id,
        waerehousesId: warehouse?.availableWarehouses?.warehouseId,
        status: !warehouse?.availableWarehouses?.status,
      });

      setSelectedWaer(null);
      setStatusOpen(false);
      toast(resp?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });
    } catch (error) {
      toast("Can't update Retailer right now, please try later!", {
        containerId: "default",
        className: "no-icon notification-danger",
      });
      setStatusOpen(false);
    }
  };


  const handleChangeQt = async (warehouse: any) => {
    try {

      console.log("update qt", selectedStock)


      const resp = await updateQt({
        productId: selectedStock?._id,
        waerehousesId: selectedStock?.availableWarehouses?.warehouseId,
        stock: formik.values.stock
      });

      formik.resetForm();
      setSelectedStock(null);
      setEditOpen(false);
      toast(resp?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });
    } catch (error) {
      toast("Can't update stock right now, please try later!", {
        containerId: "default",
        className: "no-icon notification-danger",
      });
      formik.resetForm();
      setSelectedStock(null);
      setEditOpen(false);
    }
  };

  // QUERIES




  const totalRecords = warehouses?.total || 0;
  const totalPages = warehouses?.totalPages || 0;

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

  const debouncedHandleFilter = useCallback(
    debounce((text) => {
      try {
        setFilter(text);
      } catch (error) {
        console.log(error, "error in the debounce function");
      }
    }, 1000),
    []
  );


  const formik = useFormik({
    initialValues: {
      stock: 0
    },
    validationSchema: stockQtvalidation,
    onSubmit: (values) => {
      console.log(values, "VALUES");

      handleChangeQt(values)
    },

  })


  useEffect(() => {

    console.log("qt edit", selectedStock)
    formik.setValues({ stock: selectedStock?.availableWarehouses?.stock })

  }, [isEditOpen, selectedStock])


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
                      Warehouses
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
                      </InputGroup>
                    </div>
                  </Col>
                  <Col xl="auto" className="mb-2 mt-1 mb-xl-0">
                    {/* <Button
                      className="font-weight-semibold"
                      variant="dark"
                      onClick={() => setAddOpen(true)}
                    >
                      + Add
                    </Button> */}
                  </Col>
                </Row>
              </div>

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
                      Warehouses
                    </th>
                    <th></th>
                    <th>location</th>

                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span>Quantity</span>

                        <Form.Control
                          as="select"
                          size="sm"
                          style={{
                            width: "110px",
                            color: "#000",
                          }}
                          name="issuspend"
                          onChange={(e: any) =>
                            debouncedHandleFilter(e.target.value)
                          }
                        >
                          <option value="all">All</option>
                          <option value="high">High</option>
                          <option value="low">Low</option>
                        </Form.Control>
                      </div>
                    </th>
                    <th>Status</th>
                    <th className="text-center" style={{ width: "80px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {warehousesLoading ? (
                    <tr>
                      <td colSpan={9}>
                        <Loader />
                      </td>
                    </tr>
                  ) : !warehousesLoading &&
                    warehouses &&
                    warehouses?.result?.length > 0 ? (
                    warehouses?.result?.map((item: any, index: number) => (
                      <tr
                        key={index}

                      >
                        <td>

                          {index + 1}

                        </td>
                        <td>

                          <img
                            className="mr-1"
                            src={generateFilePath(
                              item?.warehouseDetails?.shop_photo_logo
                            )}
                            // src={item?.imageUrl[0]}
                            alt="product"
                            width="40"
                            height="40"
                          // crossOrigin="anonymous"
                          />

                        </td>
                        <td
                          onClick={() => { navigate(`/warehouses/detail?_id=${item?.availableWarehouses?.warehouseId}&vendorId=${item?.requestedBy}`) }}
                          style={{ cursor: "pointer" }}
                        >
                          <strong>
                            {item?.warehouseDetails?.shop_name}
                          </strong>
                        </td>

                        <td>

                          {item?.warehouseDetails?.location}

                        </td>

                        {/* <td>

                          {item?.availableWarehouses?.stock}

                        </td> */}

                        {isEditOpen &&
                          selectedStock &&
                          selectedStock?.availableWarehouses?.warehouseId === item?.availableWarehouses?.warehouseId ? (
                          <td onClick={(e) => e.stopPropagation()}>
                            <div style={{ width: "90%" }}>
                              <Form.Group
                                as={Row}
                                className="align-items-center"
                              >
                                <Form.Control
                                  type="number"
                                  placeholder="Enter stock"
                                  name="stock"
                                  value={formik.values.stock}
                                  onChange={formik.handleChange}
                                  isInvalid={
                                    !!formik.errors.stock &&
                                    formik.touched.stock
                                  }
                                />
                                <Form.Control.Feedback type="invalid">
                                  {formik.errors.stock}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </div>
                          </td>
                        ) : (
                          <td>{item?.availableWarehouses?.stock}</td>
                        )}

                        <td onClick={(e) => e.stopPropagation()}>
                          <div
                            className="d-flex align-items-center"
                            onClick={() => {
                              setStatusOpen(true);
                              setSelectedWaer(item)
                            }}
                          >
                            <PtSwitch
                              className="mr-2"
                              on={item?.availableWarehouses?.status}
                              size="sm"
                              variant="success"
                            />
                          </div>
                        </td>


                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="d-flex align-items-center justify-content-around">
                            {isEditOpen &&
                              selectedStock &&
                              selectedStock?.availableWarehouses?.warehouseId === item?.availableWarehouses?.warehouseId ? (
                              <>
                                <button onClick={() => { formik.submitForm() }} className="action_btn" type="submit">
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
        submit={() =>
          handleChangeStatus(selectedWaer)
        }
        isOpen={isStatusOpen}
        toggle={() => setStatusOpen(!isStatusOpen)}
        text={
          "Are you sure that you want to change stock status of this warehouse?"
        }
      />

      {/* <AddWarehouse
        isOpen={isAddOpen}
        toggle={() => setAddOpen(!isAddOpen)}
        vendorId={vendorId}
      /> */}
    </>
  );
};

export default WarehousesList;
