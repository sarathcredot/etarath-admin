import React, { useMemo, useState } from "react";
import { Col, Row, Tabs, Tab, Card, Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "src/components/common/breadcrumb";
import PtSwitch from "src/components/features/elements/switch";
import { toast } from "react-toastify";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";

import EditVendor from "./forms/EditVendor";
import {
  useGetVendorById,
  useUpdateVendorStatus,
} from "src/services/vendor.service";
import { User } from "src/types/user.types";
import { generateFilePath } from "src/services/url.service";
import VendorStocksList from "./VendorStocksList";
import AddBussinessDetails from "./forms/AddBussinessDetails";
import { useKycVerification } from "src/services/kyc.service";
import EditBussinessDetails from "./forms/EditBussinessDetails";

const VendorsDetailPage = () => {
  //IMPORTS
  const [searchParams] = useSearchParams();
  const vendorID = searchParams.get("_id");

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

    if (vendorID) {
      obj.vendorID = vendorID;
    }

    return obj;
  }, [page, limit, search]);

  // QUERIES
  const { data: vendor, isLoading: isVendorLoading } = useGetVendorById(
    vendorID ? vendorID : "",
    !!vendorID
  ) as {
    data: User;
    isLoading: boolean;
  };

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
        current={"Vendor Detail"}
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
                          src={generateFilePath(vendor?.imgUrl)}
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
                        {vendor?.userName || "-"}
                      </h5>
                    </div>
                    <div>
                      <h6>Email</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {vendor?.email || "-"}
                      </h5>
                    </div>
                    <div>
                      <h6>Phone Number</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {vendor?.phoneNumber || "-"}
                      </h5>
                    </div>
                  </Col>
                  <Col>
                    <div>
                      <h6>EID No</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {vendor?.eidNo || "-"}
                      </h5>
                    </div>
                    {vendor?.eidFile && (
                      <div className="mt-3 ">
                        <Button
                          variant="dark"
                          onClick={() => showFile(vendor?.eidFile)}
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
                          vendor?.isVerified === "approved"
                            ? "completed"
                            : vendor?.isVerified === "rejected"
                            ? "failed"
                            : "on-hold"
                        } text-dark font-weight-500`}
                      >
                        {vendor?.isVerified|| "-"}
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
                          on={!vendor?.isSuspend}
                          size="sm"
                          variant="success"
                        />
                        <h5 className=" text-dark font-weight-500 ">
                          {!vendor?.isSuspend ? "Active" : "Blocked"}
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
            <Tab eventKey="kyc" title="Bussiness Details">
              <Row>
                {vendor?.kyc && (
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
                                    vendor?.kyc?.shop_photo_logo
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
                                {vendor?.kyc?.shop_name}
                              </h5>
                            </div>
                            <div
                              className="d-flex justify-content-center text-center"
                              style={{ gap: 20 }}
                            >
                              <div className="text-center w-100 ">
                                <h6>Shop Contact Number</h6>
                                <h5 className=" text-dark font-weight-500 ">
                                  {vendor?.kyc?.shop_contact_number}
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
                      <Card.Title>Bussiness Details</Card.Title>
                      {vendor?.kyc ? (
                        <div
                          className="d-flex align-items-center"
                          style={{ gap: 10 }}
                        >
                          {vendor?.kyc?.kycStatus === "pending" && (
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
                          + Add Bussiness Details
                        </Button>
                      )}
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col>
                          <div>
                            <h6>Shop Name</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {vendor?.kyc?.shop_name || "-"}
                            </h5>
                          </div>
                          <div>
                            <h6>Bussiness Type</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {vendor?.kyc?.business_type || "-"}
                            </h5>
                          </div>
                          <div>
                            <h6>Shop Contact Number</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {vendor?.kyc?.shop_contact_number || "-"}
                            </h5>
                          </div>
                          <div>
                            <h6>Trade License Number</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {vendor?.kyc?.tradeLicenseNumber || "-"}
                            </h5>
                          </div>
                          {vendor?.kyc && (
                            <div className="mt-3">
                              <Button
                                variant="dark"
                                onClick={() =>
                                  showFile(vendor?.kyc?.documents?.tradeLicense)
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
                              {vendor?.kyc?.shop_address || "-"}
                            </h5>
                          </div>
                          <div>
                            <h6>Shop Location</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {vendor?.kyc?.shop_location || "-"}
                            </h5>
                          </div>
                          <div>
                            <h6>City</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {vendor?.kyc?.city || "-"}
                            </h5>
                          </div>
                          <div>
                            <h6>Post</h6>
                            <h5 className=" text-dark font-weight-500 ">
                              {vendor?.kyc?.post || "-"}
                            </h5>
                          </div>
                          {vendor?.kyc && (
                            <div className="mt-3">
                              <Button
                                variant="dark"
                                onClick={() =>
                                  showFile(vendor?.kyc?.shop_photo_logo)
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
                            <h6>Bussiness Hours</h6>
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
            <Tab eventKey="products" title="Products">
              <VendorStocksList
                vendorId={vendor && vendor?._id ? vendor?._id : ""}
              />
            </Tab>
          </Tabs>
        </div>
      </div>
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
