import React, { useEffect, useMemo, useState } from "react";
import { Col, Row, Tabs, Tab, Card, Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "src/components/common/breadcrumb";
import PtSwitch from "src/components/features/elements/switch";
import { toast } from "react-toastify";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";

import MediaThumb from "src/components/features/media-thumb";
import ImgPreview from "src/components/features/elements/ImgPreview";
// import ProductsList, { Product } from "../ProductsList";
import EditOrder from "../vendor-plans/Popups/EditOrder";
import {
  useGetOrdersByProductId,
  useGetProductById,
  useUpdateProductStatus,
  useVerifyProduct,
} from "src/services/product.service";

import { useGetSubscriptionOrderById } from "src/services/subscription-orders"

import { generateFilePath } from "src/services/url.service";
// import StocksList from "../";
import { capitalCase } from "capital-case";
import { format } from "date-fns";

// import ProductOrdersList from "../ProductOrdersList";

const SubOrderDetailPage = () => {
  //IMPORTS
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("_id");
  const planId = searchParams.get("planId");

  //STATE
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [isStatusOpen, setStatusOpen] = useState<boolean>(false);
  const [verifyKyc, setVerifyKyc] = useState<boolean>(false);

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
      obj.organiserId = orderId;
    }

    return obj;
  }, [page, limit, search]);

  //QUERIES

  const {
    data: product,
    isLoading: subOrderLoading,
    error: productError,
  } = useGetSubscriptionOrderById(orderId ? orderId : "", !!orderId) as {
    data: any | undefined;
    isLoading: boolean;
    error: unknown;
  };

  // const {
  //   data: orders,
  //   isLoading: ordersLoading,
  //   error: ordersError,
  // } = useGetOrdersByProductId(productId ? productId : "", !!productId);

  // MUTATIONS
  const { mutateAsync: updateProductStatus } = useUpdateProductStatus();
  const { mutateAsync: verifyProduct } = useVerifyProduct();

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
  const handleVerifyProduct = async (id: string, status: string) => {
    try {
      if (id) {
        const res = await verifyProduct({ id, status });
        if (res) {
          toast(res?.data?.message, {
            containerId: "default",
            className: "no-icon notification-success",
          });
          setVerifyKyc(false)
          setSelectedProductId(product?._id ? product?._id : "");
          setEditOpen(true);
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

  // useEffect(() => {
  //   if (product && product?.isVerified === "pending") {
  //     setVerifyKyc(true);
  //   }
  // }, [product]);


  return (
    <>
      <Breadcrumb
        // current={
        //   product?.productName
        //     ? `${product?.productName} -
        //                       ${product?.width}${product?.height ? `/${product?.height}` : ""
        //     } R${product?.size}`
        //     : "Product Details"
        // }
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "Plan Details",
            url: `/subscriptions/retailer-plans/detail?_id=${planId}`,
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
                <Card.Title>Subscriptions Purchase Details</Card.Title>
                <div
                  className="d-flex align-items-end justify-content-end h-100"
                  style={{ gap: 10 }}
                >

                  {/* <div
                    className="action_btn bg-dark"
                    onClick={() => {
                      setSelectedProductId(product?._id ? product?._id : "");
                      setEditOpen(true);
                    }}
                  >
                    <i className="fas fa-pencil-alt text-light"></i>
                  </div> */}
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col xl={6}>
                    <Row>
                      <Col lg={4}>
                        <div>
                          <h6>Subscriptions Id  </h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {product?.subId}
                          </h5>
                        </div>
                        <div>
                          <h6>Subscription Plan</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {product?.planDetails?.plan}
                          </h5>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div>
                          <h6>Purchased Date</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {product?.purchased_Date
                              ? format(new Date(product?.purchased_Date), "dd/MM/yyyy")
                              : ""
                            }
                          </h5>
                        </div>
                        <div>
                          <h6>Purchased Total Ammount</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {
                              product?.total_amount
                            } AED
                          </h5>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div>
                          <h6>Duration Type</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {product?.durationType}
                          </h5>
                        </div>
                        <div>
                          <h6>Payment Status</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {product?.paymentStatus}
                          </h5>
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div>
                          <h6>Plan Price</h6>
                          <h5
                            className=" text-dark font-weight-500 "
                            style={{ width: "90%" }}
                          >
                            {product?.plan_price}AED /month
                          </h5>
                        </div>
                        {/* <div>
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
                        </div> */}
                      </Col>
                    </Row>
                  </Col>
                  <Col xl={6} className="px-3 ">
                    <Row className="h-100">
                      <Col>
                        {/* {product?.height && (
                          <div>
                            <h6>Height</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {product?.height}
                            </h5>
                          </div>
                        )} */}
                        <div>
                          <h6>Plan End Date</h6>
                          <h5 style={{ display: "flex", gap: "5px" }} className=" text-dark font-weight-500 "  >
                            {product?.plan_end_date
                              ? format(new Date(product?.plan_end_date), "dd/MM/yyyy")
                              : ""
                            }

                            <div
                              className="action_btn "
                              onClick={() => { setStatusOpen(true) }}
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </div>

                          </h5>

                        </div>
                        <div>
                          <h6>Next Billing Date</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {product?.next_billing_date
                              ? format(new Date(product?.next_billing_date), "dd/MM/yyyy")
                              : ""
                            }
                          </h5>
                        </div>
                      </Col>
                      <Col>
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


                        <div>
                          <h6>Trial Period </h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {product?.trial_period } Days
                          </h5>
                        </div>

                        <div>
                          <h6>Status</h6>
                          {product?.isActive ? (
                            <span
                              className={`ecommerce-status completed`}
                              style={{ textTransform: "capitalize" }}
                            >
                              Active
                            </span>
                          ) : (
                            "-"
                          )}
                        </div>


                      </Col>
                      {/* <Col xl={12} className="px-3 mb-n3 mt-auto">
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
                                    // crossOrigin="anonymous"/
                                    />
                                  </div>
                                </Col>
                              )
                            )}
                          </Row>
                        </div>
                      </Col> */}
                    </Row>
                  </Col>
                </Row>
              </Card.Body>


              <Card.Header className="d-flex align-items-center justify-content-between">
                <Card.Title>
                  Retailer Details

                </Card.Title>
                <div
                  className="d-flex align-items-end justify-content-end h-100"
                  style={{ gap: 10 }}
                >
                  {product?.isVerified === "pending" && (
                    <>
                      {/* <div
                        title="Approve Product"
                        className="action_btn bg-success"
                        onClick={() => {
                          handleVerifyProduct(product?._id, "approved");
                        }}
                      >
                        <i className="fas fa-check text-light"></i>
                      </div>
                      <div
                        title="Reject Product"
                        className="action_btn bg-danger"
                        onClick={() => {
                          handleVerifyProduct(product?._id, "rejected");
                        }}
                      >
                        <i className="fas fa-x-mark text-light"></i>
                      </div> */}
                    </>
                  )}
                  {/* <div
                    className="action_btn bg-dark"
                    onClick={() => {
                      setSelectedProductId(product?._id ? product?._id : "");
                      setEditOpen(true);
                    }}
                  >
                    <i className="fas fa-pencil-alt text-light"></i>
                  </div> */}
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col xl={6}>
                    <Row>
                      <Col lg={4}>
                        <div>
                          <h6>Name </h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {


                              product?.userDetails?.userName


                            }

                          </h5>
                        </div>
                        <div>
                          <h6>Phone Number</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {


                              product?.userDetails?.phoneNumber


                            }
                          </h5>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div>
                          <h6>Email</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {


                              product?.userDetails?.email


                            }
                          </h5>
                        </div>
                        <div>
                          <h6>Address</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {

                              product?.kycDetails?.business_address


                            }
                          </h5>
                        </div>
                      </Col>
                      <Col lg={4}>
                        {/* <div>
                          <h6>Category</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {product?.category}
                          </h5>
                        </div>
                        <div>
                          <h6>Width</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {product?.width}
                          </h5>
                        </div> */}
                      </Col>
                      <Col lg={12}>
                        {/* <div>
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
                        </div> */}
                      </Col>
                    </Row>
                  </Col>
                  <Col xl={6} className="px-3 ">
                    <Row className="h-100">
                      <Col>
                        {/* {product?.height && (
                          <div>
                            <h6>Height</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {product?.height}
                            </h5>
                          </div>
                        )}
                        <div>
                          <h6>Rim Size</h6>
                          <h5 className=" text-dark font-weight-500 ">
                            {product?.size}
                          </h5>
                        </div>
                      </Col>
                      <Col>
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
                        </div> */}
                      </Col>
                      <Col xl={12} className="px-3 mb-n3 mt-auto">
                        {/* <div>
                          <h6>Images</h6>
                          <Row>
                            
                            <Col className="p-1 p-xl-3">
                              <div
                                className="product_image_div"
                                style={{ cursor: "default", width: "110px", height: "110px" }}

                              >
                                <img
                                  src={generateFilePath(product?.createdKyc?.vendor_logo)}
                                  alt="product"
                                  width="110"
                                  height="110"
                                
                                />
                              </div>
                            </Col>
                          
                          </Row>
                        </div> */}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>




            </Card>
          </Col>
        </Row>
        <div
          className="tabs"
          style={{ borderRadius: "5px", marginTop: "20px", overflow: "hidden" }}
        >

        </div>
        {/* <Col lg={12} className="mt-4">
          <Card className="card-modern">
            <Card.Body>
              <StocksList productId={productId ? productId : ""} />
            </Card.Body>
          </Card>
        </Col> */}
      </div>

      {/* {verifyKyc && (
        <div
          style={{
            position: "fixed",
            bottom: 15,
            right: 15,
            width: "400px",
            zIndex: 999,
          }}
        >
          <div
            className=""
            style={{
              position: "relative",
              display: "flex",
              borderRadius: "10px",
              gap: 10,
              fontSize: 12,
              fontWeight: "bold",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              background: "white",
              color: "#000",
              flexDirection: "column",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 15,
                right: 15,
                color: "#000",
                width: 20,
                height: 20,
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                fontSize: 15,
              }}
              onClick={() => setVerifyKyc(false)}
            >
              <i className="fas fa-xmark"></i>
            </div>

            <div>
              <h3 className="mt-0 p-0 " style={{ color: "#000", fontSize: 17 }}>
                Product Verification
              </h3>
              <p
                className="m-0"
                style={{ color: "#000", fontWeight: "normal" }}
              >
                Please verify the product details and images before approving
                or rejecting the product.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                gap: 10,
                color: "#fff",
              }}
            >
              <Button
                className="no-hover-success"
                variant="success"
                //   size="md"
                onClick={() => handleVerifyProduct(product?._id, "approved")}
              >
                Approve
              </Button>
              <Button
                className=""
                variant="danger"
              //   size="md"
              // onClick={() => set_is_kyc_reject_open(true)}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )} */}


      <ConfirmationPopup
        submit={() => { setStatusOpen(false), setEditOpen(true) }}
        isOpen={isStatusOpen}
        toggle={() => {

          setStatusOpen(!isStatusOpen);
        }}
        text={"Are you sure that you want to update subscription expire data?"}
      />

      <EditOrder
        orderId={product?._id}
        isOpen={isEditOpen}
        toggle={() => setEditOpen(!isEditOpen)}
        data={product}
      />
    </>
  );
};

export default SubOrderDetailPage;
