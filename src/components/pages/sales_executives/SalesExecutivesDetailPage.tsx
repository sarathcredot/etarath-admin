import React, { useMemo, useState } from "react";
import { Col, Row, Tabs, Tab, Card } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "src/components/common/breadcrumb";
import PtSwitch from "src/components/features/elements/switch";
import { toast } from "react-toastify";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";
import { useGetSalesAgentById, useGetSalesAgentallOrdersById, useGetSalesAgentallClaimsById, useUpdateagentStatus, useGetSalesAgentallTargetById } from "src/services/salesAgent.service";
import EditVendor from "./Popups/EditSalesExecutive";
import { generateFilePath } from "src/services/url.service";
import VendorOrdersList from "../vendors/VendorOrdersList";
import VendorClaimsList from "../vendors/VendorClaimList";
import TargetList from "./TargetList";


const SalesExecutivesDetailPage = () => {
  //IMPORTS
  const [searchParams] = useSearchParams();
  const agentId = searchParams.get("_id");
  const vendorId = searchParams.get("vendor");

  //STATE
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [isStatusOpen, setStatusOpen] = useState<boolean>(false);
  //pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");


  const [orderPage, setOrderPage] = useState<number>(1);
  const [orderLimit, setOrderLimit] = useState<number>(10);
  const [orderSearch, setOrderSearch] = useState<string>("");

  const [claimPage, setClaimPage] = useState<number>(1);
  const [claimLimit, setClaimLimit] = useState<number>(10);
  const [claimSearch, setClaimSearch] = useState<string>("");

  const [targetPage, settargetPage] = useState<number>(1);
  const [targetLimit, settargetLimit] = useState<number>(10);
  const [targetSearch, settargetSearch] = useState<string>("");


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

    if (agentId) {
      obj.organiserId = agentId;
    }

    return obj;
  }, [page, limit, search]);


  //order USE MEMO
  const orderQueryObj = useMemo(() => {
    const obj: any = {};

    if (orderPage) {
      obj.page = orderPage;
    }

    if (orderLimit) {
      obj.limit = orderLimit;
    }

    if (orderSearch) {
      obj.search = orderSearch;
    }

    if (agentId) {
      obj.agentId = agentId;
    }

    return obj;
  }, [orderPage, orderLimit, orderSearch, agentId]);


  // claim use memo

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

    if (agentId) {
      obj.agentId = agentId;
    }

    return obj;
  }, [claimPage, claimLimit, claimSearch, agentId]);


  const targetQueryObj = useMemo(() => {
    const obj: any = {};

    if (targetPage) {
      obj.page = targetPage;
    }

    if (targetLimit) {
      obj.limit = targetLimit;
    }

    if (targetSearch) {
      obj.search = targetSearch;
    }

    if (agentId) {
      obj.agentId = agentId;
    }

    return obj;
  }, [claimPage, claimLimit, claimSearch, agentId]);


  //HANDLERS
  const handleChangeStatus = async (isActive: boolean) => {
    try {
      if (typeof isActive !== "boolean")
        throw new Error("Unexpected Active status!");
      const resp = await updateAgentStatus({
        id: agentId,
        isActive: !isActive,
      });

      setStatusOpen(false);
      toast(resp?.data?.message, {
        containerId: "default",
        className: !isActive
          ? "no-icon notification-warning" // when activated
          : "no-icon notification-success", // when deactivated
      });

    } catch (error) {
      toast("Can't update Organiser right now, please try later!", {
        containerId: "default",
        className: "no-icon notification-success",
      });
      setStatusOpen(false);
    }
  };



  const { data: agent, isLoading: agentsLoading } = useGetSalesAgentById(agentId, !!agentId)
  const { data: orders, isLoading: ordersLoading } = useGetSalesAgentallOrdersById(agentId, !!agentId, orderQueryObj)
  const { data: claims, isLoading: claimsLoading } = useGetSalesAgentallClaimsById(agentId, !!agentId, claimQueryObj)
  const { data: target, isLoading: targetLoading } = useGetSalesAgentallTargetById(agentId, !!agentId, targetQueryObj)


  const { mutateAsync: updateAgentStatus } = useUpdateagentStatus();


  console.log("agent", agent)

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
            name: "Vendor",
            url: `/vendors/detail?_id=${vendorId}`,
          },
          {
            name: "sales-executive",
            url: `/sales-executives/detail?_id=${agentId}`,
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

                  <Col className="text-center">
                    <div>
                      <div>
                        <img
                          src={generateFilePath(
                            agent?.imgUrl
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

                  </Col>
                  <Col>
                    <div>
                      <h6>Full Name</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {agent?.userName}
                      </h5>
                    </div>
                    <div>
                      <h6>Phone Number</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {agent?.phoneNumber}
                      </h5>
                    </div>
                  </Col>

                  <Col>
                    <div>
                      <h6>Email</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {agent?.email}
                      </h5>
                    </div>
                    <div>
                      <h6>Location</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {agent?.location}
                      </h5>
                    </div>
                  </Col>




                  <Col>
                    <div>
                      <h6>Current Month Target</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {agent?.salesAgentTarget}
                      </h5>

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
                          on={!agent?.isSuspend}
                          size="sm"
                          variant="success"
                        />
                        <h5 className=" text-dark font-weight-500 ">
                          {agent?.isSuspend ? "Blocked" : "Active"}
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
        <div
          className="tabs"
          style={{ borderRadius: "5px", marginTop: "20px", overflow: "hidden" }}
        >
          <Tabs className="nav-justified">
            <Tab eventKey="orders" title="Orders">
              <VendorOrdersList
                vendorId={agentId ? agentId : ""}
                orders={orders}
                ordersLoading={ordersLoading}
                setPage={setOrderPage}
                setLimit={setOrderLimit}
                setSearch={setOrderSearch}
                page={orderPage}
                limit={orderLimit}
                search={orderSearch}
              />
            </Tab>
            <Tab eventKey="claims" title="Claims">
              <VendorClaimsList
                vendorId={agentId ? agentId : ""}
                claims={claims}
                claimsLoading={claimsLoading}
                setPage={setClaimPage}
                setLimit={setClaimLimit}
                setSearch={setClaimSearch}
                page={claimPage}
                limit={claimLimit}
                search={claimSearch}
              />
            </Tab>

            <Tab eventKey="target" title="Targets">
              <TargetList
                vendorId={agentId ? agentId : ""}
                target={target}
                targetLoading={targetLoading}
                setPage={settargetPage}
                setLimit={settargetLimit}
                setSearch={settargetSearch}
                page={targetPage}
                limit={targetLimit}
                search={targetSearch}
              />
            </Tab>


          </Tabs>
        </div>
      </div>
      <ConfirmationPopup
        submit={() => handleChangeStatus(agent?.isSuspend)}
        isOpen={isStatusOpen}
        toggle={() => setStatusOpen(!isStatusOpen)}
        text={
          "Are you sure that you want to change the status of this sales executive?"
        }
      />
      <EditVendor
        isOpen={isEditOpen}
        toggle={() => setEditOpen(!isEditOpen)}
        agentId={agentId}
        data={agent}
      />
    </>
  );
};

export default SalesExecutivesDetailPage;
