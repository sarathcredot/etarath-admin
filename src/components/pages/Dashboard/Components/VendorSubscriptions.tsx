import Chart from "react-apexcharts";
import React, { useEffect, useMemo, useState } from "react";
import { Card, Col, Row, Table, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { convertTimelineToApexSeries, usegetDataSubcriptionDataRole, usegetDataSubcriptionDataRoleChart, convertSubscriptionTimelineToApexSeries } from "src/services/dashboard.service";
import { ApexOptions } from "apexcharts";

const VendorSubscriptions = () => {


  const [filter, setFilter] = useState<string>("month");
  const [chartResult, setChartResult] = useState<any[]>([]);

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
      case "year":
        return [
          {
            name: "Standard Subscriptions",
            data: [0, 0, 0, 0, 0, 0, 120, 180], // Example: 2 years
          },
          {
            name: "Executive Subscriptions",
            data: [0, 0, 0, 0, 0, 0, 30, 50],
          },
          {
            name: "Corporate Subscriptions",
            data: [0, 0, 0, 0, 0, 0, 30, 50],
          },
        ];
      case "month":
        return [
          {
            name: "Standard Subscriptions",
            data: [65, 96, 75, 90, 55, 75, 85, 98, 46, 42, 81, 34],
          },
          {
            name: "Executive Subscriptions",
            data: [56, 76, 65, 80, 55, 15, 79, 78, 35, 35, 72, 22],
          },
          {
            name: "Corporate Subscriptions",
            data: [26, 16, 5, 20, 15, 15, 19, 18, 15, 15, 12, 12],
          },
        ];
      case "week":
        return [
          {
            name: "Standard Subscriptions",
            data: [25, 32, 30, 28],
          },
          {
            name: "Executive Subscriptions",
            data: [10, 5, 8, 3],
          },
          {
            name: "Corporate Subscriptions",
            data: [0, 0, 0, 0, 0, 0, 30, 50],
          },
        ];
      case "day":
        return [
          {
            name: "Standard Subscriptions",
            data: Array.from({ length: 31 }, () =>
              Math.floor(Math.random() * 10)
            ),
          },
          {
            name: "Executive Subscriptions",
            data: Array.from({ length: 31 }, () =>
              Math.floor(Math.random() * 5)
            ),
          },
          {
            name: "Corporate Subscriptions",
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
    // colors: ["#0BBE05", "#FF0F0F", "#FF600F"],
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

  const agentQueryObj = useMemo(() => {
    const obj: any = {};

    obj.role = "vendor"
    // obj.year = "2026"
    // obj.chartType="user"

    if (filter) {
      obj.filter = filter;
    }

    return obj;
  }, [filter]);



  const { data: result } = usegetDataSubcriptionDataRole(true, { role: "vendor" })

  const { data: resultChart } = usegetDataSubcriptionDataRoleChart(true, agentQueryObj)

  useEffect(() => {

    if (!resultChart?.timeline || !filter) return;

    const result = convertSubscriptionTimelineToApexSeries(
      resultChart?.timeline,
      filter

    );

    setChartResult(result);

  }, [resultChart, filter]);


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

                  {
                    result?.plans?.map((data: any, index: any) => (

                      <tr key={index}>
                        <td>
                          <Link to={`/subscriptions/vendor-plans/detail?_id=${data?._id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            <i className="bx bx-package mr-2"></i>
                            {data?.planName}
                          </Link>
                        </td>
                        <td> {data?.totalSubscriptions} </td>
                        <td className="text-lg-right">

                          {data?.monthlyCount}

                        </td>
                      </tr>
                    ))
                  }
                  {/* <tr>
                    <td>
                      <Link to={`/subscriptions/vendor-plans/detail?_id=1`}>
                        <i className="bx bx-package mr-2"></i>
                        Executive
                      </Link>
                    </td>
                    <td>780</td>
                    <td className="text-lg-right">70</td>
                  </tr> */}

                  {/* <tr>
                    <td>
                      <Link to={`/subscriptions/vendor-plans/detail?_id=1`}>
                        <i className="bx bx-package mr-2"></i>
                        Corporate
                      </Link>
                    </td>
                    <td>890</td>
                    <td className="text-lg-right">75</td>
                  </tr>
                
                 */}

                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>


        {/* <Col
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
        </Col> */}


        <Col sm={12} className="py-3">
          {/* <Card className="card-modern h-100">
                    <Card.Header>
                      <Card.Title>Retailer Subscriptions</Card.Title>
                    </Card.Header>
                    <Card.Body className="h-100 pt-2">
                      <Row>
                        <Col className="col-auto">
                          <strong className="text-color-dark text-6">190</strong>
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
                  </Card> */}
          <Card className="card-modern h-100">
            <Card.Header>
              <Row>
                <Col>
                  <Card.Title>Vendor Subscriptions</Card.Title>
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
                      <option value="dauy">Day</option>
                    </Form.Control>
                  </div>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="h-100 pt-2">
              <Row>
                <Col className="col-auto">
                  <strong className="text-color-dark text-6">{resultChart?.summary?.thisPeriod}</strong>
                  <h3 className="text-4 mt-0 mb-2">
                    this {filter}

                  </h3>
                </Col>
                <Col className="col-auto">
                  <strong className="text-color-dark text-6">{resultChart?.summary?.thisPeriod}</strong>
                  <h3 className="text-4 mt-0 mb-2">   this {filter} </h3>
                </Col>
                <Col className="col-auto">
                  <strong className="text-color-dark text-6">{resultChart?.summary?.thisPeriod}</strong>
                  <h3 className="text-4 mt-0 mb-2">Total Subscriptions</h3>
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
    </>
  );
};

export default VendorSubscriptions;
