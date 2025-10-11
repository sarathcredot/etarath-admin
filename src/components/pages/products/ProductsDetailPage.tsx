import React, { useMemo, useState } from "react";
import { Col, Row, Tabs, Tab, Card } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "src/components/common/breadcrumb";
import PtSwitch from "src/components/features/elements/switch";
import { toast } from "react-toastify";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";

import MediaThumb from "src/components/features/media-thumb";
import ImgPreview from "src/components/features/elements/ImgPreview";
import ProductsList, { Product } from "./ProductsList";
import EditProduct from "./popups/EditProduct";
import {
  useGetProductById,
  useUpdateProductStatus,
} from "src/services/product.service";
import { generateFilePath } from "src/services/url.service";
import StocksList from "./stock/StocksList";

const ProductsDetailPage = () => {
  //IMPORTS
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("_id");

  //STATE
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [isStatusOpen, setStatusOpen] = useState<boolean>(false);
  //pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");

  //USE MEMO
  const queryObj = useMemo(() => {
    const obj: any = {};

    if (page) {
      obj.page = page;
    }

    if (limit) {
      obj.limit = limit;
    }

    if (search) {
      obj.search = search;
    }

    if (productId) {
      obj.organiserId = productId;
    }

    return obj;
  }, [page, limit, search]);

  //QUERIES

  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useGetProductById(productId ? productId : "", !!productId) as {
    data: Product | undefined;
    isLoading: boolean;
    error: unknown;
  };

  // MUTATIONS
  const { mutateAsync: updateProductStatus } = useUpdateProductStatus();

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

  return (
    <>
      <Breadcrumb
        current={"Product Details"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "products",
            url: "/products",
          },
          {
            name: "Product Details",
            url: `/products/detail?_id=${productId}`,
          },
        ]}
      />
      <div>
        <Row>
          <Col
            lg={12}
            // className="mt-5"
          >
            <Card className="card-modern">
              <Card.Header className="d-flex align-items-center justify-content-between">
                <Card.Title>Details</Card.Title>
                <div
                  className="action_btn "
                  onClick={() => {
                    setSelectedProductId(product?._id ? product?._id : "");
                    setEditOpen(true);
                  }}
                >
                  <i className="fas fa-pencil-alt"></i>
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col xl={6}>
                    <Row>
                      <Col lg={4}>
                        <div>
                          <h6>Product Name</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {product?.productName}
                          </h5>
                        </div>
                        <div>
                          <h6>Brand</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {product?.brand?.name}
                          </h5>
                        </div>
                        {/* <div>
                      <h6>Category</h6>
                      <h5 className=" text-dark font-weight-500 ">
                      {product?.category}
                      </h5>
                    </div> */}
                      </Col>
                      <Col lg={4}>
                        <div>
                          <h6>Origin</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {product?.originDetails?.origin?.value}
                          </h5>
                        </div>
                        <div>
                          <h6>Year</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {
                              product?.yearOfManufacturerDetails
                                ?.yearOfManufacturer?.value
                            }
                          </h5>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div>
                          <h6>Width</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {product?.width}
                          </h5>
                        </div>
                        <div>
                          <h6>Height</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {product?.height}
                          </h5>
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div>
                          <h6>Description</h6>
                          <h5
                            className=" text-dark font-weight-500 "
                            style={{ width: "90%" }}
                          >
                            {product?.description}
                          </h5>
                        </div>
                        <div>
                          <h6>Features</h6>
                          <ul className="pl-3">
                            {product?.features?.map(
                              (item: string, index: number) => (
                                <li className="pl-0 ml-0">
                                  <h5 className=" text-dark font-weight-500 ">
                                    {item}
                                  </h5>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col xl={6} className="px-3 ">
                    <Row className="h-100">
                      <Col>
                        <div>
                          <h6>Rim Size</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {product?.size}
                          </h5>
                        </div>
                        <div>
                          <h6 className="mb-0">Status</h6>
                          <div
                            className="d-flex align-items-center"
                            onClick={() => {
                              handlestatusChange(
                                product ? product?._id : "",
                                !product?.isSuspend
                              );
                            }}
                          >
                            <PtSwitch
                              className="mr-2"
                              on={!product?.isSuspend}
                              size="sm"
                              variant="success"
                            />
                            <h5 className=" text-dark font-weight-500 ">
                              {!product?.isSuspend ? "Active" : "Blocked"}
                            </h5>
                          </div>
                        </div>
                      </Col>
                      <Col xl={12} className="px-3 mb-n3 mt-auto">
                        <div>
                          <h6>Images</h6>
                          <Row>
                            {product?.imageUrl?.map(
                              (img: any, index: number) => (
                                <Col key={index} className="p-1 p-xl-3">
                                  <div
                                    className="product_image_div"
                                    style={{ cursor: "default" }}
                                  >
                                    <img
                                      src={generateFilePath(img)}
                                      alt="product"
                                      width="110"
                                      height="110"
                                      crossOrigin="anonymous"
                                    />
                                  </div>
                                </Col>
                              )
                            )}
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={12} className="mt-4">
            <Card className="card-modern">
              <Card.Body>
                <StocksList productId={productId ? productId : ""} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <EditProduct
        productId={selectedProductId}
        isOpen={isEditOpen}
        toggle={() => setEditOpen(!isEditOpen)}
      />
    </>
  );
};

export default ProductsDetailPage;
