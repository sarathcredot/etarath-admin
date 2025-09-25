import React, { useMemo, useState } from "react";
import { Col, Row, Tabs, Tab, Card } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "src/components/common/breadcrumb";
import PtSwitch from "src/components/features/elements/switch";
import { toast } from "react-toastify";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";

import EditVendor from "./forms/EditVendor";
import { useGetVendorById } from "src/services/vendor.service";
import { User } from "src/types/user.types";
import { generateFilePath } from "src/services/url.service";

const VendorsDetailPage = () => {
  //IMPORTS
  const [searchParams] = useSearchParams();
  const vendorID = searchParams.get("_id");

  //STATE
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
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

  //MUTATION
  // const { mutateAsync: updateOrganiser } = useUpdateOrganiser();

  //HANDLERS
  const handleChangeStatus = async (isActive: boolean) => {
    try {
      if (typeof isActive !== "boolean")
        throw new Error("Unexpected Active status!");

      // const resp = await updateOrganiser({
      //   id: vendorID,
      //   isActive: !isActive,
      // });
      // toast(resp?.data?.message, {
      //   containerId: "default",
      //   className: "no-icon notification-success",
      // });
      setStatusOpen(false);
    } catch (error) {
      toast("Can't update Organiser right now, please try later!", {
        containerId: "default",
        className: "no-icon notification-success",
      });
      setStatusOpen(false);
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
          <Col lg={6}>
            <Card className="card-modern" style={{ height: "500px" }}>
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
                          alt=""
                        />
                      </div>
                    </div>
                    <div>
                      <h6>Full Name</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {vendor?.userName}
                      </h5>
                    </div>
                    <div>
                      <h6>Email</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {vendor?.email}
                      </h5>
                    </div>
                    <div>
                      <h6>Phone Number</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {vendor?.phoneNumber}
                      </h5>
                    </div>
                  </Col>
                  <Col>
                    <div>
                      <h6>Verification Status</h6>
                      <span
                        className={`ecommerce-status ${
                          true ? "completed" : "pending"
                        } text-dark font-weight-500`}
                      >
                        {true ? "Completed" : "Pending"}
                      </span>
                      {/* <span className={`ecommerce-status ${item?.isVerified ? "completed" : "on-hold"}`}>
                              {item?.isVerified ? "Completed" : "Pending"}
                            </span> */}
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
                          on={true}
                          size="sm"
                          variant="success"
                        />
                        <h5 className=" text-dark font-weight-500 ">
                          {true ? "Active" : "Blocked"}
                        </h5>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* <div
              className="tabs"
              style={{ borderRadius: "5px", overflow: "hidden" }}
            >
              <Tabs className="nav-justified">
                <Tab
                  eventKey="about"
                  title="About"
                >
                  <p>About</p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitat.
                  </p>
                </Tab>
                <Tab
                  eventKey="tournaments"
                  title="Tournaments"
                >
                  <div className="mt-2">
                    <TournamentsList />
                  </div>
                </Tab>
              </Tabs>
            </div> */}
          </Col>
          <Col
            lg={6}
            // className="mt-5"
          >
            <Card className="card-modern" style={{ height: "500px" }}>
              <Card.Header className="d-flex align-items-center justify-content-between">
                <Card.Title>Bussiness Details</Card.Title>
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
                      <h6>Shop Name</h6>
                      <h5 className=" text-dark font-weight-500 ">Shop Name</h5>
                    </div>
                    <div>
                      <h6>Bussiness Type</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        Bussiness Type
                      </h5>
                    </div>
                    <div>
                      <h6>Shop Location</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        Shop Location
                      </h5>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={12} className="mt-4">
            <Card className="card-modern">
              <Card.Body>
                {/* <TournamentsList
                  header={true}
                  tournamentsData={tournamentsData}
                  isLoading={isTournamentsLoading}
                  setPage={setPage}
                  setLimit={setLimit}
                  setSearch={setSearch}
                  page={page}
                  limit={limit}
                  search={search}
                /> */}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <ConfirmationPopup
        submit={() => handleChangeStatus(true)}
        isOpen={isStatusOpen}
        toggle={() => setStatusOpen(!isStatusOpen)}
        text={"Are you sure that you want to change the status of this vendor?"}
      />
      <EditVendor
        vendorId={vendorID ? vendorID : ""}
        isOpen={isEditOpen}
        toggle={() => setEditOpen(!isEditOpen)}
      />
    </>
  );
};

export default VendorsDetailPage;
