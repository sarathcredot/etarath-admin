import AuctionSubscriptions from "./Components/RetailerSubscriptions";
import Orders from "./Components/Orders";
import Vendors from "./Components/Vendors";
import React, { useState } from "react";
import Revenue from "./Components/Revenue";
import Subscriptions from "./Components/VendorSubscriptions";
import Retailers from "./Components/Retailers";
import SalesExecutives from "./Components/SalesExecutives";
import {
  Card,
  Col,
  Row,
} from "react-bootstrap";

export default function Dashboard() {
  const [TAB, setTAB] = useState(1);

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
                  <strong className="text-6 ">148</strong>
                </Col>
                <Col className=" mt-auto">
                  <div className="d-flex align-items-end ">
                    <span className="text-color-success mr-1">+121</span>

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
                  <strong className="text-6 ">148</strong>
                </Col>
                <Col className="  mt-auto">
                  <div className="d-flex align-items-end ">
                    <span className="text-color-success mr-1">+34</span>

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
                  <strong className="text-6 ">148</strong>
                </Col>
                <Col className="  mt-auto">
                  <div className="d-flex align-items-end ">
                    <span className="text-color-success mr-1">+34</span>

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
                  <strong className="text-6 ">148</strong>
                </Col>
                <Col className="  mt-auto">
                  <div className="d-flex align-items-end ">
                    <span className="text-color-success mr-1">+34</span>

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
      {/* </Row> */}
      {/* <Row>
        <Col lg={4}>
          <Card
            className={`card-modern  ${TAB === 4 && "active_tab"}`}
            onClick={() => setTAB(4)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body className="py-4 bg-primary">
              <Row className="align-items-center justify-content-between">
                <Col
                // sm={4}
                // className="col-6"
                >
                  <h3 className="text-4-1 my-0">Total Organizers</h3>
                  <strong className="text-6 ">148</strong>
                </Col>
                <Col
                  // sm={8}
                  className="text-center text-sm-right  mt-4 mt-sm-0 d-flex justify-content-end"
                >
                  <i className="bx bx-user icon icon-inline icon-xl bg-white rounded-circle text-color-primary p-0"></i>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card
            className={`card-modern  ${TAB === 2 && "active_tab"}`}
            onClick={() => setTAB(2)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body className="py-4">
              <Row className="align-items-center justify-content-between">
                <Col
                // sm={4}
                // className="col-6"
                >
                  <h3 className="text-4-1 my-0">Total Team Managers</h3>
                  <strong className="text-6 text-color-dark">148</strong>
                </Col>
                <Col
                  // sm={8}
                  className="text-center text-sm-right  mt-4 mt-sm-0 d-flex justify-content-end"
                >
                  <i className="bx bx-group icon icon-inline icon-xl bg-primary rounded-circle text-color-light p-0"></i>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card
            className={`card-modern  ${TAB === 3 && "active_tab"}`}
            onClick={() => setTAB(3)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body className="py-4">
              <Row className="align-items-center justify-content-between">
                <Col
                // sm={4}
                // className="col-6"
                >
                  <h3 className="text-4-1 my-0">Total Tournaments</h3>
                  <strong className="text-6 text-color-dark">148</strong>
                </Col>
                <Col
                  // sm={8}
                  className="text-center text-sm-right  mt-4 mt-sm-0 d-flex justify-content-end"
                >
                  <i className="bx bx-trophy icon icon-inline icon-xl bg-primary rounded-circle text-color-light p-0"></i>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card
            className={`card-modern  ${TAB === 4 && "active_tab"}`}
            onClick={() => setTAB(4)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body className="py-4">
              <Row className="align-items-center justify-content-between">
                <Col
                // sm={4}
                // className="col-6"
                >
                  <h3 className="text-4-1 my-0">Total Auctions</h3>
                  <strong className="text-6 text-color-dark">148</strong>
                </Col>
                <Col
                  // sm={8}
                  className="text-center text-sm-right  mt-4 mt-sm-0 d-flex justify-content-end"
                >
                  <i className="bx bx-wallet icon icon-inline icon-xl bg-primary rounded-circle text-color-light p-0"></i>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col
          lg={8}
          className="h-100 w-100"
        >
          <Row className="m-0">{sections?.find((item) => item?.tab === TAB)?.component}</Row>
        </Col>
      </Row> */}

      {/* <Row> */}

      {/* <Col
          xl={7}
          xxl={8}
          className="pt-2 pt-xl-0 mt-4 mt-xl-0"
        >
          <Row className="h-100">
            <Col>
              <Card className="card-modern h-100">
                <Card.Header>
                  <Card.Title>Revenue</Card.Title>
                </Card.Header>
                <Card.Body className="h-100 pt-2">
                  <Row>
                    <Col className="col-auto">
                      <strong className="text-color-dark text-6">$19,986.02</strong>
                      <h3 className="text-4 mt-0 mb-2">This Month</h3>
                    </Col>
                    <Col className="col-auto">
                      <strong className="text-color-dark text-6">$14,345.26</strong>
                      <h3 className="text-4 mt-0 mb-2">Last Month</h3>
                    </Col>
                    <Col className="col-auto">
                      <strong className="text-color-dark text-6">$119,876.02</strong>
                      <h3 className="text-4 mt-0 mb-2">Total Profit</h3>
                    </Col>
                  </Row>

                  <Row>
                    <Col className="px-0">
                      <Chart
                        options={options}
                        series={data}
                        type="bar"
                        height={340}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col> */}
      {/* </Row> */}
      {/* <Row>
        <Col lg={6}>
          <RecentTournaments />
        </Col>
        <Col lg={6}>
          <RecentBids />
        </Col>
      </Row> */}
    </>
  );
}
