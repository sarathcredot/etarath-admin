import Chart from "react-apexcharts";
import React from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const VendorSubscriptions = () => {
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
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    },
    dataLabels: {
      enabled: false,
    },
  };

  const data = [
    {
      name: "Executive",
      data: [65, 96, 75, 90, 55, 75, 85, 98, 46, 42, 81, 34],
    },
    {
      name: "Corporate",
      data: [56, 76, 65, 80, 55, 35, 79, 78, 35, 35, 72, 22],
    },
    
  ];

  return (
    <>
      <Row className="py-0">
        <Col
          sm={12}
          className="py-3"
        >
          <Card className="card-modern h-100">
            <Card.Header>
              <Card.Title>Vendor Subscriptions</Card.Title>
            </Card.Header>
            <Card.Body className="h-100 pt-2">
              <Table
                responsive
                className="table-ecommerce-simple table-no-collapse mb-1"
                style={{ minWidth: "454px" }}
              >
                <thead>
                  <tr>
                    <th>Package</th>
                    <th> Total Subscriptions</th>
                    <th className="text-lg-right">Avg / Month</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Link to={`/subscriptions/vendor-plans/detail?_id=1`}>
                        <i className="bx bx-package mr-2"></i>
                        Executive
                      </Link>
                    </td>
                    <td>780</td>
                    <td className="text-lg-right">70</td>
                  </tr>
                  
                  <tr>
                    <td>
                      <Link to={`/subscriptions/vendor-plans/detail?_id=1`}>
                        <i className="bx bx-package mr-2"></i>
                        Corporate
                      </Link>
                    </td>
                    <td>890</td>
                    <td className="text-lg-right">75</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col
          sm={12}
          className="py-3"
        >
          <Card className="card-modern h-100">
            <Card.Header>
              <Card.Title>Vendor Subscriptions</Card.Title>
            </Card.Header>
            <Card.Body className="h-100 pt-2">
              <Row>
                <Col className="col-auto">
                  <strong className="text-color-dark text-6">90</strong>
                  <h3 className="text-4 mt-0 mb-2">This Month</h3>
                </Col>
                <Col className="col-auto">
                  <strong className="text-color-dark text-6">75</strong>
                  <h3 className="text-4 mt-0 mb-2">Last Month</h3>
                </Col>
                <Col className="col-auto">
                  <strong className="text-color-dark text-6">12000</strong>
                  <h3 className="text-4 mt-0 mb-2">Total Subscriptions</h3>
                </Col>
              </Row>

              <Row>
                <Col className="px-0">
                  <Chart
                    options={options}
                    series={data}
                    type="bar"
                    height={400}
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

export default VendorSubscriptions;
