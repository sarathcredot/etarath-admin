import _, { capitalize, debounce } from "lodash";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
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
import { formatDate } from "src/utils/formats"

const PaymentHistoryList = ({
  paymentHistory,
  payLoading = false,
  vendorId,
  setPage = () => { },
  setSearch = () => { }, // fallback so debounce doesn’t break
  setStatus = () => { }, // fallback so debounce doesn’t break
  setLimit,
  page = 1,
  limit = 10,
  search = "",
}: {
  vendorId: any;
  paymentHistory: any;
  payLoading: boolean;
  setPage?: Dispatch<React.SetStateAction<number>>;
  setLimit?: Dispatch<React.SetStateAction<number>>;
  setSearch?: Dispatch<React.SetStateAction<any>>;
  setStatus?: Dispatch<React.SetStateAction<any>>;
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
  // const [search, setSearch] = useState<string>("");

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

  const totalRecords = paymentHistory?.total || 0;
  const totalPages = paymentHistory?.totalPages || 0;

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


  const debouncedHandleStatus = useCallback(
    debounce((text) => {
      try {
        setStatus(text);
      } catch (error) {
        console.log(error, "error in the debounce function");
      }
    }, 1000),
    []
  );


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
                          placeholder="Search subscription Id"
                          style={{ width: "250px" }}
                          value={search}
                          onChange={(e) =>
                            debouncedHandleSearch(e.target.value)
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
                      <th style={{ width: "80px" }}>Subscription Id</th>
                      <th>User Name</th>
                      <th>Contact Number</th>
                      <th>Email</th>
                      <th>Subscription Plan  </th>
                      <th> Purchase Date  </th>
                      <th> Plan Expiry Data  </th>
                      <th> Total Amount </th>
                      <th> Payment Status </th>


                    </tr>
                  </thead>
                  <tbody>
                    {payLoading ? (
                      <tr>
                        <td colSpan={9}>
                          <Loader />
                        </td>
                      </tr>
                    ) : !payLoading &&
                      paymentHistory &&
                      paymentHistory?.result?.length > 0 ? (
                      paymentHistory?.result?.map((item: any, index: number) => (
                        <tr

                          key={index}
                          // onClick={
                          //   item?.userDetails?.role === "retailer"
                          //     ? () => navigate(`/retailers/detail?_id=${item?.userDetails?._id}`)
                          //     : undefined
                          // }
                          style={{ cursor: "pointer" }}
                        >
                          <td>
                            {/* <Link
                              to={`/sales-executives/detail?_id=${index + 1}`}
                              style={{ whiteSpace: "nowrap" }}
                            > */}

                            {(paymentHistory?.currentPage - 1) * limit + index + 1}
                            {/* </Link> */}
                          </td>
                          <td>
                            <strong> {item?.subId} </strong>
                          </td>
                          <td>{item?.userDetails?.userName} </td>
                          <td>{item?.userDetails?.phoneNumber} </td>
                          <td>{item?.userDetails?.email} </td>
                          <td>{item?.planDetails?.plan}  </td>
                          <td> {formatDate(item?.purchased_Date)}   </td>
                          <td> {formatDate(item?.plan_end_date)}  </td>
                          <td>{item?.total_amount} AED </td>
                          <td>
                            {item?.paymentStatus ? (
                          <span
                            className={`ecommerce-status ${item?.paymentStatus === "paid"
                              ? "completed"
                              : item?.paymentStatus === "failed"
                                ? "failed"
                                : "on-hold"
                              } text-dark font-weight-500`}
                            style={{ textTransform: "capitalize" }}
                          >
                            {item?.paymentStatus}
                          </span>
                        ) : (
                          "-"
                        )}
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
      </div >
      {/* <ConfirmationPopup
        submit={() => handleDeleteStock()}
        isOpen={isDeleteOpen}
        toggle={() => setDeleteOpen(!isDeleteOpen)}
        text={"Are you sure that you want to delete this stock?"}
      /> */}
    </>
  );
};

export default PaymentHistoryList;
