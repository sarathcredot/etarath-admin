import { ApexOptions } from "apexcharts";
import { capitalize } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { Reveal } from "react-awesome-reveal";
import { Card, Col, Form, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fadeIn } from "src/utils/data/keyframes";
import { convertTimelineToApexSeries, useGetAllTopUsersAndOrders, usegetchartDataOrder } from "src/services/dashboard.service";

const topTournaments: any[] = [
  {
    _id: "65fbbafda10a1c2b4e8f0001",
    logoUrl: "https://example.com/logo1.png",
    name: "Pepsi Indian Premier League",
    sportType: "Cricket",
    startDate: "2024-02-10",
    endDate: "2024-02-20",
    location: "Nehru Stadium",
    matchType: "Limited Over",
    auctionEnabled: true,
    maxTeamAllowed: 8,
    createdBy: { _id: "65fbbafda10a1c2b4e8f1011", email: "admin1@example.com" },
    createdAt: "2024-01-01T10:00:00Z",
    status: "COMPLETED",
  },
  {
    _id: "65fbbafda10a1c2b4e8f0002",
    logoUrl: "https://example.com/logo2.png",
    name: "Qatar Football Cup",
    sportType: "Football",
    startDate: "2025-03-10",
    endDate: "2025-03-25",
    location: "Aspire Zone",
    matchType: "Knockout",
    auctionEnabled: false,
    maxTeamAllowed: 16,
    createdBy: { _id: "65fbbafda10a1c2b4e8f1012", email: "admin2@example.com" },
    createdAt: "2025-01-02T11:30:00Z",
    status: "ONGOING",
  },
  {
    _id: "65fbbafda10a1c2b4e8f0001",
    logoUrl: "https://example.com/logo1.png",
    name: "Pepsi Indian Premier League",
    sportType: "Cricket",
    startDate: "2024-02-10",
    endDate: "2024-02-20",
    location: "Nehru Stadium",
    matchType: "Limited Over",
    auctionEnabled: true,
    maxTeamAllowed: 8,
    createdBy: { _id: "65fbbafda10a1c2b4e8f1011", email: "admin1@example.com" },
    createdAt: "2024-01-01T10:00:00Z",
    status: "COMPLETED",
  },
  {
    _id: "65fbbafda10a1c2b4e8f0002",
    logoUrl: "https://example.com/logo2.png",
    name: "Qatar Football Cup",
    sportType: "Football",
    startDate: "2025-03-10",
    endDate: "2025-03-25",
    location: "Aspire Zone",
    matchType: "Knockout",
    auctionEnabled: false,
    maxTeamAllowed: 16,
    createdBy: { _id: "65fbbafda10a1c2b4e8f1012", email: "admin2@example.com" },
    createdAt: "2025-01-02T11:30:00Z",
    status: "ONGOING",
  },
  {
    _id: "65fbbafda10a1c2b4e8f0001",
    logoUrl: "https://example.com/logo1.png",
    name: "Pepsi Indian Premier League",
    sportType: "Cricket",
    startDate: "2024-02-10",
    endDate: "2024-02-20",
    location: "Nehru Stadium",
    matchType: "Limited Over",
    auctionEnabled: true,
    maxTeamAllowed: 8,
    createdBy: { _id: "65fbbafda10a1c2b4e8f1011", email: "admin1@example.com" },
    createdAt: "2024-01-01T10:00:00Z",
    status: "COMPLETED",
  },
  {
    _id: "65fbbafda10a1c2b4e8f0002",
    logoUrl: "https://example.com/logo2.png",
    name: "Qatar Football Cup",
    sportType: "Football",
    startDate: "2025-03-10",
    endDate: "2025-03-25",
    location: "Aspire Zone",
    matchType: "Knockout",
    auctionEnabled: false,
    maxTeamAllowed: 16,
    createdBy: { _id: "65fbbafda10a1c2b4e8f1012", email: "admin2@example.com" },
    createdAt: "2025-01-02T11:30:00Z",
    status: "ONGOING",
  },
  {
    _id: "65fbbafda10a1c2b4e8f0001",
    logoUrl: "https://example.com/logo1.png",
    name: "Pepsi Indian Premier League",
    sportType: "Cricket",
    startDate: "2024-02-10",
    endDate: "2024-02-20",
    location: "Nehru Stadium",
    matchType: "Limited Over",
    auctionEnabled: true,
    maxTeamAllowed: 8,
    createdBy: { _id: "65fbbafda10a1c2b4e8f1011", email: "admin1@example.com" },
    createdAt: "2024-01-01T10:00:00Z",
    status: "COMPLETED",
  },
];
const Orders = () => {
  const [filter, setFilter] = useState<string>("month");
  const [chartResult, setChartResult] = useState<any[]>([]);

  // QUERIES
  const { data: topOrders } = useGetAllTopUsersAndOrders("order");


  const orderQueryObj = useMemo(() => {
    const obj: any = {};

    // obj.role = "sales_executive"
    obj.year = "2026"
    // obj.chartType="user"

    if (filter) {
      obj.filter = filter;
    }

    return obj;
  }, [filter]);

  const { data: chartData } = usegetchartDataOrder(true, orderQueryObj)


  useEffect(() => {

    if (!chartData?.timeline || !filter) return;

    const result = convertTimelineToApexSeries(
      chartData.timeline,
      filter,
      "order",
      // "retailer"
    );

    setChartResult(result);

  }, [chartData, filter]);



  const getCategories = (filterType: string) => {
    const currentYear = new Date().getFullYear();

    switch (filterType) {
      case "year":
        const startYear = 2018;
        return Array.from({ length: currentYear - startYear + 1 }, (_, i) =>
          (startYear + i).toString()
        );

      case "month":
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

      case "week":
        return ["Week 1", "Week 2", "Week 3", "Week 4"];

      case "day":
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
            name: "Completed Orders ",
            data: [0, 0, 0, 0, 0, 0, 120, 180], // Example: 2 years
          },
          {
            name: "Pending Orders",
            data: [0, 0, 0, 0, 0, 0, 30, 50],
          },
        ];
      case "MONTH":
        return [
          {
            name: "Completed Orders",
            data: [65, 96, 75, 90, 55, 75, 85, 98, 46, 42, 81, 34],
          },
          {
            name: "Pending Orders",
            data: [56, 76, 65, 80, 55, 15, 79, 78, 35, 35, 72, 22],
          },
        ];
      case "WEEK":
        return [
          {
            name: "Completed Orders",
            data: [25, 32, 30, 28],
          },
          {
            name: "Pending Orders",
            data: [10, 5, 8, 3],
          },
        ];
      case "DAY":
        return [
          {
            name: "Completed Orders",
            data: Array.from({ length: 31 }, () =>
              Math.floor(Math.random() * 10)
            ),
          },
          {
            name: "Pending Orders",
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
    colors: ["#0BBE05", "#FF600F"],
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
                <Card.Title>Top Orders</Card.Title>
              </Card.Header>
              <Card.Body className="h-100 pt-2">
                <Table
                  responsive
                  className="table-ecommerce-simple table-no-collapse mb-1"
                  style={{ minWidth: "300px" }}
                >
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Retailer</th>
                      <th className="">Status</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topOrders &&
                      topOrders?.length &&
                      topOrders?.map((item: any, index: number) => (
                        <tr key={index}>
                          <td>
                            <Link to={`/orders/detail?_id=${item?._id}`}>
                              {item?.orderId || "-"}
                            </Link>
                          </td>
                          <td>
                            <Link to={`/retailers/detail?_id=${item?.userId}`}>
                              {item?.retailerDetails?.userName || "-"}
                            </Link>
                          </td>
                          <td className="">
                            <span
                              className={`ecommerce-status ${item?.status}`}
                            >
                              {capitalize(item?.status)}
                            </span>
                          </td>
                          <td className="text-right">{item?.totalPrice.toFixed(2)} AED</td>
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
                    <Card.Title>Orders</Card.Title>
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
                        <option value="year">Year</option>
                        <option value="month">Month</option>
                        <option value="week">Week</option>
                        <option value="day">Day</option>
                      </Form.Control>
                      {/* <Button
              type="submit"
              className="filter-btn my-1"
              variant="primary"
            >
              Filter
            </Button> */}
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="h-100 pt-2">
                <Row>
                  <Col className="col-auto">
                    <strong className="text-color-dark text-6">{chartData?.summary?.thisMonth}</strong>
                    <h3 className="text-4 mt-0 mb-2">This Month</h3>
                  </Col>
                  <Col className="col-auto">
                    <strong className="text-color-dark text-6">{chartData?.summary?.lastMonth}</strong>
                    <h3 className="text-4 mt-0 mb-2"> This Month </h3>
                  </Col>
                  <Col className="col-auto">
                    <strong className="text-color-dark text-6">{chartData?.summary?.totalOrders}</strong>
                    <h3 className="text-4 mt-0 mb-2">Total Orders</h3>
                  </Col>
                </Row>
                <Row>
                  <Col className="px-0">
                    {chartResult.length > 0 && (
                      <Chart
                        options={options}
                        series={chartResult}
                        type="bar"
                        height={273}
                      />
                    )}
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

export default Orders;
