import { capitalize } from "lodash";
import React, { Dispatch, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "src/components/common/Pagination";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";
import Loader from "src/components/features/loader";
import PtSwitch from "src/components/features/elements/switch";
import { generateFilePath } from "src/services/url.service";
import { Brand } from "../../brands/BrandsList";
import { useGetStocksByProductId } from "src/services/stock.service";
import AddStock from "./popups/AddStock";
import { Product } from "../ProductsList";

const StocksList = ({
  productId,
}: {
  productId?: string;
  isLoading?: boolean;
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
  const [selectedStockId, setSelectedStockId] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  // QUERIES
  const { data: stocks, isLoading: stocksLoading } = useGetStocksByProductId(
    productId ? productId : "",
    !!productId
  );

  // MUTATION
  // const { mutateAsync: deleteTournament } = useDeleteTournamentById();

  //HANDLERS
  const handleDeleteProduct = async () => {
    // try {
    //   if (selectedTournamentId) {
    //     const res = await deleteTournament(selectedTournamentId);
    //     if (res) {
    //       toast(res?.data?.message, {
    //         containerId: "default",
    //         className: "no-icon notification-success",
    //       });

    //       setDeleteOpen(false);
    //     }
    //   } else {
    //     toast("Tournament ID is missing. Unable to delete the tournament.", {
    //       containerId: "default",
    //       className: "no-icon notification-danger",
    //     });
    //   }
    // } catch (error: any) {
    //   console.log("error deleting tournament :", error);
    //   toast(
    //     error?.response?.data?.message ||
    //       "Something went wrong while deleting the tournament.",
    //     {
    //       containerId: "default",
    //       className: "no-icon notification-danger",
    //     }
    //   );
    // }
    toast("Product deleted successfully", {
      containerId: "default",
      className: "no-icon notification-success",
    });
    setDeleteOpen(false);
  };

  const totalRecords = stocks?.total || 0;
  const totalPages = stocks?.pagination?.totalPages || 0;

  useEffect(() => {
    console.log(stocks, "STOCKS DATA");
  }, [stocks]);
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
                      Stocks
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
                    <Button
                      className="font-weight-semibold"
                      variant="dark"
                      //   size="md"
                      onClick={() => setAddOpen(true)}
                    >
                      + Add Stock
                    </Button>
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
                      Product
                    </th>
                    <th>Vendor</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Warranty Period</th>
                    <th>Verification </th>

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
                  ) : !stocksLoading && stocks && stocks?.result?.length > 0 ? (
                    stocks?.result?.map((item: any, index: number) => (
                      <tr key={index}>
                        <td>
                          <Link to={`/stocks/detail?_id=${index + 1}`}>
                            <strong>
                              {/* {index +
                                  (productsData?.pagination?.page - 1) *
                                    productsData?.pagination?.limit +
                                  1} */}
                              {index + 1}
                            </strong>
                          </Link>
                        </td>
                        <td>
                          <Link
                            style={{ width: "50px", height: "50px" }}
                            className="d-flex align-items-center justify-content-center"
                            to={`/stock/detail?_id=${item?._id}`}
                          >
                            <img
                              className="mr-1"
                              src={generateFilePath(item?.product?.imageUrl[0])}
                              // src={item?.imageUrl[0]}
                              alt="product"
                              width="40"
                              height="40"
                              crossOrigin="anonymous"
                            />
                          </Link>
                        </td>
                        <td>
                          <Link to={`/vendors/detail?_id=${item?.requestedBy?._id}`}>
                            {item?.requestedBy?.userName}
                            <br />
                            {item?.requestedBy?.email}
                          </Link>
                        </td>
                        <td>{item?.stock}</td>
                        <td>{item?.price} AED</td>
                        <td>{item?.warrantyPeriod} Year</td>
                        <td>
                          <div
                            className={`ecommerce-status ${item?.isVerified}`}
                          >
                            {item?.isVerified}
                          </div>
                        </td>

                        <td>
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
                        </td>
                        <td>
                          <div className="d-flex align-items-center justify-content-around">
                            <div
                              className="action_btn"
                              onClick={() => {
                                setSelectedStockId("123");
                                setEditOpen(true);
                              }}
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </div>
                            <div
                              className="action_btn"
                              onClick={() => {
                                setSelectedStockId("123");
                                setDeleteOpen(true);
                              }}
                            >
                              <i className="far fa-trash-alt"></i>
                            </div>
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
        submit={() => handleDeleteProduct()}
        isOpen={isDeleteOpen}
        toggle={() => setDeleteOpen(!isDeleteOpen)}
        text={"Are you sure that you want to delete this product?"}
      />
      {/* <EditProduct
        productId={selectedStockId}
        isOpen={isEditOpen}
        toggle={() => setEditOpen(!isEditOpen)}
      /> */}

      <AddStock
        productId={productId ? productId : ""}
        isOpen={isAddOpen}
        toggle={() => setAddOpen(!isAddOpen)}
      />
    </>
  );
};

export default StocksList;
