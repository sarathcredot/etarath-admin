import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import Chart from "react-apexcharts";
import { Reveal } from "react-awesome-reveal";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { User } from "src/types/user.types";
import { fadeIn } from "src/utils/data/keyframes";
const retailers: any[] = [
  {
    _id: "65fbdc0c8a3f1e1234567894",
    fullName: "Rashid Khan",
    phoneNumber: "97455677889",
    countryCode: "+974",
    isVerified: true,
    role: "organiser",
    createdAt: "2025-03-20T08:20:00Z",
    updatedAt: "2025-03-20T08:20:00Z",
  },
  {
    _id: "65fbdc0c8a3f1e1234567895",
    fullName: "Fatima Noor",
    phoneNumber: "97455699887",
    countryCode: "+974",
    isVerified: true,
    role: "organiser",
    createdAt: "2025-03-20T08:25:00Z",
    updatedAt: "2025-03-20T08:25:00Z",
  },
  {
    _id: "65fbdc0c8a3f1e1234567896",
    fullName: "Khalid Abdul",
    phoneNumber: "97455661234",
    countryCode: "+974",
    isVerified: false,
    role: "organiser",
    createdAt: "2025-03-20T08:30:00Z",
    updatedAt: "2025-03-20T08:30:00Z",
  },
  {
    _id: "65fbdc0c8a3f1e1234567897",
    fullName: "Mariam Saeed",
    phoneNumber: "97455443322",
    countryCode: "+974",
    isVerified: true,
    role: "organiser",
    createdAt: "2025-03-20T08:35:00Z",
    updatedAt: "2025-03-20T08:35:00Z",
  },
  {
    _id: "65fbdc0c8a3f1e1234567896",
    fullName: "Khalid Abdul",
    phoneNumber: "97455661234",
    countryCode: "+974",
    isVerified: false,
    role: "organiser",
    createdAt: "2025-03-20T08:30:00Z",
    updatedAt: "2025-03-20T08:30:00Z",
  },
  {
    _id: "65fbdc0c8a3f1e1234567897",
    fullName: "Mariam Saeed",
    phoneNumber: "97455443322",
    countryCode: "+974",
    isVerified: true,
    role: "organiser",
    createdAt: "2025-03-20T08:35:00Z",
    updatedAt: "2025-03-20T08:35:00Z",
  },
  {
    _id: "65fbdc0c8a3f1e1234567898",
    fullName: "Adil Rehman",
    phoneNumber: "97455887766",
    countryCode: "+974",
    isVerified: false,
    role: "organiser",
    createdAt: "2025-03-20T08:40:00Z",
    updatedAt: "2025-03-20T08:40:00Z",
  },
];
const Retailers = () => {
  const [filter, setFilter] = useState<string>("MONTH");

  const getCategories = (filterType: string) => {
    const currentYear = new Date().getFullYear();

    switch (filterType) {
      case "YEAR":
        const startYear = 2018;
        return Array.from({ length: currentYear - startYear + 1 }, (_, i) =>
          (startYear + i).toString()
        );

      case "MONTH":
        return [
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
        ];

      case "WEEK":
        return ["Week 1", "Week 2", "Week 3", "Week 4"];

      case "DAY":
        return Array.from({ length: 31 }, (_, i) => i + 1);

      default:
        return [];
    }
  };
  const getData = (filterType: string) => {
    switch (filterType) {
      case "YEAR":
        return [
          {
            name: "Verified Retailers",
            data: [0, 0, 0, 0, 0, 0, 120, 180], // Example: 2 years
          },
          {
            name: "Rejected Retailers",
            data: [0, 0, 0, 0, 0, 0, 30, 50],
          },
          {
            name: "Verification Pending Retailers",
            data: [0, 0, 0, 0, 0, 0, 30, 50],
          },
        ];
      case "MONTH":
        return [
          {
            name: "Verified Retailers",
            data: [65, 96, 75, 90, 55, 75, 85, 98, 46, 42, 81, 34],
          },
          {
            name: "Rejected Retailers",
            data: [56, 76, 65, 80, 55, 15, 79, 78, 35, 35, 72, 22],
          },
          {
            name: "Verification Pending Retailers",
            data: [26, 16, 5, 20, 15, 15, 19, 18, 15, 15, 12, 12],
          },
        ];
      case "WEEK":
        return [
          {
            name: "Verified Retailers",
            data: [25, 32, 30, 28],
          },
          {
            name: "Rejected Retailers",
            data: [10, 5, 8, 3],
          },
          {
            name: "Verification Pending Retailers",
            data: [0, 0, 0, 0, 0, 0, 30, 50],
          },
        ];
      case "DAY":
        return [
          {
            name: "Verified Retailers",
            data: Array.from({ length: 31 }, () =>
              Math.floor(Math.random() * 10)
            ),
          },
          {
            name: "Rejected Retailers",
            data: Array.from({ length: 31 }, () =>
              Math.floor(Math.random() * 5)
            ),
          },
          {
            name: "Verification Pending Retailers",
            data: Array.from({ length: 31 }, () =>
              Math.floor(Math.random() * 5)
            ),
          },
        ];
      default:
        return [];
    }
  };
  const [options, setOptions] = useState<ApexOptions>({
    chart: { stacked: true, toolbar: { show: false } },
    legend: { show: false },
    xaxis: { categories: getCategories(filter) },
    plotOptions: {
      bar: {
        dataLabels: {
          total: {
            enabled: true,
            offsetY: -10,
            style: { fontSize: "14px", fontWeight: 600, color: "#000" },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    colors: ["#0BBE05", "#FF0F0F", "#FF600F"],
  });

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    const newCategories = getCategories(newFilter);

    setOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: newCategories,
      },
    }));
  };
  return (
    <>
      <Reveal keyframes={fadeIn} duration={600} triggerOnce>
        <Row className="py-3">
          <Col lg={5} className=" pt-3 ">
            <Card className="card-modern h-100">
              <Card.Header>
                <Card.Title>Top Retailers</Card.Title>
              </Card.Header>
              <Card.Body className="h-100 pt-2">
                <Table
                  responsive
                  className="table-ecommerce-simple table-no-collapse mb-1"
                  style={{ minWidth: "300px" }}
                >
                  <thead>
                    <tr>
                      <th>Retailer</th>
                      {/* <th> Phone Number</th> */}
                      <th className="text-lg-right">Total Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {retailers &&
                      retailers?.length &&
                      retailers?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <Link to={`/retailers/detail?_id=${item?._id}`}>
                              {item?.fullName}
                            </Link>
                          </td>
                          {/* <td>{item?.phoneNumber}</td> */}
                          <td className="text-lg-right">{38}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={7} className="pt-3">
            <Card className="card-modern h-100">
              <Card.Header>
                <Row>
                  <Col>
                    <Card.Title>Retailers</Card.Title>
                  </Col>
                  <Col lg="auto" className="mb-2 mb-lg-0 ml-xl-auto pl-xl-1">
                    <div className="d-flex align-items-lg-center flex-wrap">
                      <Form.Label className="d-none d-xl-block ws-nowrap mr-3 mb-0">
                        Filter By:
                      </Form.Label>
                      <Form.Control
                        as="select"
                        className="select-style-1 filter-by w-auto my-1 mr-2"
                        value={filter}
                        onChange={(e) => handleFilterChange(e.target.value)}
                      >
                        <option value="YEAR">Year</option>
                        <option value="MONTH">Month</option>
                        <option value="WEEK">Week</option>
                        <option value="DAY">Day</option>
                      </Form.Control>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="h-100 pt-2">
                <Row>
                  <Col className="col-auto">
                    <strong className="text-color-dark text-6">20</strong>
                    <h3 className="text-4 mt-0 mb-2">This Month</h3>
                  </Col>
                  <Col className="col-auto">
                    <strong className="text-color-dark text-6">30</strong>
                    <h3 className="text-4 mt-0 mb-2">Last Month</h3>
                  </Col>
                  <Col className="col-auto">
                    <strong className="text-color-dark text-6">225</strong>
                    <h3 className="text-4 mt-0 mb-2">Total Retailers</h3>
                  </Col>
                </Row>

                <Row>
                  <Col className="px-0">
                    <Chart
                      options={options}
                      series={getData(filter)}
                      type="bar"
                      height={273}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Reveal>
    </>
  );
};

export default Retailers;
