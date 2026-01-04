import React, { useEffect, useMemo, useState } from "react";
import { Col, Row, Tabs, Tab, Card, Button } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumb from "src/components/common/breadcrumb";
import PtSwitch from "src/components/features/elements/switch";
import { toast } from "react-toastify";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";

import { User } from "src/types/types";
import { generateFilePath } from "src/services/url.service";
import { useKycVerification } from "src/services/kyc.service";
import EditRetailer from "./popups/EditRetailer";
import EditOrder from "./popups/EditOrder";
// import EditDate from "./popups/EditDate"
import {
  useGetOrdersByRetailerId,
  useGetRetailerById,
  useUpdateRetailerStatus,
  useGetClaimByRetailerId
} from "src/services/retailer.service";
import RetailerOrdersList from "./RetailerOrdersList";
import RetailerClaimList from "./RetailerClaimList";
import {
  formatCurrency,
  formatDate,
  formatNumberShort,
} from "src/utils/formats";
import { useGetPreferenceByUserId } from "src/services/preference.service";
import { useGetSubscriptionOrderById } from "src/services/subscription-orders";

const RetailersDetailPage = () => {
  //IMPORTS
  const [searchParams] = useSearchParams();
  const retailerID = searchParams.get("_id");
  const navigate = useNavigate();

  //STATE
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [isEditOpenSub, setEditOpenSub] = useState<boolean>(false);

  const [isStatusOpensub, setStatusOpensub] = useState<boolean>(false);

  const [isKycEditOpen, setKycEditOpen] = useState<boolean>(false);
  const [isStatusOpen, setStatusOpen] = useState<boolean>(false);
  const [is_kyc_approve_open, set_is_kyc_approve_open] =
    useState<boolean>(false);
  const [is_kyc_reject_open, set_is_kyc_reject_open] = useState<boolean>(false);
  const [isKycOpen, setKycOpen] = useState<boolean>(false);
  const [verifyKyc, setVerifyKyc] = useState<boolean>(false);
  //pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");

  // Claim

  const [claimPage, setClaimPage] = useState<number>(1);
  const [claimLimit, setClaimLimit] = useState<number>(10);
  const [claimSearch, setClaimSearch] = useState<string>("");


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

    if (retailerID) {
      obj.retailerID = retailerID;
    }

    return obj;
  }, [page, limit, search]);

  // claims

  const claimQueryObj = useMemo(() => {
    const obj: any = {};

    if (claimPage) {
      obj.page = claimPage;
    }

    if (claimLimit) {
      obj.limit = claimLimit;
    }

    if (claimSearch) {
      obj.search = claimSearch;
    }

    if (retailerID) {
      obj.retailerID = retailerID;
    }

    return obj;
  }, [claimPage, claimLimit, claimSearch]);


  // QUERIES
  const { data: retailer, isLoading: isRetailerLoading } = useGetRetailerById(
    retailerID ? retailerID : "",
    !!retailerID
  ) as {
    data: User;
    isLoading: boolean;
  };

  const { data: retailerPreferences, isLoading: isPreferenceLoading } =
    useGetPreferenceByUserId(retailerID ? retailerID : "", !!retailerID);

  const { data: retailerActivePlan, isLoading: isActivePlanLoading } =
    useGetSubscriptionOrderById(retailer?.active_plan);

  const { data: orders, isLoading: ordersLoading } = useGetOrdersByRetailerId(
    retailerID ? retailerID : "",
    !!retailerID,
    queryObj
  );


  const { data: claims, isLoading: claimLoading } = useGetClaimByRetailerId(
    retailerID ? retailerID : "",
    !!retailerID,
    claimQueryObj
  );

  //MUTATIONS
  const { mutateAsync: updateRetailerStatus } = useUpdateRetailerStatus();
  const { mutateAsync: kycVerification } = useKycVerification();

  //HANDLERS
  const handleChangeStatus = async (retailerId: string, isActive: boolean) => {
    try {
      if (!retailerId) throw new Error("Retailer ID is required!");
      if (typeof isActive !== "boolean")
        throw new Error("Unexpected Active status!");

      const resp = await updateRetailerStatus({
        id: retailerId,
        isActive: !isActive,
      });

      setStatusOpen(false);
      toast(resp?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });
    } catch (error) {
      toast("Can't update Retailer right now, please try later!", {
        containerId: "default",
        className: "no-icon notification-danger",
      });
      setStatusOpen(false);
    }
  };
  const handleKycVerification = async (retailerId: string, status: string) => {
    try {
      if (!retailerId) throw new Error("Retailer ID is required!");
      const resp = await kycVerification({
        userId: retailerId,
        status: status,
      });

      toast(resp?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });
      setVerifyKyc(false);
    } catch (error) {
      console.log(error);
      toast("Can't update kyc right now, please try later!", {
        containerId: "default",
        className: "no-icon notification-danger",
      });
    }
    set_is_kyc_approve_open(false);
    set_is_kyc_reject_open(false);
  };

  // show the file in new tab
  const showFile = (fileUrl?: string) => {
    if (fileUrl) {
      const url = generateFilePath(fileUrl);
      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    if (retailer && retailer?.kyc && retailer?.kyc?.kycStatus === "pending") {
      setVerifyKyc(true);
    }
  }, [retailer]);

  return (
    <>
      <Breadcrumb
        current={retailer?.userName ? retailer?.userName : "Retailer Detail"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "retailers",
            url: "/retailers",
          },
          {
            name: retailer?.userName ? retailer?.userName : "retailer detail",
            url: `/retailers/detail?_id=${retailerID}`,
          },
        ]}
      />
      <div>
        <div
          className="tabs"
          style={{ borderRadius: "5px", marginTop: "20px", overflow: "hidden" }}
        >
          <Tabs className="nav-justified">
            <Tab eventKey="profile" title="Profile Details">
              <Row className="">
                <Col>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="m-0 card-title h5 font-weight-bold">
                      Profile Details
                    </h5>
                    {retailer ? (
                      <div
                        className="d-flex align-items-center"
                        style={{ gap: 10 }}
                      >
                        <div
                          title="Edit Retailer"
                          className="action_btn bg-dark"
                          onClick={() => {
                            navigate(
                              `/retailers/edit-retailer?_id=${retailer?._id}`
                            );
                          }}
                        >
                          <i className="fas fa-pencil-alt text-light"></i>
                        </div>
                      </div>
                    ) : (
                      <Button
                        className="font-weight-semibold"
                        variant="dark"
                        //   size="md"
                        onClick={() => setKycOpen(true)}
                      >
                        + Add Profile Details
                      </Button>
                    )}
                  </div>
                  <Row>
                    <Col>
                      <div>
                        <h6>Profile</h6>
                        <div>
                          <img
                            src={generateFilePath(retailer?.imgUrl)}
                            width={100}
                            height={100}
                            alt="profile"
                          />
                        </div>
                      </div>
                      <div>
                        <h6>Full Name</h6>
                        <h5 className=" text-dark font-weight-500 ">
                          {retailer?.userName || "-"}
                        </h5>
                      </div>
                      <div>
                        <h6> Phone Number</h6>
                        <h5 className=" text-dark font-weight-500 ">
                          {retailer?.phoneNumber || "-"}
                        </h5>
                      </div>
                      <div>
                        <h6>Email</h6>
                        <h5 className=" text-dark font-weight-500 ">
                          {retailer?.email || "-"}
                        </h5>
                      </div>
                    </Col>
                    <Col>
                      <div>
                        <h6>EID No</h6>
                        <h5 className=" text-dark font-weight-500 ">
                          {retailer?.eidNo || "-"}
                        </h5>
                      </div>
                      <div>
                        <h6>EID Expiry Date</h6>
                        <h5 className=" text-dark font-weight-500 ">
                          {formatDate(retailer?.eidExpiryDate)}
                        </h5>
                      </div>
                      {retailer?.eidFile && (
                        <div className="mt-3 ">
                          <h6>EID Document </h6>
                          <Button
                            variant="default"
                            onClick={() => showFile(retailer?.eidFile)}
                          >
                            <i className="far fa-eye mr-2"></i>
                            View
                          </Button>
                        </div>
                      )}
                    </Col>
                    <Col>
                      <div className="pt-2">
                        <h6>Verification Status</h6>
                        <span
                          className={`ecommerce-status ${retailer?.isVerified === "approved"
                            ? "completed"
                            : retailer?.isVerified === "rejected"
                              ? "failed"
                              : "on-hold"
                            } text-dark font-weight-500`}
                          style={{ textTransform: "capitalize" }}
                        >
                          {retailer?.isVerified}
                        </span>
                      </div>
                      <div>
                        <h6 className="mb-0">Status</h6>
                        <div
                          className="d-flex align-items-center"
                          onClick={() => {
                            setStatusOpen(true);
                          }}
                        >
                          <PtSwitch
                            className="mr-2"
                            on={!retailer?.isSuspend}
                            size="sm"
                            variant="success"
                          />
                          <h5 className=" text-dark font-weight-500 ">
                            {!retailer?.isSuspend ? "Active" : "Blocked"}
                          </h5>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="kyc" title="Business Details">
              <Row className="px-3" style={{ gap: 15 }}>
                {retailer?.kyc && (
                  <Col lg={4} className="p-0 ">
                    <Card
                      className="card-modern"
                      style={{ height: "100%", border: "1px solid #ddd " }}
                    >
                      {/* <Card.Header className="d-flex align-items-center justify-content-end"></Card.Header> */}
                      <Card.Body
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Row>
                          <Col className="text-center">
                            <div>
                              <div>
                                <img
                                  src={generateFilePath(
                                    retailer?.kyc?.shop_photo_logo
                                  )}
                                  width={150}
                                  height={150}
                                  alt="profile"
                                  style={{
                                    borderRadius: "50%",
                                    marginBottom: 20,
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <h6>Business Name</h6>
                              <h5 className=" text-dark font-weight-500 ">
                                {retailer?.kyc?.shop_name}
                              </h5>
                            </div>
                            <div
                              className="d-flex justify-content-center text-center"
                              style={{ gap: 20 }}
                            >
                              <div className="text-center w-100 ">
                                <h6>Shop Contact Number</h6>
                                <h5 className=" text-dark font-weight-500 ">
                                  {retailer?.kyc?.shop_contact_number}
                                </h5>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                )}
                <Col className="p-0">
                  <Card
                    className="card-modern"
                    style={{ border: "1px solid #ddd " }}
                  >
                    <Card.Header className="d-flex align-items-center justify-content-between">
                      <Card.Title>Business Details</Card.Title>
                      {retailer?.kyc ? (
                        <div
                          className="d-flex align-items-center"
                          style={{ gap: 10 }}
                        >
                          <div
                            title="Edit Retailer"
                            className="action_btn bg-dark"
                            onClick={() => {
                              navigate(
                                `/retailers/edit-retailer?_id=${retailer?._id}`
                              );
                            }}
                          >
                            <i className="fas fa-pencil-alt text-light"></i>
                          </div>
                        </div>
                      ) : (
                        <Button
                          className="font-weight-semibold"
                          variant="dark"
                          //   size="md"
                          // onClick={() => setKycOpen(true)}
                          onClick={() => {
                            navigate(
                              `/retailers/edit-retailer?_id=${retailer?._id}`
                            );
                          }}
                        >
                          + Add KYC
                        </Button>
                      )}
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col>
                          <div>
                            <h6>Shop Name</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {retailer?.kyc?.shop_name || "-"}
                            </h5>
                          </div>
                          <div>
                            <h6>Business Type</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {retailer?.kyc?.business_type || "-"}
                            </h5>
                          </div>

                          <div>
                            <h6>Shop Contact Number</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {retailer?.kyc?.shop_contact_number || "-"}
                            </h5>
                          </div>
                          <div>
                            <h6>Trade License Number</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {retailer?.kyc?.tradeLicenseNumber || "-"}
                            </h5>
                          </div>
                          {retailer?.kyc && (
                            <div className="">
                              <h6>Trade License </h6>
                              <Button
                                variant="default"
                                onClick={() =>
                                  showFile(
                                    retailer?.kyc?.documents?.tradeLicense
                                  )
                                }
                              >
                                <i className="far fa-eye mr-2"></i>
                                View
                              </Button>
                            </div>
                          )}
                        </Col>
                        <Col>
                          <div>
                            <h6>Trade License Registration Date</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {formatDate(
                                retailer?.kyc?.tradeLicenseRegistrationDate
                              )}
                            </h5>
                          </div>
                          <div>
                            <h6>Trade License Registration Date</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {formatDate(
                                retailer?.kyc?.tradeLicenseExpiryDate
                              )}
                            </h5>
                          </div>
                          <div>
                            <h6>Shop Address</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {retailer?.kyc?.shop_address || "-"}
                            </h5>
                          </div>
                          <div>
                            <h6>Shop Location</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {retailer?.kyc?.shop_location || "-"}
                            </h5>
                          </div>
                          <div>
                            <h6>P.O. Box</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {retailer?.kyc?.post || "-"}
                            </h5>
                          </div>
                        </Col>
                        <Col>
                          {retailer?.kyc && (
                            <div className="">
                              <h6>Shop Photo</h6>
                              <Button
                                variant="default"
                                onClick={() =>
                                  showFile(retailer?.kyc?.shop_photo_logo)
                                }
                              >
                                <i className="far fa-eye mr-2"></i>
                                View
                              </Button>
                            </div>
                          )}
                          <div>
                            <h6>Business Hours</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {retailer?.kyc?.business_hours || "-"}
                            </h5>
                          </div>
                          <div>
                            <h6>Verification Status</h6>
                            {retailer?.kyc ? (
                              <span
                                className={`ecommerce-status ${retailer?.kyc?.kycStatus === "approved"
                                  ? "completed"
                                  : retailer?.kyc?.kycStatus === "rejected"
                                    ? "failed"
                                    : "on-hold"
                                  } text-dark font-weight-500`}
                                style={{ textTransform: "capitalize" }}
                              >
                                {retailer?.kyc?.kycStatus}
                              </span>
                            ) : (
                              "-"
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="preferences" title="Preferences">
              <Row className="">
                <Col>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="m-0 card-title h5 font-weight-bold">
                      Preferences
                    </h5>
                    {retailerPreferences ? (
                      <div
                        className="d-flex align-items-center"
                        style={{ gap: 10 }}
                      >
                        <div
                          title="Edit Retailer"
                          className="action_btn bg-dark"
                          onClick={() => {
                            navigate(
                              `/retailers/edit-retailer?_id=${retailer?._id}`
                            );
                          }}
                        >
                          <i className="fas fa-pencil-alt text-light"></i>
                        </div>
                      </div>
                    ) : (
                      <Button
                        className="font-weight-semibold"
                        variant="dark"
                        //   size="md"
                        onClick={() => {
                          navigate(
                            `/retailers/edit-retailer?_id=${retailer?._id}`
                          );
                        }}
                      >
                        + Add Preferences
                      </Button>
                    )}
                  </div>
                  <Row>
                    <Col>
                      <div>
                        <h6>Preferred Brands</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                        // style={{ textTransform: "capitalize" }}
                        >
                          {retailerPreferences?.brands?.length > 0
                            ? retailerPreferences.brands
                              .map((brand: any) => brand?.brandId?.name)
                              .join(", ")
                            : "-"}
                        </h5>
                      </div>
                      {retailerPreferences?.averageMonthlyVolume ? (
                        <div>
                          <h6>Average Monthly Purchase Volume</h6>
                          <h5
                            className=" text-dark font-weight-500 "
                          // style={{ textTransform: "capitalize" }}
                          >
                            {retailerPreferences?.averageMonthlyVolume}
                          </h5>
                        </div>
                      ) : null}
                      <div>
                        <h6>Preferred Payment Method</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                        // style={{ textTransform: "capitalize" }}
                        >
                          {retailerPreferences?.paymentMethod || "-"}
                        </h5>
                      </div>
                      {retailerPreferences?.paymentMethod ===
                        "Credit Terms" && (
                          <div>
                            <h6>Credit Period </h6>
                            <h5
                              className=" text-dark font-weight-500 "
                            // style={{ textTransform: "capitalize" }}
                            >
                              {retailerPreferences?.creditDays
                                ? `${retailerPreferences.creditDays} Days`
                                : "-"}
                            </h5>
                          </div>
                        )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="subscription" title="Subscription">
              <Row className="">
                <Col>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="m-0 card-title h5 font-weight-bold">
                      Subscription
                    </h5>
                    {retailerActivePlan ? (
                      <div
                        className="d-flex align-items-center"
                        style={{ gap: 10 }}
                      >
                        <div
                          title="Edit Retailer"
                          className="action_btn bg-dark"
                          onClick={() => {
                            navigate(
                              `/retailers/edit-retailer?_id=${retailer?._id}`
                            );
                          }}
                        >
                          <i className="fas fa-pencil-alt text-light"></i>
                        </div>
                      </div>
                    ) : (
                      <Button
                        className="font-weight-semibold"
                        variant="dark"
                        onClick={() => {
                          navigate(
                            `/retailers/edit-retailer?_id=${retailer?._id}`
                          );
                        }}
                      >
                        + Purchase Plan
                      </Button>
                    )}
                  </div>
                  <Row>
                    <Col>
                      <div>
                        <h6>Subscription Order ID</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                        // style={{ textTransform: "capitalize" }}
                        >
                          {retailerActivePlan?.subId || "-"}
                        </h5>
                      </div>
                      <div>
                        <h6>Subscription Plan</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          style={{ textTransform: "capitalize" }}
                        >
                          {retailerActivePlan?.planDetails?.plan || "-"}
                        </h5>
                      </div>
                      <div>
                        <h6>Duration</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          style={{ textTransform: "capitalize" }}
                        >
                          {retailerActivePlan?.durationType || "-"}
                        </h5>
                      </div>
                      <div>
                        <h6>Plan Price </h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          style={{ textTransform: "capitalize" }}
                        >
                          {/* {formatCurrency( */}
                          {retailerActivePlan?.planDetails?.price_monthly || 0}
                          {/* )} */}
                          {" "}
                          / Month
                        </h5>
                      </div>
                      <div>
                        <h6>Total</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          style={{ textTransform: "capitalize" }}
                        >
                          {formatCurrency(
                            retailerActivePlan?.total_amount || 0
                          )}
                        </h5>
                      </div>
                    </Col>
                    <Col>
                      <div>
                        <h6>Purchased Date</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          style={{ textTransform: "capitalize" }}
                        >
                          {formatDate(retailerActivePlan?.purchased_Date)}
                        </h5>
                      </div>
                      <div>
                        <h6>Start Date</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          style={{ textTransform: "capitalize" }}
                        >
                          {formatDate(retailerActivePlan?.plan_start_date)}
                        </h5>
                      </div>
                      <div>
                        <h6>End Date</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          style={{ textTransform: "capitalize", display: "flex", gap: "5px" }}
                        >
                          {formatDate(retailerActivePlan?.plan_end_date)}
                          <div
                            className="action_btn "
                            onClick={() => { setStatusOpensub(true) }}
                          >
                            <i className="fas fa-pencil-alt"></i>
                          </div>

                        </h5>
                      </div>
                      <div>
                        <h6>Next Billing Date</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          style={{ textTransform: "capitalize" }}
                        >
                          {formatDate(retailerActivePlan?.next_billing_date)}
                        </h5>
                      </div>
                    </Col>
                    <Col>
                      <div>
                        <h6>Trial Period</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          style={{ textTransform: "capitalize" }}
                        >
                          {retailerActivePlan?.trial_period || "-"}
                        </h5>
                      </div>
                      <div>
                        <h6>Payment Status</h6>
                        {retailerActivePlan?.paymentStatus ? (
                          <span
                            className={`ecommerce-status ${retailerActivePlan?.paymentStatus === "paid"
                              ? "completed"
                              : retailerActivePlan?.paymentStatus === "failed"
                                ? "failed"
                                : "on-hold"
                              } text-dark font-weight-500`}
                            style={{ textTransform: "capitalize" }}
                          >
                            {retailerActivePlan?.paymentStatus}
                          </span>
                        ) : (
                          "-"
                        )}
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </div>

        {/* <Row className="pt-0">
          <Col lg={3} className="py-3">
            <Card className={`card-modern  `}>
              <Card.Body className="py-4 box text-dark">
                <Row className="align-items-center justify-content-between">
                  <Col
                    // sm={4}
                    className="col-12"
                  >
                    <h3
                      className="text-4-1 my-0 "
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Total Orders
                    </h3>
                    <strong className="text-6 ">
                      {formatNumberShort(orders?.total || 0)}
                    </strong>
                  </Col>

                  <Col
                    sm={4}
                    className="text-center text-sm-right ml-auto  mt-4 mt-sm-0 d-flex justify-content-end"
                  >
                    <i className="bx bx-hourglass icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} className="py-3">
            <Card className={`card-modern  `}>
              <Card.Body className="py-4 box text-dark">
                <Row className="align-items-center justify-content-between">
                  <Col
                    // sm={4}
                    className="col-12"
                  >
                    <h3
                      className="text-4-1 my-0 "
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Completed Orders
                    </h3>
                    <strong className="text-6 ">
                      {formatNumberShort(
                        orders?.count?.delivered[0]?.total || 0
                      )}
                    </strong>
                  </Col>

                  <Col
                    sm={4}
                    className="text-center text-sm-right ml-auto  mt-4 mt-sm-0 d-flex justify-content-end"
                  >
                    <i className="bx bx-hourglass icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} className="py-3">
            <Card className={`card-modern `}>
              <Card.Body className="py-4 box text-dark">
                <Row className="align-items-center justify-content-between">
                  <Col
                    // sm={4}
                    className="col-12"
                  >
                    <h3
                      className="text-4-1 my-0"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Pending Orders
                    </h3>
                    <strong className="text-6 ">
                      {formatNumberShort(
                        orders?.count?.pending[0]?.total +
                          orders?.count?.in_progress[0]?.total || 0
                      )}
                    </strong>
                  </Col>
                  <Col
                    sm={4}
                    className="text-center text-sm-right ml-auto mt-4 mt-sm-0 d-flex justify-content-end"
                  >
                    <i className="bx bx-dollar icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} className="py-3">
            <Card className={`card-modern `}>
              <Card.Body className="py-4 box text-dark">
                <Row className="align-items-center justify-content-between">
                  <Col
                    // sm={4}
                    className="col-12"
                  >
                    <h3
                      className="text-4-1 my-0"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Cancelled Orders
                    </h3>
                    <strong className="text-6 ">
                      {formatNumberShort(
                        orders?.count?.cancelled[0]?.total || 0
                      )}
                    </strong>
                  </Col>
                  <Col
                    sm={4}
                    className="text-center text-sm-right ml-auto mt-4 mt-sm-0 d-flex justify-content-end"
                  >
                    <i className="bx bx-dollar icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row> */}
        <div
          className="tabs"
          style={{ borderRadius: "5px", marginTop: "20px", overflow: "hidden" }}
        >
          <Tabs className="nav-justified">
            <Tab eventKey="orders" title="Orders">
              <RetailerOrdersList
                orders={orders}
                ordersLoading={ordersLoading}
                retailerId={retailerID ? retailerID : ""}
                setPage={setPage}
                setLimit={setLimit}
                setSearch={setSearch}
                page={page}
                limit={limit}
                search={search}
              />
            </Tab>
            <Tab eventKey="claims" title="Claims">
              <RetailerClaimList
                retailerID={retailerID ? retailerID : ""}
                claims={claims}
                claimsLoading={claimLoading}
                setPage={setClaimPage}
                setLimit={setClaimLimit}
                setSearch={setClaimSearch}
                page={claimPage}
                limit={claimLimit}
                search={claimSearch}
              />
            </Tab>
          </Tabs>
        </div>
      </div>

      {verifyKyc && (
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
                color: "#fff",
                width: 20,
                height: 20,
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                fontSize: 15,
              }}
              onClick={() => setVerifyKyc(false)}
            >
              <i style={{ color: "#000" }} className="fas fa-xmark"></i>
            </div>

            <div>
              <h3 className="mt-0 p-0 " style={{ fontSize: 17 }}>
                Retailer Verification
              </h3>
              <p
                className="m-0"
                style={{ fontWeight: "normal" }}
              >
                Please verify the profile details and documents before approving
                or rejecting the retailer.
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
                className=""
                variant="success"
                //   size="md"
                onClick={() => set_is_kyc_approve_open(true)}
              >
                Approve
              </Button>
              <Button
                className=""
                variant="danger"
                //   size="md"
                onClick={() => set_is_kyc_reject_open(true)}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationPopup
        submit={() => handleChangeStatus(retailer?._id, retailer?.isSuspend)}
        isOpen={isStatusOpen}
        toggle={() => setStatusOpen(!isStatusOpen)}
        text={
          "Are you sure that you want to change the status of this retailer?"
        }
      />

      <ConfirmationPopup
        submit={() => { setStatusOpensub(false), setEditOpenSub(true) }}
        isOpen={isStatusOpensub}
        toggle={() => setStatusOpensub(!isStatusOpensub)}
        text={
          "Are you sure that you want to update subscription expire data?"
        }
      />


      <ConfirmationPopup
        submit={() => handleKycVerification(retailer?._id, "approved")}
        isOpen={is_kyc_approve_open}
        toggle={() => set_is_kyc_approve_open(!is_kyc_approve_open)}
        text={"Are you sure that you want to approve this kyc?"}
      />
      <ConfirmationPopup
        submit={() => handleKycVerification(retailer?._id, "rejected")}
        isOpen={is_kyc_reject_open}
        toggle={() => set_is_kyc_reject_open(!is_kyc_reject_open)}
        text={"Are you sure that you want to reject this kyc?"}
      />
      <EditRetailer
        retailerId={retailerID ? retailerID : ""}
        isOpen={isEditOpen}
        toggle={() => setEditOpen(!isEditOpen)}
      />

      {/* edit sub end data  */}
      <EditOrder
        orderId={retailerActivePlan?._id}
        isOpen={isEditOpenSub}
        toggle={() => setEditOpenSub(!isEditOpenSub)}
        data={retailerActivePlan}
      />


    </>
  );
};

export default RetailersDetailPage;
