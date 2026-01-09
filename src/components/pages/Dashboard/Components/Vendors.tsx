import { ApexOptions } from "apexcharts";
import React, { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { Reveal } from "react-awesome-reveal";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetAllTopUsersAndOrders, usegetchartData, convertTimelineToApexSeries } from "src/services/dashboard.service";
import { User } from "src/types/types";
import { fadeIn } from "src/utils/data/keyframes";
import { useNavigate } from "react-router-dom";

const Vendors = () => {
  const [filter, setFilter] = useState<string>("month");
  const [chartResult, setChartResult] = useState<any[]>([]);
  const navigate = useNavigate()
  // QUERIES
  const { data: topVendors } = useGetAllTopUsersAndOrders("vendor");


  const getCategories = (filterType: string) => {
    const currentYear = new Date().getFullYear();

    switch (filterType) {


      case "year": {
        const totalSlots = 5; // same as backend
        return Array.from({ length: totalSlots }, (_, i) =>
          (currentYear - 4 + i).toString()
        );
      }

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
            name: "Verified Vendors",
            data: [0, 0, 0, 0, 0, 0, 120, 180], // Example: 2 years
          },
          {
            name: "Rejected Vendors",
            data: [0, 0, 0, 0, 0, 0, 30, 50],
          },
          {
            name: "Verification Pending Vendors",
            data: [0, 0, 0, 0, 0, 0, 30, 50],
          },
        ];
      case "MONTH":
        return [
          {
            name: "Verified Vendors",
            data: [65, 96, 75, 90, 55, 75, 85, 98, 46, 42, 81, 34],
          },
          {
            name: "Rejected Vendors",
            data: [56, 76, 65, 80, 55, 15, 79, 78, 35, 35, 72, 22],
          },
          {
            name: "Verification Pending Vendors",
            data: [26, 16, 5, 20, 15, 15, 19, 18, 15, 15, 12, 12],
          },
        ];
      case "WEEK":
        return [
          {
            name: "Verified Vendors",
            data: [25, 32, 30, 28],
          },
          {
            name: "Rejected Vendors",
            data: [10, 5, 8, 3],
          },
          {
            name: "Verification Pending Vendors",
            data: [0, 0, 0, 0, 0, 0, 30, 50],
          },
        ];
      case "DAY":
        return [
          {
            name: "Verified Vendors",
            data: Array.from({ length: 31 }, () =>
              Math.floor(Math.random() * 10)
            ),
          },
          {
            name: "Rejected Vendors",
            data: Array.from({ length: 31 }, () =>
              Math.floor(Math.random() * 5)
            ),
          },
          {
            name: "Verification Pending Vendors",
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


  const agentQueryObj = useMemo(() => {
    const obj: any = {};

    obj.role = "vendor"
    obj.year = "2026"
    // obj.chartType="user"

    if (filter) {
      obj.filter = filter;
    }

    return obj;
  }, [filter]);



  const { data: chartData } = usegetchartData(true, agentQueryObj)


  useEffect(() => {

    if (!chartData?.timeline || !filter) return;

    const result = convertTimelineToApexSeries(
      chartData.timeline,
      filter,
      "user",
      "vendor"
    );

    setChartResult(result);

  }, [chartData, filter]);


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
                <div style={{ display: "flex", justifyContent: "space-between" }} >

                  <Card.Title>Top Vendors</Card.Title>
                  <button onClick={()=>{navigate("/vendors")}} style={{ height: "40px" }} className="btn-black">
                    View More
                  </button>

                </div>
              </Card.Header>
              <Card.Body className="h-100 pt-2">
                <Table
                  responsive
                  className="table-ecommerce-simple table-no-collapse mb-1"
                  style={{ minWidth: "300px" }}
                >
                  <thead>
                    <tr>
                      <th>Vendor</th>
                      {/* <th> Phone Number</th> */}
                      <th className="text-lg-right">Total Products</th>
                      <th className="text-lg-right">Total Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topVendors &&
                      topVendors?.length &&
                      topVendors?.slice(0, 8)?.map(
                        (
                          item: {
                            orderCount: number;
                            stockCount: number;
                            vendorName: string;
                            vendorId: string;
                          },
                          index: number
                        ) => (
                          <tr key={index}>
                            <td>
                              <Link
                                to={`/vendors/detail?_id=${item?.vendorId}`}
                                style={{ textDecoration: "none", color: "#000" }}
                              >
                                {item?.vendorName}
                              </Link>
                            </td>
                            {/* <td>{item?.phoneNumber}</td> */}
                            <td className="text-lg-right">
                              {item?.stockCount}
                            </td>
                            <td className="text-lg-right">
                              {item?.orderCount}
                            </td>
                          </tr>
                        )
                      )}
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
                    <Card.Title>Vendors</Card.Title>
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
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="h-100 pt-2">
                <Row>
                  <Col className="col-auto">
                    <strong className="text-color-dark text-6">{chartData?.summary?.currentPeriod}</strong>
                    <h3 className="text-4 mt-0 mb-2">This {filter}</h3>
                  </Col>
                  <Col className="col-auto">
                    <strong className="text-color-dark text-6">{chartData?.summary?.previousPeriod}</strong>
                    <h3 className="text-4 mt-0 mb-2">Last {filter}</h3>
                  </Col>
                  <Col className="col-auto">
                    <strong className="text-color-dark text-6">{chartData?.summary?.totalUsers}</strong>
                    <h3 className="text-4 mt-0 mb-2">Total Vendors</h3>
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

export default Vendors;
