import React, { useEffect, useMemo, useState } from "react";
import { Col, Row, Tabs, Tab, Card } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "src/components/common/breadcrumb";
import PtSwitch from "src/components/features/elements/switch";
import { toast } from "react-toastify";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";

import MediaThumb from "src/components/features/media-thumb";
import ImgPreview from "src/components/features/elements/ImgPreview";

import {
  useGetProductById,
  useUpdateProductStatus,
} from "src/services/product.service";
import { generateFilePath } from "src/services/url.service";

import { Product } from "../ProductsList";
import { useGetStockById } from "src/services/stock.service";

const StockDetailPage = () => {
  //IMPORTS
  const [searchParams] = useSearchParams();
  const stockId = searchParams.get("_id");

  //STATE
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [productId, setProductId] = useState<string>("");
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

    if (stockId) {
      obj.stockId = stockId;
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
  const {
    data: stock,
    isLoading: stockLoading,
    error: stockError,
  } = useGetStockById({ stockId: stockId ? stockId : undefined }, !!stockId);

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

  useEffect(() => {
    if (stock) {
      setProductId(stock?.productId ? stock?.productId : "");
    }
  }, [stock]);

  return (
    <>
      <Breadcrumb
        current={"Stock Details"}
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
            name: "Stock Details",
            url: `/stock/detail?_id=${stockId}`,
          },
        ]}
      />
      <div>
        <Row>
          {/* <Col
            lg={12}
            className=" "
          >
            <div className="banner_section">
              <div className="w-100 banner_image_div">
                <img
                  className="banner_image"
                  src="/assets/images/banner/banner_1.png"
                  alt=""
                />
                <div className="edit-icon" >
                  <div onClick={()=> setEditBannerOpen(true)}>

                 <i className="bx bxs-edit fa " ></i>
                  </div>
                </div>
              </div>
              <div className="content" style={{zIndex:1000}}>
                <div className="logo_div" >
                  <img
                    className="logo_img"
                    src="/assets/images/banner/Pepsi_IPL_logo 1.png"
                    alt=""
                  />
                </div>
                <h1>Pepsi Indian Premier League</h1>
              </div>
            </div>
          </Col> */}
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
                  <Col md={6} xl={4}>
                    <div>
                      <h6>Vendor Name</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {stock?.requestedBy?.userName}
                      </h5>
                    </div>
                    <div>
                      <h6> Email</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {stock?.requestedBy?.email}
                      </h5>
                    </div>
                    <div>
                      <h6>Phone Number</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {stock?.requestedBy?.phoneNumber}
                      </h5>
                    </div>
                  </Col>
                  <Col lg={3}>
                    <div>
                      <h6>Available Stock</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {stock?.stock}
                      </h5>
                    </div>
                    <div>
                      <h6>Price </h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {stock?.price} AED
                      </h5>
                    </div>
                    <div>
                      <h6>Warranty Period </h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {stock?.warrantyPeriod} Year
                      </h5>
                    </div>
                  </Col>
                  <Col md={3} xl={2}>
                    {/* <div>
                      <h6>Verification</h6>
                      <span
                        className={`ecommerce-status ${
                          stock?.isVerified === "approved"
                            ? "completed"
                            : stock?.isVerified === "rejected"
                            ? "failed"
                            : "on-hold"
                        } text-dark font-weight-500`}
                      >
                        {stock?.isVerified}
                      </span>
                    </div> */}

                    <div>
                      <h6 className="mb-0">Status</h6>
                      <div
                        className="d-flex align-items-center"
                        onClick={() => {
                          handlestatusChange(
                            stock ? stock?._id : "",
                            !stock?.isSuspend
                          );
                        }}
                      >
                        <PtSwitch
                          className="mr-2"
                          on={!stock?.isSuspend}
                          size="sm"
                          variant="success"
                        />
                        <h5 className=" text-dark font-weight-500 ">
                          {!stock?.isSuspend ? "Active" : "Suspended"}
                        </h5>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Card.Header className="d-flex align-items-center justify-content-between m-0 p-0 mt-5 mb-4">
                  <Card.Title>Product Details</Card.Title>
                </Card.Header>
                <Row>
                  <Col md={6} xl={3}>
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
                  {/* <Col md={3} xl={2}>
                    <div>
                      <h6>Origin</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {product?.origin}
                      </h5>
                    </div>
                    <div>
                      <h6>Year</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {product?.yearOfManufacturer}
                      </h5>
                    </div>
                  </Col> */}
                  <Col md={3} xl={3}>
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
                    <div>
                      <h6>Rim Size</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {product?.size}
                      </h5>
                    </div>
                    {/* <div>
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
                    </div> */}
                  </Col>
                  <Col xl={6} className="px-3 mb-n3 ">
                    <div>
                      <h6>Images</h6>
                      <Row>
                        {product?.imageUrl?.map((img: any, index: number) => (
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
                        ))}
                      </Row>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={12} className="mt-4">
            <Card className="card-modern">
              <Card.Body>
                {/* <StocksList
                  productId={productId ? productId : ""}
                /> */}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      {/* <ConfirmationPopup
        // submit={() => handleChangeStatus(organiser?.isActive)}
        submit={() =>
          toast("Status Update", {
            containerId: "default",
            className: "no-icon notification-success",
          })
        }
        isOpen={isStatusOpen}
        toggle={() => setStatusOpen(!isStatusOpen)}
        text={
          "Are you sure that you want to change the status of this product?"
        }
      /> */}
    </>
  );
};

export default StockDetailPage;
