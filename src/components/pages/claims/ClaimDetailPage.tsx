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
import { useGetClaimById, useUpdateClaimStatus } from "src/services/claim.service";
import { capitalize } from "lodash";
import dayjs from "dayjs";

const ClaimDetailPage = () => {
  //IMPORTS
  const [searchParams] = useSearchParams();
  const claimId = searchParams.get("_id");

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

    if (claimId) {
      obj.claimId = claimId;
    }

    return obj;
  }, [page, limit, search]);

  //QUERIES

  const {
    data: order,
    isLoading: productLoading,
    error: productError,
  } = useGetClaimById(claimId ? claimId : "", !!claimId);

  // MUTATIONS
  const { mutateAsync: updateClaimStatus } = useUpdateClaimStatus();
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
  const handleVerifyProduct = async (id: string, status: string) => {
    try {
      if (id) {
        const res = await verifyProduct({ id, status });
        if (res) {
          toast(res?.data?.message, {
            containerId: "default",
            className: "no-icon notification-success",
          });
        }
      }
    } catch (error: any) {
      console.log("error product verification :", error);
      toast(
        error?.response?.data?.message ||
        "Something went wrong while verifying the product.",
        {
          containerId: "default",
          className: "no-icon notification-danger",
        }
      );
    }
  };


  const handleStatusChangeOpen = (status: string) => {
    console.log("Selected status:", status);
    setStatusOpen(true)
    setstatus(status)


  };

  const handlestatusChange = async () => {
    try {
      if (claimId) {
        const res = await updateClaimStatus({ id: claimId, status: status });
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
        current={"Claim Details"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "Claim Details",
            url: `/claims/detail?_id=${claimId}`,
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

              </Card.Header>
              <Card.Body>
                <Row>
                  <Col xl={6}>
                    <Row>
                      <Col lg={4}>
                        <div>
                          <h6>ClaimId</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {order?.claimId}
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

                      </Col>
                      <Col lg={4}>
                        <div>
                          <h6>Total Price</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {order?.orderDetails?.totalPrice}AED
                          </h5>
                        </div>
                        <div>
                          <h6>Payment Status</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {order?.orderDetails?.paymentStatus}
                          </h5>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div>

                        </div>

                        <div>
                          <h6>Quantity</h6>
                          <h5
                            className=" text-dark font-weight-500 "
                            style={{ width: "90%" }}
                          >
                            {order?.orderDetails?.quantity}
                          </h5>

                        </div>
                        <div>
                          {/* <h6>Requested date</h6>
                          <h5
                            className=" text-dark font-weight-500 "
                            style={{ width: "90%" }}
                          >
                            {order?.requestedDate
                              ? dayjs(order?.requestedDate).format("DD-MM-YYYY")
                              : "-"}
                          </h5> */}

                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col xl={6} className="px-3 ">
                    <Row className="h-100">
                      <Col>

                        <div>
                          <h6>Requested date</h6>
                          <h5
                            className=" text-dark font-weight-500 "
                            style={{ width: "90%" }}
                          >
                            {order?.requestedDate
                              ? dayjs(order?.requestedDate).format("DD-MM-YYYY")
                              : "-"}
                          </h5>
                        </div>
                        <div>
                          {/* <h6>Phone Number</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {order?.vendorDetails?.phoneNumber}
                          </h5> */}
                        </div>

                        <div>
                          {/* <h6>Warehouse Details</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {order?.warehouseDetails?.shop_name}
                          </h5> */}
                        </div>




                        <div>
                          <h6 className="mb-0">Status</h6>
                          <div
                            className="d-flex align-items-center"
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
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="verified">Verified</option>
                                <option value="approved">Approved</option>
                                <option value="in-Progress">In-Progress</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="rejected">Rejected</option>


                              </Form.Control>
                            </div>
                          </div>
                        </div>
                      </Col>
                      {/* <Col>
                        <div>
                          <h6>Verification</h6>
                          <div
                            className={`ecommerce-status ${product?.isVerified}`}
                          >
                            {product?.isVerified
                              ? capitalCase(product?.isVerified)
                              : ""}
                          </div>
                        </div>
                      </Col> */}
                      <Col xl={12} className="px-3 mb-n3 mt-auto">
                        <div>
                          <h6>User Attched Official Imgs</h6>
                          <Row>
                            {/* {order?.productDetails?.imageUrl?.map(
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
                                    // crossOrigin="anonymous"
                                    />
                                  </div>
                                </Col>
                              )
                            )} */}

                            {
                              order?.userAttchedImgUrls?.length === 0 ?
                                <Col className="p-1 p-xl-3">
                                  <div
                                    className="product_image_div"
                                    style={{ cursor: "default" }}
                                  >
                                    <img
                                      src={generateFilePath("")}
                                      alt="product"
                                      width="110"
                                      height="110"
                                    // crossOrigin="anonymous"
                                    />
                                  </div>
                                </Col>

                                :
                                order?.userAttchedImgUrls?.map((item:any,index:any) => (

                                  <Col key={index} className="p-1 p-xl-3">
                                    <div
                                      className="product_image_div"
                                      style={{ cursor: "default" }}
                                    >
                                      <img
                                        src={generateFilePath(item)}
                                        alt="product"
                                        width="110"
                                        height="110"
                                      // crossOrigin="anonymous"
                                      />
                                    </div>
                                  </Col>
                                ))

                            }



                            {/* <Col  className="p-1 p-xl-3">
                              <div
                                className="product_image_div"
                                style={{ cursor: "default" }}
                              >
                                <img
                                  src={generateFilePath(order?.userAttchedOfficialImgs?.pattern)}
                                  alt="product"
                                  width="110"
                                  height="110"
                                // crossOrigin="anonymous"
                                />
                              </div>
                            </Col> */}
                          </Row>
                        </div>
                      </Col>


                      <Col xl={12} className="px-3 mb-n3 mt-auto">
                        <div>
                          <h6>Sales executives Attched Defective Imgs</h6>
                          <Row>
                            <Col className="p-1 p-xl-3">
                              <div
                                className="product_image_div"
                                style={{ cursor: "default" }}
                              >
                                <img
                                  src={generateFilePath(order?.salesAgentAttchedDefectiveImgs?.tyreTread)}
                                  alt="product"
                                  width="110"
                                  height="110"
                                // crossOrigin="anonymous"
                                />
                              </div>
                            </Col>
                            <Col className="p-1 p-xl-3">
                              <div
                                className="product_image_div"
                                style={{ cursor: "default" }}
                              >
                                <img
                                  src={generateFilePath(order?.salesAgentAttchedDefectiveImgs?.defectPicture1)}
                                  alt="product"
                                  width="110"
                                  height="110"
                                // crossOrigin="anonymous"
                                />
                              </div>
                            </Col>

                            <Col className="p-1 p-xl-3">
                              <div
                                className="product_image_div"
                                style={{ cursor: "default" }}
                              >
                                <img
                                  src={generateFilePath(order?.salesAgentAttchedDefectiveImgs?.defectPicture2)}
                                  alt="product"
                                  width="110"
                                  height="110"
                                // crossOrigin="anonymous"
                                />
                              </div>
                            </Col>

                            <Col className="p-1 p-xl-3">
                              <div
                                className="product_image_div"
                                style={{ cursor: "default" }}
                              >
                                <img
                                  src={generateFilePath(order?.salesAgentAttchedDefectiveImgs?.innerlinePicture)}
                                  alt="product"
                                  width="110"
                                  height="110"
                                // crossOrigin="anonymous"
                                />
                              </div>
                            </Col>


                          </Row>
                        </div>
                      </Col>




                    </Row>
                  </Col>
                </Row>
                <Card.Header className="d-flex align-items-center justify-content-between m-0 p-0 mt-5 mb-4">
                  <Card.Title>Stock Details</Card.Title>
                </Card.Header>
                <Row>
                  <Col xl={6}>
                    <Row>
                      <Col lg={4}>
                        <div>

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
                          <h6>Price</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {order?.orderDetails?.price}
                          </h5>
                        </div>
                      </Col>
                      <Col lg={4}>
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
                      </Col>
                      <Col lg={4}>
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
                      </Col>

                    </Row>
                  </Col>
                  <Col xl={6} className="px-3 ">
                    <Row className="h-100">
                      <Col>

                        <div>
                          {/* <h6>Requested date</h6>
                          <h5
                            className=" text-dark font-weight-500 "
                            style={{ width: "90%" }}
                          >
                            {order?.requestedDate
                              ? dayjs(order?.requestedDate).format("DD-MM-YYYY")
                              : "-"}
                          </h5> */}
                        </div>
                        <div>
                          {/* <h6>Phone Number</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {order?.vendorDetails?.phoneNumber}
                          </h5> */}
                        </div>

                        <div>
                          {/* <h6>Warehouse Details</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {order?.warehouseDetails?.shop_name}
                          </h5> */}
                        </div>




                        <div>
                          {/* <h6 className="mb-0">Status</h6> */}
                          <div
                            className="d-flex align-items-center"
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

                            {/* <div className={`ecommerce-status ${order?.status}`}>
                              {capitalize(order?.status)}
                            </div> */}
                          </div>
                        </div>
                      </Col>
                      {/* <Col>
                        <div>
                          <h6>Verification</h6>
                          <div
                            className={`ecommerce-status ${product?.isVerified}`}
                          >
                            {product?.isVerified
                              ? capitalCase(product?.isVerified)
                              : ""}
                          </div>
                        </div>
                      </Col> */}
                    </Row>
                  </Col>
                </Row>
                <Card.Header className="d-flex align-items-center justify-content-between m-0 p-0 mt-5 mb-4">
                  <Card.Title>Claim Requested By</Card.Title>
                </Card.Header>

                <Row>
                  <Col xl={6}>
                    <Row>
                      <Col lg={4}>
                        <div>

                        </div>
                        <div>
                          <h6>Retailer Name</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {order?.userDetails?.userName}
                          </h5>
                        </div>
                        <div>
                          <h6>Phone Number</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {order?.userDetails?.phoneNumber}
                          </h5>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div>
                          <h6>Location</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {order?.userDetailsKyc?.location} , {order?.userDetailsKyc?.business_address}
                          </h5>
                        </div>
                        <div>
                          {/* <h6>Phone Number</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {order?.vendorDetails?.phoneNumber}
                          </h5> */}
                        </div>
                      </Col>

                    </Row>
                  </Col>
                  <Col xl={6} className="px-3 ">
                    <Row className="h-100">
                      <Col>

                        <div>

                        </div>
                        <div>

                        </div>

                        <div>

                        </div>




                        <div>

                          <div

                          >

                          </div>
                        </div>
                      </Col>

                    </Row>
                  </Col>
                </Row>


              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* <div
          className="tabs"
          style={{ borderRadius: "5px", marginTop: "20px", overflow: "hidden" }}
        >
          <Tabs className="nav-justified">
            <Tab eventKey="vendors" title="Vendors">
              <StocksList productId={productId ? productId : ""} />
            </Tab>
            <Tab eventKey="orders" title="Orders">
              <ProductOrdersList
                orders={orders}
                ordersLoading={ordersLoading}
                page={page}
                setPage={setPage}
                productId={productId ? productId : ""}
              />
            </Tab>
          </Tabs>
        </div> */}
        {/* <Col lg={12} className="mt-4">
          <Card className="card-modern">
            <Card.Body>
              <StocksList productId={productId ? productId : ""} />
            </Card.Body>
          </Card>
        </Col> */}
      </div>
      <ConfirmationPopup
        submit={() => handlestatusChange()}
        isOpen={isStatusOpen}
        toggle={() => setStatusOpen(!isStatusOpen)}
        text={"Are you sure that you want to change claim status ?"}
      />
    </>
  );
};

export default ClaimDetailPage;
