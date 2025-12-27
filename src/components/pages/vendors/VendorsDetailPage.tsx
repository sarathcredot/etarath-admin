import React, { useEffect, useMemo, useState } from "react";
import { Col, Row, Tabs, Tab, Card, Button } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumb from "src/components/common/breadcrumb";
import PtSwitch from "src/components/features/elements/switch";
import { toast } from "react-toastify";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";

import EditVendor from "./popups/EditVendor";
import {
  useGetAgentsByVendorId,
  useGetOrdersByVendorId,
  useGetStocksByVendorId,
  useGetVendorById,
  useUpdateVendorStatus,
} from "src/services/vendor.service";
import { User } from "src/types/types";
import { generateFilePath } from "src/services/url.service";
import VendorStocksList from "./VendorStocksList";
import AddBussinessDetails from "./popups/AddBussinessDetails";
import { useKycVerification } from "src/services/kyc.service";
import EditBussinessDetails from "./popups/EditBussinessDetails";
import {
  formatCurrency,
  formatDate,
  formatNumberShort,
} from "src/utils/formats";
import SalesExecutivesList from "./SalesExecutivesList";
import VendorOrdersList from "./VendorOrdersList";
import { useGetPreferenceByUserId } from "src/services/preference.service";
import { useGetSubscriptionOrderById } from "src/services/subscription-orders";
import VendorWarehousesList from "./VendorWarehousesList";

const VendorsDetailPage = () => {
  //IMPORTS
  const [searchParams] = useSearchParams();
  const vendorID = searchParams.get("_id");
  const navigate = useNavigate();

  //STATE
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [isKycEditOpen, setKycEditOpen] = useState<boolean>(false);
  const [isStatusOpen, setStatusOpen] = useState<boolean>(false);
  const [verifyKyc, setVerifyKyc] = useState<boolean>(false);
  const [is_kyc_approve_open, set_is_kyc_approve_open] =
    useState<boolean>(false);
  const [is_kyc_reject_open, set_is_kyc_reject_open] = useState<boolean>(false);
  const [isKycOpen, setKycOpen] = useState<boolean>(false);
  //pagination
  const [page, setPage] = useState<number>(1);
  const [orderPage, setOrderPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [orderSearch, setOrderSearch] = useState<string>("");

  //USE MEMO
  const orderQueryObj = useMemo(() => {
    const obj: any = {};

    if (orderPage) {
      obj.page = orderPage;
    }

    if (limit) {
      obj.limit = limit;
    }

    if (orderSearch) {
      obj.search = orderSearch;
    }

    if (vendorID) {
      obj.vendorID = vendorID;
    }

    return obj;
  }, [orderPage, limit, orderSearch, vendorID]);

  // QUERIES
  const { data: stocks, isLoading: stocksLoading } = useGetStocksByVendorId(
    vendorID ? vendorID : "",
    !!vendorID
  );
  const { data: orders, isLoading: ordersLoading } = useGetOrdersByVendorId(
    vendorID ? vendorID : "",
    !!vendorID
  );
  const { data: agents, isLoading: agentsLoading } = useGetAgentsByVendorId(
    vendorID ? vendorID : "",
    !!vendorID
  );
  const { data: vendor, isLoading: isVendorLoading } = useGetVendorById(
    vendorID ? vendorID : "",
    !!vendorID
  ) as {
    data: User;
    isLoading: boolean;
  };

  const { data: vendorPreferences, isLoading: isPreferenceLoading } =
    useGetPreferenceByUserId(vendorID ? vendorID : "", !!vendorID);

  const { data: vendorActivePlan, isLoading: isActivePlanLoading } =
    useGetSubscriptionOrderById(vendor?.active_plan);

  //MUTATIONS
  const { mutateAsync: updateVendorStatus } = useUpdateVendorStatus();
  const { mutateAsync: kycVerification } = useKycVerification();

  //HANDLERS
  const handleChangeStatus = async (vendorId: string, isActive: boolean) => {
    try {
      if (!vendorId) throw new Error("Vendor ID is required!");
      if (typeof isActive !== "boolean")
        throw new Error("Unexpected Active status!");

      const resp = await updateVendorStatus({
        id: vendorId,
        isActive: !isActive,
      });

      setStatusOpen(false);
      toast(resp?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });
    } catch (error) {
      toast("Can't update Vendor right now, please try later!", {
        containerId: "default",
        className: "no-icon notification-danger",
      });
      setStatusOpen(false);
    }
  };
  const handleKycVerification = async (vendorId: string, status: string) => {
    try {
      if (!vendorId) throw new Error("Vendor ID is required!");
      const resp = await kycVerification({
        userId: vendorId,
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
    if (vendor && vendor?.kyc && vendor?.kyc?.kycStatus === "pending") {
      setVerifyKyc(true);
    }
  }, [vendor]);

  return (
    <>
      <Breadcrumb
        current={
          vendor?.kyc?.business_name
            ? vendor?.kyc?.business_name
            : "Vendor Detail"
        }
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "vendors",
            url: "/vendors",
          },
          {
            name: "vendor detail",
            url: `/vendors/detail?_id=${vendorID}`,
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
              <Row className="px-3" style={{ gap: 15 }}>
                {vendor?.kyc && (
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
                                    vendor?.kyc?.vendor_logo
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
                                {vendor?.kyc?.business_name}
                              </h5>
                            </div>
                            <div
                              className="d-flex justify-content-center text-center"
                              style={{ gap: 20 }}
                            >
                              <div className="text-center w-100 ">
                                <h6>Shop Contact Number</h6>
                                <h5 className=" text-dark font-weight-500 ">
                                  {vendor?.kyc?.phoneNumber}
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
                      <Card.Title>Profile Details</Card.Title>
                      {vendor?.kyc ? (
                        <div
                          className="d-flex align-items-center"
                          style={{ gap: 10 }}
                        >
                          <div
                            title="Edit Vendor"
                            className="action_btn bg-dark"
                            onClick={() => {
                              navigate(
                                `/vendors/edit-vendor?_id=${vendor?._id}`
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
                            navigate(`/vendors/edit-vendor?_id=${vendor?._id}`);
                          }}
                        >
                          + Add Profile
                        </Button>
                      )}
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col>
                          <div>
                            <h6>Business Name</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {vendor?.kyc?.business_name || "-"}
                            </h5>
                          </div>
                          {/* <div>
                            <h6>Business Type</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {vendor?.kyc?.business_type || "-"}
                            </h5>
                          </div> */}
                          <div>
                            <h6>Shop Contact Number</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {vendor?.kyc?.phoneNumber || "-"}
                            </h5>
                          </div>
                          <div>
                            <h6>Email</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {vendor?.kyc?.email || "-"}
                            </h5>
                          </div>
                          <div>
                            <h6>Trade License Number</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {vendor?.kyc?.tradeLicenseNumber || "-"}
                            </h5>
                          </div>
                          {vendor?.kyc && (
                            <div className="">
                              <h6>Trade License </h6>
                              <Button
                                variant="default"
                                onClick={() =>
                                  showFile(vendor?.kyc?.documents?.tradeLicense)
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
                                vendor?.kyc?.tradeLicenseRegistrationDate
                              )}
                            </h5>
                          </div>
                          <div>
                            <h6>Trade License Registration Date</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {formatDate(vendor?.kyc?.tradeLicenseExpiryDate)}
                            </h5>
                          </div>
                          <div>
                            <h6>Business Address</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {vendor?.kyc?.business_address || "-"}
                            </h5>
                          </div>
                          <div>
                            <h6>Shop Location</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {vendor?.kyc?.location || "-"}
                            </h5>
                          </div>
                          {/* <div>
                            <h6>City</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {vendor?.kyc?.city || "-"}
                            </h5>
                          </div> */}
                          <div>
                            <h6>P.O. Box</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {vendor?.kyc?.post || "-"}
                            </h5>
                          </div>
                        </Col>
                        <Col>
                          {vendor?.kyc && (
                            <div className="">
                              <h6>Shop Photo</h6>
                              <Button
                                variant="default"
                                onClick={() =>
                                  showFile(vendor?.kyc?.shop_photo_logo)
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
                              {vendor?.kyc?.business_hours || "-"}
                            </h5>
                          </div>
                          <div>
                            <h6>Verification Status</h6>
                            {vendor?.kyc ? (
                              <span
                                className={`ecommerce-status ${
                                  vendor?.kyc?.kycStatus === "approved"
                                    ? "completed"
                                    : vendor?.kyc?.kycStatus === "rejected"
                                    ? "failed"
                                    : "on-hold"
                                } text-dark font-weight-500`}
                                style={{ textTransform: "capitalize" }}
                              >
                                {vendor?.kyc?.kycStatus}
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
            <Tab eventKey="contact" title="Contact Details">
              <Row className="">
                <Col>
                  {/* <Card
                    className="card-modern"
                    style={{ border: "2px solid #ddd " }}
                  >
                    <Card.Header className="d-flex align-items-center justify-content-between"> */}
                  {/* <Card.Title>Business Details</Card.Title> */}
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="m-0 card-title h5 font-weight-bold">
                      Contact Details
                    </h5>
                    {vendor ? (
                      <div
                        className="d-flex align-items-center"
                        style={{ gap: 10 }}
                      >
                        <div
                          title="Edit Vendor"
                          className="action_btn bg-dark"
                          onClick={() => {
                            navigate(`/vendors/edit-vendor?_id=${vendor?._id}`);
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
                        + Add Contact Details
                      </Button>
                    )}
                  </div>

                  {/* </Card.Header> */}
                  {/* <Card.Body> */}
                  <Row>
                    <Col>
                      <div>
                        <h6>Contact Person Name</h6>
                        <h5 className=" text-dark font-weight-500 ">
                          {vendor?.userName || "-"}
                        </h5>
                      </div>
                      {/* <div>
                            <h6>Business Type</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {vendor?.kyc?.business_type || "-"}
                            </h5>
                          </div> */}
                      <div>
                        <h6>Contact Person Phone Number</h6>
                        <h5 className=" text-dark font-weight-500 ">
                          {vendor?.phoneNumber || "-"}
                        </h5>
                      </div>
                      <div>
                        <h6>Contact Person Email</h6>
                        <h5 className=" text-dark font-weight-500 ">
                          {vendor?.email || "-"}
                        </h5>
                      </div>
                      <div>
                        <h6>Designation</h6>
                        <h5 className=" text-dark font-weight-500 ">
                          {vendor?.designation || "-"}
                        </h5>
                      </div>
                      <div>
                        <h6>Preferred Language for Communication</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          style={{ textTransform: "capitalize" }}
                        >
                          {vendor?.language?.length > 0
                            ? vendor.language.join(", ")
                            : "-"}
                        </h5>
                      </div>
                    </Col>
                  </Row>
                  {/* </Card.Body> */}
                  {/* </Card> */}
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
                    {vendorPreferences ? (
                      <div
                        className="d-flex align-items-center"
                        style={{ gap: 10 }}
                      >
                        <div
                          title="Edit Vendor"
                          className="action_btn bg-dark"
                          onClick={() => {
                            navigate(`/vendors/edit-vendor?_id=${vendor?._id}`);
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
                          navigate(`/vendors/edit-vendor?_id=${vendor?._id}`);
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
                          {vendorPreferences?.brands?.length > 0
                            ? vendorPreferences.brands
                                .map((brand: any) => brand?.brandId?.name)
                                .join(", ")
                            : "-"}
                        </h5>
                      </div>
                      <div>
                        <h6>Authorised Brands</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          // style={{ textTransform: "capitalize" }}
                        >
                          {vendorPreferences?.authorised_brands?.length > 0
                            ? vendorPreferences.authorised_brands
                                .map((brand: any) => brand?.brandId?.name)
                                .join(", ")
                            : "-"}
                        </h5>
                      </div>
                      <div>
                        <h6>Preferred Payment Method</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          // style={{ textTransform: "capitalize" }}
                        >
                          {vendorPreferences?.paymentMethod || "-"}
                        </h5>
                      </div>
                      {vendorPreferences?.paymentMethod === "Credit Terms" && (
                        <div>
                          <h6>Credit Period </h6>
                          <h5
                            className=" text-dark font-weight-500 "
                            // style={{ textTransform: "capitalize" }}
                          >
                            {vendorPreferences?.creditDays
                              ? `${vendorPreferences.creditDays} Days`
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
                    {vendorActivePlan ? (
                      <div
                        className="d-flex align-items-center"
                        style={{ gap: 10 }}
                      >
                        <div
                          title="Edit Vendor"
                          className="action_btn bg-dark"
                          onClick={() => {
                            navigate(`/vendors/edit-vendor?_id=${vendor?._id}`);
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
                          navigate(`/vendors/edit-vendor?_id=${vendor?._id}`);
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
                          {vendorActivePlan?.subId || "-"}
                        </h5>
                      </div>
                      <div>
                        <h6>Subscription Plan</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          style={{ textTransform: "capitalize" }}
                        >
                          {vendorActivePlan?.planId?.plan || "-"}
                        </h5>
                      </div>
                      <div>
                        <h6>Duration</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          style={{ textTransform: "capitalize" }}
                        >
                          {vendorActivePlan?.durationType || "-"}
                        </h5>
                      </div>
                      <div>
                        <h6>Plan Price</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          style={{ textTransform: "capitalize" }}
                        >
                          {formatCurrency(vendorActivePlan?.plan_price || 0)}
                        </h5>
                      </div>
                      <div>
                        <h6>Total</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          style={{ textTransform: "capitalize" }}
                        >
                          {formatCurrency(vendorActivePlan?.total_amount || 0)}
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
                          {formatDate(vendorActivePlan?.purchased_Date)}
                        </h5>
                      </div>
                      <div>
                        <h6>Start Date</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          style={{ textTransform: "capitalize" }}
                        >
                          {formatDate(vendorActivePlan?.plan_start_date)}
                        </h5>
                      </div>
                      <div>
                        <h6>End Date</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          style={{ textTransform: "capitalize" }}
                        >
                          {formatDate(vendorActivePlan?.plan_end_date)}
                        </h5>
                      </div>
                      <div>
                        <h6>Next Billing Date</h6>
                        <h5
                          className=" text-dark font-weight-500 "
                          style={{ textTransform: "capitalize" }}
                        >
                          {formatDate(vendorActivePlan?.next_billing_date)}
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
                          {vendorActivePlan?.trial_period || "-"}
                        </h5>
                      </div>
                      <div>
                        <h6>Payment Status</h6>
                        {vendorActivePlan?.paymentStatus ? (
                          <span
                            className={`ecommerce-status ${
                              vendorActivePlan?.paymentStatus === "paid"
                                ? "completed"
                                : vendorActivePlan?.paymentStatus === "failed"
                                ? "failed"
                                : "on-hold"
                            } text-dark font-weight-500`}
                            style={{ textTransform: "capitalize" }}
                          >
                            {vendorActivePlan?.paymentStatus}
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
            <Card className={`card-modern   `}>
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
                      Total Products
                    </h3>
                    <strong className="text-6 ">
                      {formatNumberShort(stocks?.total || 0)}
                    </strong>
                  </Col>
                  <Col
                    sm={4}
                    className="text-center text-sm-right ml-auto  mt-4 mt-sm-0 d-flex justify-content-end"
                  >
                    <i className="bx bx-group icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
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
        </Row> */}

        <div
          className="tabs"
          style={{ borderRadius: "5px", marginTop: "20px", overflow: "hidden" }}
        >
          <Tabs className="nav-justified">
            <Tab eventKey="products" title="Products">
              <VendorStocksList
                vendorId={vendorID ? vendorID : ""}
                stocks={stocks}
                stocksLoading={stocksLoading}
              />
            </Tab>
            <Tab eventKey="orders" title="Orders">
              <VendorOrdersList
                vendorId={vendorID ? vendorID : ""}
                orders={orders}
                ordersLoading={ordersLoading}
              />
            </Tab>
            <Tab eventKey="warehouses" title="Warehouses">
              <VendorWarehousesList vendorId={vendorID ? vendorID : ""} />
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
              background: "#FF600F",
              color: "#fff",
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
              <i className="fas fa-xmark"></i>
            </div>

            <div>
              <h3 className="mt-0 p-0 " style={{ color: "#fff", fontSize: 17 }}>
                Vendor Verification
              </h3>
              <p
                className="m-0"
                style={{ color: "#fff", fontWeight: "normal" }}
              >
                Please verify the profile details and documents before approving
                or rejecting the vendor.
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
        submit={() => handleChangeStatus(vendor?._id, vendor?.isSuspend)}
        isOpen={isStatusOpen}
        toggle={() => setStatusOpen(!isStatusOpen)}
        text={"Are you sure that you want to change the status of this vendor?"}
      />
      <ConfirmationPopup
        submit={() => handleKycVerification(vendor?._id, "approved")}
        isOpen={is_kyc_approve_open}
        toggle={() => set_is_kyc_approve_open(!is_kyc_approve_open)}
        text={"Are you sure that you want to approve this kyc?"}
      />
      <ConfirmationPopup
        submit={() => handleKycVerification(vendor?._id, "rejected")}
        isOpen={is_kyc_reject_open}
        toggle={() => set_is_kyc_reject_open(!is_kyc_reject_open)}
        text={"Are you sure that you want to reject this kyc?"}
      />
      <EditVendor
        vendorId={vendorID ? vendorID : ""}
        isOpen={isEditOpen}
        toggle={() => setEditOpen(!isEditOpen)}
      />

      <AddBussinessDetails
        isOpen={isKycOpen}
        toggle={() => setKycOpen(!isKycOpen)}
        userId={vendor ? vendor?._id : vendorID ? vendorID : ""}
      />
      <EditBussinessDetails
        isOpen={isKycEditOpen}
        toggle={() => setKycEditOpen(!isKycEditOpen)}
        userId={vendor ? vendor?._id : vendorID ? vendorID : ""}
      />
    </>
  );
};

export default VendorsDetailPage;
