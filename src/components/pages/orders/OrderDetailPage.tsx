import React, { useMemo, useState } from "react";
import { Col, Row, Tabs, Tab, Card, Form } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "src/components/common/breadcrumb";
import PtSwitch from "src/components/features/elements/switch";
import { toast } from "react-toastify";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";

import MediaThumb from "src/components/features/media-thumb";
import ImgPreview from "src/components/features/elements/ImgPreview";
import {
  useGetOrdersByProductId,
  useGetProductById,
  useUpdateProductStatus,
  useVerifyProduct,
} from "src/services/product.service";
import { generateFilePath } from "src/services/url.service";
import { useGetOrderById, useUpdateOrderStatus } from "src/services/order.service";
import { capitalize } from "lodash";
import dayjs from "dayjs";

const OrderDetailPage = () => {
  //IMPORTS
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("_id");

  //STATE
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [isStatusOpen, setStatusOpen] = useState<boolean>(false);
  const [status, setstatus] = useState<any>("")
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

    if (orderId) {
      obj.orderId = orderId;
    }

    return obj;
  }, [page, limit, search]);

  //QUERIES

  const {
    data: order,
    isLoading: productLoading,
    error: productError,
  } = useGetOrderById(orderId ? orderId : "", !!orderId);

  // MUTATIONS
  const { mutateAsync: updateOrderStatus } = useUpdateOrderStatus();
  const { mutateAsync: verifyProduct } = useVerifyProduct();

  //HANDLERS
  // const handlestatusChange = async (id: string, status: boolean) => {
  //   try {
  //     if (id) {
  //       const res = await updateProductStatus({ id, status });
  //       if (res) {
  //         toast(res?.data?.message, {
  //           containerId: "default",
  //           className: "no-icon notification-success",
  //         });
  //       }
  //     }
  //   } catch (error: any) {
  //     console.log("error status updation :", error);
  //     toast(
  //       error?.response?.data?.message ||
  //       "Something went wrong while updating the status.",
  //       {
  //         containerId: "default",
  //         className: "no-icon notification-danger",
  //       }
  //     );
  //   }
  // };
  // const handleVerifyProduct = async (id: string, status: string) => {
  //   try {
  //     if (id) {
  //       const res = await verifyProduct({ id, status });
  //       if (res) {
  //         toast(res?.data?.message, {
  //           containerId: "default",
  //           className: "no-icon notification-success",
  //         });
  //       }
  //     }
  //   } catch (error: any) {
  //     console.log("error product verification :", error);
  //     toast(
  //       error?.response?.data?.message ||
  //       "Something went wrong while verifying the product.",
  //       {
  //         containerId: "default",
  //         className: "no-icon notification-danger",
  //       }
  //     );
  //   }
  // };


  const handleStatusChangeOpen = (status: string) => {
    console.log("Selected status:", status);
    setStatusOpen(true)
    setstatus(status)


  };

  const handlestatusChange = async () => {
    try {
      if (orderId) {
        const res = await updateOrderStatus({ id: orderId, status: status });
        if (res) {
          toast(res?.data?.message, {
            containerId: "default",
            className: "no-icon notification-success",
          });
          setStatusOpen(false)
          setstatus("")
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

      setStatusOpen(false)
      setstatus("")
    }
  };



  return (


    <>
      <Breadcrumb
        current={"Order Details"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "Order Details",
            url: `/orders/detail?_id=${orderId}`,
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
                {/* <div
                  className="action_btn "
                  onClick={() => {
                    setSelectedProductId(product?._id ? product?._id : "");
                    setEditOpen(true);
                  }}
                >
                  <i className="fas fa-pencil-alt"></i>
                </div> */}
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6} xl={4}>
                    <div>
                      <h6>OrderId</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {order?.orderId}
                      </h5>
                    </div>
                    <div>
                      <h6>Product Name</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {order?.productDetails?.productName}-{" "}
                        {`${order?.productDetails?.width}${order?.productDetails?.height
                          ? `/${order?.productDetails?.height}`
                          : ""
                          } R${order?.productDetails?.size}`}
                      </h5>
                    </div>
                    <div>

                    </div>
                  </Col>
                  <Col lg={3}>
                    {/* <div>
                          <h6>Available order</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {stock?.stock}
                          </h5>
                        </div> */}
                    <div>
                      <h6>Total Price </h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {order?.totalPrice} AED
                      </h5>
                    </div>
                    <div>
                      <h6>Quantity </h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {order?.quantity}
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
                      // className="d-flex align-items-center"
                      // onClick={() => {
                      //   handlestatusChange(
                      //     product ? product?._id : "",
                      //     !product?.isSuspend
                      //   );
                      // }}
                      >
                        {/* <PtSwitch
                               className="mr-2"
                               on={!product?.isSuspend}
                               size="sm"
                               variant="success"
                             /> */}
                        {/* <h5 className="text-dark font-weight-500">
                               {order?.status
                                 ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                                 : ""}
                             </h5> */}

                        <div className={`ecommerce-status ${order?.status}`}>
                          {/* {capitalize(order?.status)} */}
                          <Form.Control
                            as="select"
                            size="sm"
                            value={order?.status || ""}
                            name="status"
                            style={{
                              width: "110px",
                              color: "#000",
                            }}
                            onChange={(e) => handleStatusChangeOpen(e.target.value)}
                          >
                            <option value="">Select</option>
                            <option value="delivered">Delivered</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="rejected">Rejected</option>
                          </Form.Control>

                        </div>
                      </div>
                      <div>
                        <h6>Requested date</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          style={{ width: "90%" }}
                        >
                          {order?.orderDate
                            ? dayjs(order?.orderDate).format("DD-MM-YYYY")
                            : "-"}
                        </h5>

                      </div>
                    </div>
                  </Col>
                </Row>
                <Card.Header className="d-flex align-items-center justify-content-between m-0 p-0 mt-5 mb-4">
                  <Card.Title>Stock Details</Card.Title>
                </Card.Header>
                <Row>
                  <Col md={6} xl={3}>
                    <div>
                      <h6>Product Name</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {order?.productDetails?.productName}
                      </h5>
                    </div>
                    <div>
                      {/* <h6>Brand</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {product?.brand?.name}
                      </h5> */}
                    </div>
                    <div>
                      <h6>price</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {order?.price}
                      </h5>
                    </div>
                  </Col>

                  <Col md={3} xl={3}>
                    <div>
                      <h6>Vendor</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {order?.vendorDetails?.business_name}
                      </h5>
                    </div>

                    <div>
                      <h6>Phone Number</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {order?.vendorDetails?.phoneNumber}
                      </h5>
                    </div>
                    {/* <Col lg={4}> */}
                    <div>
                      <h6>Warehouse</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {order?.warehouseDetails?.shop_name}
                      </h5>
                    </div>
                    <div>
                      <h6>Location</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {order?.warehouseDetails?.location}
                      </h5>
                    </div>
                    {/* </Col> */}
                  </Col>


                  <Col xl={6} className="px-3 mb-n3 ">
                    <div>
                      <h6>Images</h6>
                      <Row>
                        {order?.productDetails?.imageUrl?.map((img: any, index: number) => (
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
                              // crossOrigin="anonymous"
                              />
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </Col>
                </Row>
                <Card.Header className="d-flex align-items-center justify-content-between m-0 p-0 mt-5 mb-4">
                  <Card.Title>Orderd By</Card.Title>
                </Card.Header>
                <Row>
                  <Col md={6} xl={3}>
                    <div>
                      <h6>Retailer Name</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {order?.userDetails?.userName}
                      </h5>
                    </div>
                    <div>
                      {/* <h6>Brand</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {product?.brand?.name}
                      </h5> */}
                    </div>
                    <div>
                      <h6>Phone Number</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {order?.userDetails?.phoneNumber}
                      </h5>
                    </div>
                    {/* <div>
                      <h6>Phone Number</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {order?.phoneNumber}
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
                      <h6>Location</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {order?.userDetailsKyc?.shop_location} , {order?.userDetailsKyc?.shop_address}
                      </h5>
                    </div>

                    {/* <div>
                      <h6>Phone Number</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {order?.vendorDetails?.phoneNumber}
                      </h5>
                    </div> */}
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

                    {/* <h5 className="text-dark font-weight-500">
                      {order?.status
                        ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                        : ""}
                    </h5> */}
                  </Col>
                  <Col xl={6} className="px-3 mb-n3 ">
                    {/* <div>
                      <h6>Images</h6>
                      <Row>
                        {order?.productDetails?.imageUrl?.map((img: any, index: number) => (
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
                              // crossOrigin="anonymous"
                              />
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div> */}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          {/* <Col lg={12} className="mt-4">
                <Card className="card-modern">
                  <Card.Body>
                    <StocksList
                      productId={productId ? productId : ""}
                    />
                  </Card.Body>
                </Card>
              </Col> */}
        </Row>
      </div >
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
      <ConfirmationPopup
        submit={() => handlestatusChange()}
        isOpen={isStatusOpen}
        toggle={() => setStatusOpen(!isStatusOpen)}
        text={"Are you sure that you want to change order status ?"}
      />
    </>

  );
};

export default OrderDetailPage;
