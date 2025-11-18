import _, { capitalize } from "lodash";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "src/components/common/Pagination";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";
import Loader from "src/components/features/loader";
import PtSwitch from "src/components/features/elements/switch";
import { generateFilePath } from "src/services/url.service";
import { useDeleteStock, useUpdateStock } from "src/services/stock.service";
import { StockEditValidationSchema } from "src/validations/validationSchemas";
import { useFormik } from "formik";
import { useGetAllVendors } from "src/services/vendor.service";
import { errorMsg } from "src/utils/toast";
import AddStock from "./popups/AddStock";
import dayjs from "dayjs";

const SalesExecutivesList = ({
  orders,
  ordersLoading = false,
  vendorId,
  page = 1,
  setPage,
}: {
  vendorId: string;
  orders: any;
  ordersLoading: boolean;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}) => {
  const navigate = useNavigate();

  //STATES
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [isAddOpen, setAddOpen] = useState<boolean>(false);
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [search, setSearch] = useState<string>("");

  // MUTATION
  // const { mutateAsync: deleteStock } = useDeleteStock();
  // const { mutateAsync: updateStock } = useUpdateStock();

  //FORMINK
  const formik = useFormik({
    initialValues: {
      stock: "",
      price: "",
      warrantyPeriod: "",
      warranty_type: "",
    },
    validationSchema: StockEditValidationSchema,

    onSubmit: (values) => {
      console.log(values, "VALUES");
      // handleEditStock(values);
    },
  });
  //HANDLERS
  // const handleEditStock = async (values: any) => {
  //   try {
  //     const res = await updateStock({
  //       stockId: selectedStock?._id,
  //       data: values,
  //     });
  //     console.log(res, "= = = RESPONSE  ");
  //     toast(res?.data?.message, {
  //       containerId: "default",
  //       className: "no-icon notification-success",
  //     });
  //     formik.resetForm();
  //     setEditOpen(false);
  //     setSelectedStock(null);
  //   } catch (error: any) {
  //     toast(_.capitalize(errorMsg(error).toLowerCase()), {
  //       containerId: "default",
  //       className: "no-icon notification-danger",
  //     });
  //   }
  // };
  // const handleDeleteStock = async () => {
  //   try {
  //     if (selectedStock && selectedStock?._id) {
  //       const res = await deleteStock(selectedStock?._id);
  //       if (res) {
  //         toast(res?.data?.message, {
  //           containerId: "default",
  //           className: "no-icon notification-success",
  //         });

  //         setDeleteOpen(false);
  //       }
  //     } else {
  //       toast("Stock ID is missing. Unable to delete the stock.", {
  //         containerId: "default",
  //         className: "no-icon notification-danger",
  //       });
  //     }
  //   } catch (error: any) {
  //     console.log("error deleting stock :", error);
  //     toast(
  //       error?.response?.data?.message ||
  //         "Something went wrong while deleting the stock.",
  //       {
  //         containerId: "default",
  //         className: "no-icon notification-danger",
  //       }
  //     );
  //   }
  // };

  const totalRecords = orders?.total || 0;
  const totalPages = orders?.totalPages || 0;

  useEffect(() => {
    if (isEditOpen && selectedStock) {
      formik.setValues({
        stock: selectedStock?.stock ? selectedStock?.stock.toString() : "",
        price: selectedStock?.price ? selectedStock?.price.toString() : "",
        warrantyPeriod: selectedStock?.warrantyPeriod
          ? selectedStock?.warrantyPeriod.toString()
          : "",
        warranty_type: selectedStock?.warranty_type
          ? selectedStock?.warranty_type
          : "",
      });
    }
  }, [isEditOpen, selectedStock]);
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
                      Executives
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
                            setSearch && setSearch(e.target.value)
                          }
                        />
                      </InputGroup>
                    </div>
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
                      <th style={{ width: "80px" }}>Executive</th>
                      <th></th>
                      <th>Contact Number</th>
                      <th>Created Date</th>
                      <th>Status</th>
                      <th className="text-center" style={{ width: "80px" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersLoading ? (
                      <tr>
                        <td colSpan={9}>
                          <Loader />
                        </td>
                      </tr>
                    ) : !ordersLoading &&
                      orders &&
                      orders?.result?.length > 0 ? (
                      orders?.result?.map((item: any, index: number) => (
                        <tr key={index}>
                          <td>
                            <Link
                              to={`/sales-executives/detail?_id=${index + 1}`}
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {/* {index +
                                  (productsData?.pagination?.page - 1) *
                                    productsData?.pagination?.limit +
                                  1} */}
                              {index + 1}
                            </Link>
                          </td>
                          <td>
                            <Link
                              style={{ width: "50px", height: "50px" }}
                              className="d-flex align-items-center justify-content-center"
                              to={`/products/detail?_id=${item?.product?._id}`}
                            >
                              <img
                                className="mr-1"
                                src={generateFilePath(item?.imgUrl)}
                                // src={item?.imageUrl[0]}
                                alt="product"
                                width="40"
                                height="40"
                                crossOrigin="anonymous"
                              />
                            </Link>
                          </td>
                          <td>
                            <Link
                              to={`/stock/detail?_id=${item?.stockIdByVendor}`}
                            >
                              {item?.userName}
                            </Link>
                          </td>
                          <td>{item?.phoneNumber || "-"}</td>
                          <td>
                            {item?.createdAt
                              ? dayjs(item?.createdAt).format("DD-MM-YYYY")
                              : "-"}
                          </td>
                          <td>
                            <div
                              // onClick={() => {
                              //   setStatusOpen(true);
                              //   setSelectedVendor(item);
                              // }}
                            >
                              <PtSwitch
                                className="mr-1"
                                on={!item?.isSuspend}
                                size="sm"
                                variant="success"
                              />
                            </div>
                          </td>
                          <td>
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
      {/* <ConfirmationPopup
        submit={() => handleDeleteStock()}
        isOpen={isDeleteOpen}
        toggle={() => setDeleteOpen(!isDeleteOpen)}
        text={"Are you sure that you want to delete this stock?"}
      /> */}
    </>
  );
};

export default SalesExecutivesList;
