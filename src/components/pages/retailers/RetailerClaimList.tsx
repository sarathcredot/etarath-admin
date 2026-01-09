import _, { capitalize, debounce } from "lodash";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Loader from "src/components/features/loader";
import { generateFilePath } from "src/services/url.service";
import dayjs from "dayjs";
import Pagination from "src/components/common/Pagination";

const RetailerClaimList = ({
  claims,
  claimsLoading = false,
  setPage = () => { },
  setSearch = () => { }, // fallback so debounce doesn’t break
  setStatus = () => { }, // fallback so debounce doesn’t break
  setLimit,
  page = 1,
  limit = 10,
  search = "",
}: {
  retailerID: string;
  claims: any;
  claimsLoading: boolean;
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
  const [isEditOpen, setEditOpen] = useState<boolean>(false);

  const totalRecords = claims?.total || 0;
  const totalPages = claims?.totalPages || 0;

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
                      Claims
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
                          placeholder="Search Claim"
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
              <Table
                className="table-ecommerce-simple mb-0"
                responsive="xl"
                striped
                // bordered
                style={{ minWidth: "600px" }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "30px" }}>Claim ID</th>
                    <th
                      // className="text-center"
                      style={{ width: "80px" }}
                    >
                      Product
                    </th>
                    <th></th>
                    <th>Vendor</th>
                    {/* <th>Quantity</th> */}
                    <th>Total Price</th>
                    <th>Claim Date</th>
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span>Status</span>

                        <Form.Control
                          as="select"
                          size="sm"
                          style={{
                            width: "110px",
                            color: "#000",
                          }}
                          name="verification"
                          onChange={(e: any) =>
                            debouncedHandleStatus(e.target.value)
                          }
                        >
                          <option value="all">All</option>
                          <option value="approved">Approved</option>
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                        </Form.Control>
                      </div>
                    </th>






                    {/* <th className="text-center" style={{ width: "80px" }}>
                        Actions
                      </th> */}
                  </tr>
                </thead>
                <tbody>
                  {claimsLoading ? (
                    <tr>
                      <td colSpan={9}>
                        <Loader />
                      </td>
                    </tr>
                  ) : !claimsLoading && claims && claims?.result?.length > 0 ? (
                    claims?.result?.map((item: any, index: number) => (
                      <tr
                        onClick={() =>
                          navigate(`/claims/detail?_id=${item?._id}`)
                        }
                        key={index}
                        style={{ cursor: "pointer" }}
                      >
                        <td>
                          {/* <Link
                            to={`/orders/detail?_id=${index + 1}`}
                            style={{ whiteSpace: "nowrap" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                           
                            {item?.orderId}
                          </Link> */}

                          <strong style={{ whiteSpace: "nowrap" }}>
                            {item?.claimId}
                          </strong>
                        </td>
                        <td>
                          <Link
                            style={{ width: "50px", height: "50px" }}
                            className="d-flex align-items-center justify-content-center"
                            to={`/products/detail?_id=${claims?.productDetails?._id}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <img
                              className="mr-1"
                              src={generateFilePath(
                                item?.productDetails?.imageUrl[0]
                              )}
                              // src={claims?.imageUrl[0]}
                              alt="product"
                              width="40"
                              height="40"
                            // crossOrigin="anonymous"
                            />
                          </Link>
                        </td>
                        <td>
                          {item?.productDetails?.productName}-{" "}
                          {`${item?.productDetails?.width}${item?.productDetails?.height
                            ? `/${item.productDetails?.height}`
                            : ""
                            } R${item?.productDetails?.size}`}
                        </td>
                        <td>

                          {item?.vendorDetails?.business_name || "-"}

                        </td>
                        {/* <td>{item?.quantity || 0} </td> */}
                        <td>{item?.orderDetails?.totalPrice?.toFixed(2) || 0} AED</td>
                        <td>
                          {item?.requestedDate
                            ? dayjs(item?.requestedDate).format("DD-MM-YYYY")
                            : "-"}
                        </td>
                        <td>
                          <div className={`ecommerce-status ${item?.status}`}>
                            {capitalize(item?.status)}
                          </div>
                        </td>
                        {/* <td onClick={(e) => e.stopPropagation()}>
                            <div className="d-flex align-claimss-center justify-content-around">
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

export default RetailerClaimList;
