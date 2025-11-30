import React, { useMemo, useState } from "react";
import { Col, Row, Tabs, Tab, Card, Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "src/components/common/breadcrumb";
import PtSwitch from "src/components/features/elements/switch";
import { toast } from "react-toastify";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";

import { User } from "src/types/types";
import { generateFilePath } from "src/services/url.service";
import { useKycVerification } from "src/services/kyc.service";
import EditRetailer from "./popups/EditRetailer";
import AddBussinessDetails from "../vendors/popups/AddBussinessDetails";
import EditBussinessDetails from "../vendors/popups/EditBussinessDetails";
import {
  useGetOrdersByRetailerId,
  useGetRetailerById,
  useUpdateRetailerStatus,
} from "src/services/retailer.service";
import RetailerOrdersList from "./RetailerOrdersList";
import { formatNumberShort } from "src/utils/formats";

const RetailersDetailPage = () => {
  //IMPORTS
  const [searchParams] = useSearchParams();
  const retailerID = searchParams.get("_id");

  //STATE
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [isKycEditOpen, setKycEditOpen] = useState<boolean>(false);
  const [isStatusOpen, setStatusOpen] = useState<boolean>(false);
  const [is_kyc_approve_open, set_is_kyc_approve_open] =
    useState<boolean>(false);
  const [is_kyc_reject_open, set_is_kyc_reject_open] = useState<boolean>(false);
  const [isKycOpen, setKycOpen] = useState<boolean>(false);
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

    if (retailerID) {
      obj.retailerID = retailerID;
    }

    return obj;
  }, [page, limit, search]);

  // QUERIES
  const { data: retailer, isLoading: isRetailerLoading } = useGetRetailerById(
    retailerID ? retailerID : "",
    !!retailerID
  ) as {
    data: User;
    isLoading: boolean;
  };
  const { data: orders, isLoading: ordersLoading } = useGetOrdersByRetailerId(
    retailerID ? retailerID : "",
    !!retailerID
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
        <Row>
          <Col
            lg={12}
            // className="mt-5"
          >
            <Card className="card-modern" style={{ minHeight: "100%" }}>
              <Card.Header className="d-flex align-items-center justify-content-between">
                <Card.Title>Details</Card.Title>
                <div
                  className="action_btn "
                  onClick={() => {
                    setEditOpen(true);
                  }}
                >
                  <i className="fas fa-pencil-alt"></i>
                </div>
              </Card.Header>
              <Card.Body>
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
                          // style={{ borderRadius: "50%" }}
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
                      <h6>Email</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {retailer?.email || "-"}
                      </h5>
                    </div>
                    <div>
                      <h6>Phone Number</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {retailer?.phoneNumber || "-"}
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
                    {retailer?.eidFile && (
                      <div className="mt-3 ">
                        <Button
                          variant="dark"
                          onClick={() => showFile(retailer?.eidFile)}
                        >
                          {/* <i className="fas fa-arrow-up-from-bracket"></i> */}
                          EID Document
                        </Button>
                      </div>
                    )}
                    <div className="pt-2">
                      <h6>Verification Status</h6>
                      <span
                        className={`ecommerce-status ${
                          retailer?.isVerified === "approved"
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div
          className="tabs"
          style={{ borderRadius: "5px", marginTop: "20px", overflow: "hidden" }}
        >
          <Tabs className="nav-justified">
            <Tab eventKey="kyc" title="Business Details">
              <Row>
                {retailer?.kyc && (
                  <Col lg={4}>
                    <Card
                      className="card-modern"
                      style={{ border: "2px solid #ddd ", height: "100%" }}
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
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <h6>Shop Name</h6>
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
                <Col>
                  <Card
                    className="card-modern"
                    style={{ border: "2px solid #ddd " }}
                  >
                    <Card.Header className="d-flex align-items-center justify-content-between">
                      <Card.Title>Business Details</Card.Title>
                      {retailer?.kyc ? (
                        <div
                          className="d-flex align-items-center"
                          style={{ gap: 10 }}
                        >
                          {retailer?.kyc?.kycStatus === "pending" && (
                            <>
                              <div
                                title="Approve KYC"
                                className="action_btn bg-success"
                                onClick={() => {
                                  set_is_kyc_approve_open(true);
                                }}
                              >
                                <i className="fas fa-check text-light"></i>
                              </div>
                              <div
                                title="Reject KYC"
                                className="action_btn bg-danger"
                                onClick={() => {
                                  set_is_kyc_reject_open(true);
                                }}
                              >
                                <i className="fas fa-x-mark text-light"></i>
                              </div>
                            </>
                          )}
                          <div
                            title="Edit KYC"
                            className="action_btn bg-dark"
                            onClick={() => {
                              setKycEditOpen(true);
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
                          + Add Business Details
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
                            <div className="mt-3">
                              <Button
                                variant="dark"
                                onClick={() =>
                                  showFile(
                                    retailer?.kyc?.documents?.tradeLicense
                                  )
                                }
                              >
                                {/* <i className="fas fa-arrow-up-from-bracket"></i> */}
                                Trade License
                              </Button>
                            </div>
                          )}
                        </Col>
                        <Col>
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
                            <h6>City</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {retailer?.kyc?.city || "-"}
                            </h5>
                          </div>
                          <div>
                            <h6>Post</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {retailer?.kyc?.post || "-"}
                            </h5>
                          </div>
                          {retailer?.kyc && (
                            <div className="mt-3">
                              <Button
                                variant="dark"
                                onClick={() =>
                                  showFile(retailer?.kyc?.shop_photo_logo)
                                }
                              >
                                {/* <i className="fas fa-arrow-up-from-bracket"></i> */}
                                Shop Photo
                              </Button>
                            </div>
                          )}
                        </Col>
                        <Col>
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
                                className={`ecommerce-status ${
                                  retailer?.kyc?.kycStatus === "approved"
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
            {/* <Tab eventKey="orders" title="Orders">
              <RetailerOrdersList
                orders={orders}
                ordersLoading={ordersLoading}
                page={page}
                setPage={setPage}
                retailerId={retailerID ? retailerID : ""}
              />
            </Tab> */}
          </Tabs>
        </div>
      </div>
      <ConfirmationPopup
        submit={() => handleChangeStatus(retailer?._id, retailer?.isSuspend)}
        isOpen={isStatusOpen}
        toggle={() => setStatusOpen(!isStatusOpen)}
        text={
          "Are you sure that you want to change the status of this retailer?"
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

      <AddBussinessDetails
        isOpen={isKycOpen}
        toggle={() => setKycOpen(!isKycOpen)}
        userId={retailer ? retailer?._id : retailerID ? retailerID : ""}
      />
      <EditBussinessDetails
        isOpen={isKycEditOpen}
        toggle={() => setKycEditOpen(!isKycEditOpen)}
        userId={retailer ? retailer?._id : retailerID ? retailerID : ""}
      />
    </>
  );
};

export default RetailersDetailPage;
