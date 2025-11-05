import AuctionSubscriptions from "./Components/RetailerSubscriptions";
import Orders from "./Components/Orders";
import Vendors from "./Components/Vendors";
import React, { useState } from "react";
import Revenue from "./Components/Revenue";
import Subscriptions from "./Components/VendorSubscriptions";
import Retailers from "./Components/Retailers";
import SalesExecutives from "./Components/SalesExecutives";
import { Card, Col, Row } from "react-bootstrap";
import { useGetAllTotalOverview } from "src/services/dashboard.service";

export default function Dashboard() {
  const [TAB, setTAB] = useState(1);


  // QUERIES
  const { data: totalOverviewData } = useGetAllTotalOverview(true);

  const sections = [
    {
      tab: 1,
      component: <Vendors />,
    },
    {
      tab: 2,
      component: <Retailers />,
    },
    {
      tab: 3,
      component: <SalesExecutives />,
    },
    {
      tab: 4,
      component: <Orders />,
    },
  ];

  return (
    <>
      {/* <Breadcrumb current="Dashboard" /> */}
      <Row className="page-header page-header-left-inline-breadcrumb">
        <Col>
          <h2 className="font-weight-bold text-6">Dashboard</h2>
        </Col>
        {/* <Col
          lg="auto"
          className="mb-2 mb-lg-0 ml-xl-auto pl-xl-1"
        >
          <div className="d-flex align-items-lg-center flex-wrap">
            <Form.Label className="d-none d-xl-block ws-nowrap mr-3 mb-0">Filter By:</Form.Label>
            <Form.Control
              as="select"
              className="select-style-1 filter-by w-auto my-1 mr-2"
              // value={role}
              // onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Total</option>
              <option value="">This Year</option>
              <option value="">This Month</option>
              <option value="">This Week</option>
              <option value="">Today</option>
            </Form.Control>
          </div>
        </Col> */}
      </Row>
      <Row className="pt-0">
        <Col lg={3}>
          <Card
            className={`card-modern dashboard_card  ${
              TAB === 1 && "active_tab"
            }`}
            onClick={() => setTAB(1)}
            style={{ cursor: "pointer" }}
          >
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
                    Total Vendors
                  </h3>
                  <strong className="text-6 ">
                    {totalOverviewData?.vendor?.total}
                  </strong>
                </Col>
                <Col className=" mt-auto">
                  <div className="d-flex align-items-end ">
                    <span className="text-color-success mr-1">
                      +{totalOverviewData?.vendor?.thisMonth}
                    </span>

                    <span className="ws-nowrap">This month</span>
                  </div>
                </Col>
                <Col
                  sm={4}
                  className="text-center text-sm-right  mt-4 mt-sm-0 d-flex justify-content-end"
                >
                  {/* <i className="bx bx-user icon icon-inline icon-md  p-0"></i> */}
                  <i className="bx bx-user icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3}>
          <Card
            className={`card-modern dashboard_card  ${
              TAB === 2 && "active_tab"
            }`}
            onClick={() => setTAB(2)}
            style={{ cursor: "pointer" }}
          >
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
                    Total Retailers
                  </h3>
                  <strong className="text-6 ">
                    {totalOverviewData?.retailer?.total}
                  </strong>
                </Col>
                <Col className="  mt-auto">
                  <div className="d-flex align-items-end ">
                    <span className="text-color-success mr-1">
                      +{totalOverviewData?.retailer?.thisMonth}
                    </span>

                    <span>This month</span>
                  </div>
                </Col>
                <Col
                  sm={4}
                  className="text-center text-sm-right  mt-4 mt-sm-0 d-flex justify-content-end"
                >
                  {/* <i className="bx bx-user icon icon-inline icon-md  p-0"></i> */}
                  <i className="bx bx-group icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3}>
          <Card
            className={`card-modern dashboard_card  ${
              TAB === 3 && "active_tab"
            }`}
            onClick={() => setTAB(3)}
            style={{ cursor: "pointer" }}
          >
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
                    Total Sales Executives
                  </h3>
                  <strong className="text-6 ">
                    {totalOverviewData?.salesExecutives?.total}
                  </strong>
                </Col>
                <Col className="  mt-auto">
                  <div className="d-flex align-items-end ">
                    <span className="text-color-success mr-1">
                      +{totalOverviewData?.salesExecutives?.thisMonth}
                    </span>

                    <span>This month</span>
                  </div>
                </Col>
                <Col
                  sm={4}
                  className="text-center text-sm-right  mt-4 mt-sm-0 d-flex justify-content-end"
                >
                  {/* <i className="bx bx-user icon icon-inline icon-md  p-0"></i> */}
                  <i className="bx bx-group icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3}>
          <Card
            className={`card-modern dashboard_card  ${
              TAB === 4 && "active_tab"
            }`}
            onClick={() => setTAB(4)}
            style={{ cursor: "pointer" }}
          >
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
                    Total Orders
                  </h3>
                  <strong className="text-6 ">{totalOverviewData?.order?.total}</strong>
                </Col>
                <Col className="  mt-auto">
                  <div className="d-flex align-items-end ">
                    <span className="text-color-success mr-1">+{totalOverviewData?.order?.thisMonth}</span>

                    <span>This month</span>
                  </div>
                </Col>
                <Col
                  sm={4}
                  className="text-center text-sm-right  mt-4 mt-sm-0 d-flex justify-content-end"
                >
                  {/* <i className="bx bx-user icon icon-inline icon-md  p-0"></i> */}
                  <i className="bx bx-trending-up icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <Row className=""> */}
      {sections?.find((item) => item?.tab === TAB)?.component}
      <Revenue />
      <Subscriptions />
      <AuctionSubscriptions />
    </>
  );
}
