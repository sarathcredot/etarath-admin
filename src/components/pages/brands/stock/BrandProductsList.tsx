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
import { Brand } from "../BrandsList";
import {
  useDeleteProduct,
  useUpdateProductStatus,
} from "src/services/product.service";
import { useGetAllProductsByBrandId } from "src/services/brand.service";
import EditProduct from "../../products/popups/EditProduct";
import { Product } from "../../products/ProductsList";

const BrandProductsList = ({ brandId }: { brandId?: string }) => {
  const navigate = useNavigate();

  //STATES
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);

  // QUERIES
  const { data: products, isLoading: productsLoading } =
    useGetAllProductsByBrandId(brandId ? brandId : "", !!brandId);

  /// MUTATIONS
  const { mutateAsync: updateProductStatus } = useUpdateProductStatus();
  const { mutateAsync: deleteProduct } = useDeleteProduct();

  //HANDLERS
  const handlestatusChange = async (id: string, status: boolean) => {
    try {
      if (id) {
        const res = await updateProductStatus({ id, status });
        if (res) {
          toast(res?.data?.message, {
            containerId: "default",
            className: "no-icon notification-success",
          });
        }
      }
    } catch (error: any) {
      console.log("error status updation :", error);
      toast(
        error?.response?.data?.message ||
          "Something went wrong while updating the status.",
        {
          containerId: "default",
          className: "no-icon notification-danger",
        }
      );
    }
  };

  const handleDeleteProduct = async () => {
    try {
      if (selectedProductId) {
        const res = await deleteProduct(selectedProductId);
        if (res) {
          toast(res?.data?.message, {
            containerId: "default",
            className: "no-icon notification-success",
          });
          setDeleteOpen(false);
        }
      } else {
        toast("Product ID is missing. Unable to delete the product.", {
          containerId: "default",
          className: "no-icon notification-danger",
        });
      }
    } catch (error: any) {
      console.log("error deleting product :", error);
      toast(
        error?.response?.data?.message ||
          "Something went wrong while deleting the product.",
        {
          containerId: "default",
          className: "no-icon notification-danger",
        }
      );
    }
  };

  const totalRecords = products?.total || 0;
  const totalPages = products?.pagination?.totalPages || 0;

  useEffect(() => {
    console.log(products, "PRODUCTS DATA");
  }, [products]);
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
                  <Col xl="auto" className="mb-2 mt-1 mb-xl-0">
                    {/* <Button
                      className="font-weight-semibold"
                      variant="dark"
                      //   size="md"
                    >
                      + Add Stock
                    </Button> */}
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
                          placeholder="Search Product"
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
                    <th>Name</th>
                    <th>Origin</th>
                    <th>Year</th>

                    <th>Status</th>
                    <th className="text-center" style={{ width: "80px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productsLoading ? (
                    <tr>
                      <td colSpan={9}>
                        <Loader />
                      </td>
                    </tr>
                  ) : products?.length > 0 ? (
                    products?.map((item: Product, index: number) => (
                      <tr key={index}>
                        <td>
                          <Link to={`/products/detail?_id=${item?._id}`}>
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
                            to={`/products/detail?_id=${item?._id}`}
                          >
                            <img
                              className="mr-1"
                              src={generateFilePath(item?.imageUrl[0])}
                              // src={item?.imageUrl[0]}
                              alt="product"
                              width="40"
                              height="40"
                              crossOrigin="anonymous"
                            />
                          </Link>
                        </td>
                        <td>
                          <Link to={`/products/detail?_id=${item?._id}`}>
                            {item?.productName}
                          </Link>
                        </td>
                        <td>
                          {" "}
                          <Link to={`/attributes/origin`}>{item?.origin}</Link>
                        </td>
                        <td>
                          <Link to={`/attributes/year_of_manufacture`}>
                            {item?.yearOfManufacturer}
                          </Link>
                        </td>

                        <td>
                          <div
                            className="d-flex align-items-center"
                            onClick={() => {
                              handlestatusChange(item?._id, !item?.isSuspend);
                            }}
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
                                setSelectedProductId(item?._id);
                                setEditOpen(true);
                              }}
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </div>
                            <div
                              className="action_btn"
                              onClick={() => {
                                setSelectedProductId(item?._id);
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
                        No products found
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
      <EditProduct
        productId={selectedProductId}
        isOpen={isEditOpen}
        toggle={() => setEditOpen(!isEditOpen)}
      />
    </>
  );
};

export default BrandProductsList;
