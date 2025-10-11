import React, { useMemo, useState } from "react";
import { Col, Row, Tabs, Tab, Card } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "src/components/common/breadcrumb";
import PtSwitch from "src/components/features/elements/switch";
import { toast } from "react-toastify";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";

import EditVendor from "./Popups/EditSalesExecutive";

const SalesExecutivesDetailPage = () => {
  //IMPORTS
  const [searchParams] = useSearchParams();
  const organizerID = searchParams.get("_id");

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

    if (organizerID) {
      obj.organiserId = organizerID;
    }

    return obj;
  }, [page, limit, search]);

  //HANDLERS
  const handleChangeStatus = async (isActive: boolean) => {
    try {
      if (typeof isActive !== "boolean")
        throw new Error("Unexpected Active status!");

      // const resp = await updateOrganiser({
      //   id: organizerID,
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
        current={"Sales Executive"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "sales-executives",
            url: "/sales-executives",
          },
          {
            name: "sales-executive",
            url: `/sales-executives/detail?_id=${organizerID}`,
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
                      <h6>Full Name</h6>
                      <h5 className=" text-dark font-weight-500 ">
                       Full Name
                      </h5>
                    </div>
                    <div>
                      <h6>Phone Number</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        Phone Number
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
        text={
          "Are you sure that you want to change the status of this sales executive?"
        }
      />
      <EditVendor
        isOpen={isEditOpen}
        toggle={() => setEditOpen(!isEditOpen)}
        organiserId={organizerID}
      />
    </>
  );
};

export default SalesExecutivesDetailPage;
