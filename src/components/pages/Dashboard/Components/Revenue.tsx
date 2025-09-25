import Chart from "react-apexcharts";
import React, { useState } from "react";
import { ApexOptions } from "apexcharts";
import { Card, Col, Form, Row } from "react-bootstrap";

const Revenue = () => {
  const [TAB, setTAB] = useState(2);
  const total = 119876.02;
  const year = 12723.02;
    const month = 1986.02;
    const last_month = 2186.02;
    const week = 916.02;
    const today = 396.02;

  //   const getDonutData = () => {
  //     switch (TAB) {
  //       case 1:
  //         return [119876.02]; // Total
  //       case 2:
  //         return [3000, 4000, 2500, 1223.02]; // Q1–Q4 (example)
  //       case 3:
  //         return [200, 300, 250, 236.02]; // Weeks in month
  //       case 4:
  //         return [20, 18, 15, 12, 10, 8, 13]; // Daily revenue for the week
  //       default:
  //         return [];
  //     }
  //   };
  const getDonutData = () => {
    // const total = 119876.02;
    

    switch (TAB) {
      case 1:
        return [total];
      case 2:
        return [total, year];
      case 3:
        return [total, month];
      case 4:
        return [total, week];
      case 5:
        return [total, today];
      default:
        return [];
    }
  };

  //   const getDonutLabels = () => {
  //     switch (TAB) {
  //       case 1:
  //         return ["Total Revenue"];
  //       case 2:
  //         return ["Q1", "Q2", "Q3", "Q4"]; // Yearly breakdown (customize as needed)
  //       case 3:
  //         return ["Week 1", "Week 2", "Week 3", "Week 4"]; // Monthly breakdown
  //       case 4:
  //         return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // Weekly breakdown
  //       default:
  //         return [];
  //     }
  //   };
  const getDonutLabels = () => {
    switch (TAB) {
      case 1:
        return ["Total Revenue"];
      case 2:
        return ["Total Revenue", "This Year"];
      case 3:
        return ["Total Revenue", "This Month"];
      case 4:
        return ["Total Revenue", "This Week"];
      case 5:
        return ["Total Revenue", "Today"];
      default:
        return [];
    }
  };

  const getRevenueStats = () => {
    switch (TAB) {
      case 1:
        return {
          current: `$${month}`,
          last: `$${last_month}`,

          label: "Month",
        };
      case 2:
        return {
          current: `$${year}`,
          last: "$10,500.00",

          label: "Year",
        };
      case 3:
        return {
          current: `$${month}`,
          last: `$${last_month}`,

          label: "Month",
        };
      case 4:
        return {
          current: `$${week}`,
          last: "$86.02",
          label: "Week",
        };
      case 4:
        return {
          current: `$${today}`,
          last: "$86.02",
          label: "Today",
        };
      default:
        return {
          current: "$0.00",
          last: "$0.00",
          label: "-",
        };
    }
  };
  const { current, last, label } = getRevenueStats();

  const donutOptions = {
    legend: {
      show: false,
    },
    labels: getDonutLabels(),
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontWeight: 700,
            },
            value: {
              fontWeight: 700,
            },
            total: {
              show: true,
              label: "Total Revenue",
              formatter: () => total.toString(),
              fontWeight: 700,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 1400,
        options: {
          chart: {
            height: 300,
          },
        },
      },
    ],
  };

  const options = {
    chart: {
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    dataLabels: {
      enabled: false,
    },
  };

  const data = [
    {
      name: "revenue",
      data: [
        6518372, 9618372, 7518372, 9018372, 5518372, 7518372, 8518372, 9818372,
        4618372, 4218372, 8118372, 3412211,
      ],
    },
  ];
  return (
    <>
      <Row className="">
        <Col lg={4}>
          <Row>
            {/* <Col
              sm={12}
              className="py-3"
            >
              <Card
                className={`card-modern dashboard_card  ${TAB === 1 && "active_tab"}`}
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
                        Total Revenue
                      </h3>
                      <strong className="text-6 ">$119,876.02</strong>
                    </Col>
                    <Col className="  mt-auto">
                      <div className="d-flex align-items-end ">
                        <span className="text-color-success mr-1">${total}</span>

                        <span>Total Revenue</span>
                      </div>
                    </Col>
                    <Col
                      sm={4}
                      className="text-center text-sm-right  mt-4 mt-sm-0 d-flex justify-content-end"
                    >
                      <i className="bx bx-dollar icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col> */}
            <Col sm={12} className="py-3">
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
                        This Year
                      </h3>
                      <strong className="text-6 ">${year}</strong>
                    </Col>
                    <Col className="  mt-auto">
                      <div className="d-flex align-items-end ">
                        <span className="text-color-success mr-1">
                          ${total}
                        </span>

                        <span>Total Revenue</span>
                      </div>
                    </Col>
                    <Col
                      sm={4}
                      className="text-center text-sm-right  mt-4 mt-sm-0 d-flex justify-content-end"
                    >
                      <i className="bx bx-dollar icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} className="py-3">
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
                        This Month
                      </h3>
                      <strong className="text-6 ">${month}</strong>
                    </Col>
                    <Col className="  mt-auto">
                      <div className="d-flex align-items-end ">
                        <span className="text-color-success mr-1">
                          ${total}
                        </span>

                        <span>Total Revenue</span>
                      </div>
                    </Col>
                    <Col
                      sm={4}
                      className="text-center text-sm-right  mt-4 mt-sm-0 d-flex justify-content-end"
                    >
                      <i className="bx bx-dollar icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} className="py-3">
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
                        className="text-4-1 my-0 "
                        style={{ whiteSpace: "nowrap" }}
                      >
                        This Week
                      </h3>
                      <strong className="text-6 ">${week}</strong>
                    </Col>
                    <Col className="  mt-auto">
                      <div className="d-flex align-items-end ">
                        <span className="text-color-success mr-1">
                          ${total}
                        </span>

                        <span>Total Revenue</span>
                      </div>
                    </Col>
                    <Col
                      sm={4}
                      className="text-center text-sm-right  mt-4 mt-sm-0 d-flex justify-content-end"
                    >
                      <i className="bx bx-dollar icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} className="py-3">
              <Card
                className={`card-modern dashboard_card  ${
                  TAB === 5 && "active_tab"
                }`}
                onClick={() => setTAB(5)}
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
                        Today
                      </h3>
                      <strong className="text-6 ">${today}</strong>
                    </Col>
                    <Col className="  mt-auto">
                      <div className="d-flex align-items-end ">
                        <span className="text-color-success mr-1">
                          ${total}
                        </span>

                        <span>Total Revenue</span>
                      </div>
                    </Col>
                    <Col
                      sm={4}
                      className="text-center text-sm-right  mt-4 mt-sm-0 d-flex justify-content-end"
                    >
                      <i className="bx bx-dollar icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col lg={8} className="py-3">
          <Card className="card-modern h-100">
            <Card.Header>
              <Row>
                <Col>
                  <Card.Title>Revenue</Card.Title>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="h-100 pt-2">
              <Row>
                <Col className="col-auto">
                  <strong className="text-color-dark text-6">{current}</strong>
                  <h3 className="text-4 mt-0 mb-2">This {label}</h3>
                </Col>
                <Col className="col-auto">
                  <strong className="text-color-dark text-6">{last}</strong>
                  <h3 className="text-4 mt-0 mb-2">Last {label}</h3>
                </Col>
                <Col className="col-auto">
                  <strong className="text-color-dark text-6">${total}</strong>
                  <h3 className="text-4 mt-0 mb-2">Total Profit</h3>
                </Col>
              </Row>
              <Row className=" h-100">
                <Col
                  lg={12}
                  className="px-0 h-100 d-flex align-items-md-center justify-content-center"
                >
                  <div className="" style={{height:"80%",width:"100%"}}>
                    <Chart
                      type="donut"
                      options={donutOptions}
                      series={getDonutData()}
                      width="100%"
                      height="100%"
                    />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={12} className="py-3">
          <Card className="card-modern h-100">
            <Card.Header>
              <Card.Title>Revenue</Card.Title>
            </Card.Header>
            <Card.Body className="h-100 pt-2">
              <Row>
                <Col className="col-auto">
                  <strong className="text-color-dark text-6">${month}</strong>
                  <h3 className="text-4 mt-0 mb-2">This Month</h3>
                </Col>
                <Col className="col-auto">
                  <strong className="text-color-dark text-6">$14,345.26</strong>
                  <h3 className="text-4 mt-0 mb-2">Last Month</h3>
                </Col>
                <Col className="col-auto">
                  <strong className="text-color-dark text-6">
                    ${total}
                  </strong>
                  <h3 className="text-4 mt-0 mb-2">Total Profit</h3>
                </Col>
              </Row>

              <Row>
                <Col className="px-0" style={{height:"400px"}}>
                  <Chart
                    options={options}
                    series={data}
                    type="bar"
                    height={"100%"}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Revenue;
