// import Chart from "react-apexcharts";
// import React, { useEffect, useState } from "react";
// import { ApexOptions } from "apexcharts";
// import { Card, Col, Form, Row } from "react-bootstrap";
// import { usegetDataRevenue } from "src/services/dashboard.service";



// const Revenue = () => {
//   const [TAB, setTAB] = useState(2);
//   // const total = 119876.02;
//   // const [total, setTotal]=useState(0)
//   let year: any
//   let month: any
//   let last_month: any
//   let week: any;
//   let today: any;
//   let total: any


//   const { data: revenue } = usegetDataRevenue()

//   if (revenue) {

//     year = revenue?.yearRevenue || 0
//     month = revenue?.monthRevenue || 0
//     week = revenue?.weekRevenue || 0
//     today = revenue?.today || 0
//     total = revenue?.totalRevenue || 0


//   }

//  const getDonutData = () => {



//     switch (TAB) {
//       case 1:
//         return [total];
//       case 2:
//         return [total, year];
//       case 3:
//         return [total, month];
//       case 4:
//         return [total, week];
//       case 5:
//         return [total, today];
//       default:
//         return [];
//     }
//   };

//   //   const getDonutLabels = () => {
//   //     switch (TAB) {
//   //       case 1:
//   //         return ["Total Revenue"];
//   //       case 2:
//   //         return ["Q1", "Q2", "Q3", "Q4"]; // Yearly breakdown (customize as needed)
//   //       case 3:
//   //         return ["Week 1", "Week 2", "Week 3", "Week 4"]; // Monthly breakdown
//   //       case 4:
//   //         return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // Weekly breakdown
//   //       default:
//   //         return [];
//   //     }
//   //   };
//   const getDonutLabels = () => {
//     switch (TAB) {
//       case 1:
//         return ["Total Revenue"];
//       case 2:
//         return ["Total Revenue", "This Year"];
//       case 3:
//         return ["Total Revenue", "This Month"];
//       case 4:
//         return ["Total Revenue", "This Week"];
//       case 5:
//         return ["Total Revenue", "Today"];
//       default:
//         return [];
//     }
//   };

//   const getRevenueStats = () => {
//     switch (TAB) {
//       case 1:
//         return {
//           current: `$${revenue?.summary?.monthRevenue}`,
//           last: `$${revenue?.summary?.lastMonthRevenue}`,
//           label: "Month",
//         };
//       case 2:
//         return {
//           current: `$${revenue?.summary?.yearRevenue}`,
//           last: `$${revenue?.summary?.lastYearRevenue}`,
//           label: "Year",
//         };
//       case 3:
//         return {
//           current: `$${revenue?.summary?.monthRevenue}`,
//           last: `$${revenue?.summary?.lastMonthRevenue}`,
//           label: "Month",
//         };
//       case 4:
//         return {
//           current: `$${revenue?.summary?.weekRevenue}`,
//           last: `$${revenue?.summary?.lastWeekRevenue}`,
//           label: "Week",
//         };
//       case 5:
//         return {
//           current: `$${revenue?.summary?.todayRevenue}`,
//           last: `$${revenue?.summary?.todayRevenue}`,
//           label: "Today",
//         };
//       default:
//         return {
//           current: "$0.00",
//           last: "$0.00",
//           label: "-",
//         };
//     }
//   };

//   let curentData: any = 0
//   let lastData: any = 0
//   let labelData: any = ""

//   const donutOptions = {
//     legend: {
//       show: false,
//     },
//     labels: getDonutLabels(),
//     plotOptions: {
//       pie: {
//         donut: {
//           labels: {
//             show: true,
//             name: {
//               fontWeight: 700,
//             },
//             value: {
//               fontWeight: 700,
//             },
//             total: {
//               show: true,
//               label: "Total Revenue",
//               formatter: () => total.toString(),
//               fontWeight: 700,
//             },
//           },
//         },
//       },
//     },
//     responsive: [
//       {
//         breakpoint: 1400,
//         options: {
//           chart: {
//             height: 300,
//           },
//         },
//       },
//     ],
//   };

//   const options = {
//     chart: {
//       stacked: true,
//       toolbar: {
//         show: false,
//       },
//     },
//     legend: {
//       show: false,
//     },
//     xaxis: {
//       categories: [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ],
//     },
//     dataLabels: {
//       enabled: false,
//     },
//   };

//   const data = [
//     {
//       name: "revenue",
//       data: [
//         6518372, 9618372, 7518372, 9018372, 5518372, 7518372, 8518372, 9818372,
//         4618372, 4218372, 8118372, 3412211,
//       ],
//     },
//   ];



//   if (revenue) {

//     const { current, last, label } = getRevenueStats();

//     curentData = current
//     lastData = last
//     labelData = label

//   }

//   return (
//     <>
//       <Row className="">
//         <Col lg={4}>
//           <Row>
//             <Col sm={12} className="py-3">
//               <Card
//                 className={`card-modern dashboard_card  ${TAB === 2 && "active_tab"
//                   }`}
//                 onClick={() => setTAB(2)}
//                 style={{ cursor: "pointer" }}
//               >
//                 <Card.Body className="py-4 box text-dark">
//                   <Row className="align-items-center justify-content-between">
//                     <Col
//                       // sm={4}
//                       className="col-12"
//                     >
//                       <h3
//                         className="text-4-1 my-0 "
//                         style={{ whiteSpace: "nowrap" }}
//                       >
//                         This Year
//                       </h3>
//                       <strong className="text-6 "> {revenue?.summary?.yearRevenue}AED</strong>
//                     </Col>
//                     <Col className="  mt-auto">
//                       <div className="d-flex align-items-end ">
//                         <span className="text-color-success mr-1">
//                           {revenue?.summary?.totalRevenue}AED
//                         </span>

//                         <span>Total Revenue</span>
//                       </div>
//                     </Col>
//                     <Col
//                       sm={4}
//                       className="text-center text-sm-right  mt-4 mt-sm-0 d-flex justify-content-end"
//                     >
//                       <i className="bx bx-dollar icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
//                     </Col>
//                   </Row>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col sm={12} className="py-3">
//               <Card
//                 className={`card-modern dashboard_card  ${TAB === 3 && "active_tab"
//                   }`}
//                 onClick={() => setTAB(3)}
//                 style={{ cursor: "pointer" }}
//               >
//                 <Card.Body className="py-4 box text-dark">
//                   <Row className="align-items-center justify-content-between">
//                     <Col
//                       // sm={4}
//                       className="col-12"
//                     >
//                       <h3
//                         className="text-4-1 my-0 "
//                         style={{ whiteSpace: "nowrap" }}
//                       >
//                         This Month
//                       </h3>
//                       <strong className="text-6 ">  {revenue?.summary?.monthRevenue}AED</strong>
//                     </Col>
//                     <Col className="  mt-auto">
//                       <div className="d-flex align-items-end ">
//                         <span className="text-color-success mr-1">
//                           {revenue?.summary?.totalRevenue}AED
//                         </span>

//                         <span>Total Revenue</span>
//                       </div>
//                     </Col>
//                     <Col
//                       sm={4}
//                       className="text-center text-sm-right  mt-4 mt-sm-0 d-flex justify-content-end"
//                     >
//                       <i className="bx bx-dollar icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
//                     </Col>
//                   </Row>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col sm={12} className="py-3">
//               <Card
//                 className={`card-modern dashboard_card  ${TAB === 4 && "active_tab"
//                   }`}
//                 onClick={() => setTAB(4)}
//                 style={{ cursor: "pointer" }}
//               >
//                 <Card.Body className="py-4 box text-dark">
//                   <Row className="align-items-center justify-content-between">
//                     <Col
//                       // sm={4}
//                       className="col-12"
//                     >
//                       <h3
//                         className="text-4-1 my-0 "
//                         style={{ whiteSpace: "nowrap" }}
//                       >
//                         This Week
//                       </h3>
//                       <strong className="text-6 "> {revenue?.summary?.weekRevenue}AED</strong>
//                     </Col>
//                     <Col className="  mt-auto">
//                       <div className="d-flex align-items-end ">
//                         <span className="text-color-success mr-1">
//                           {revenue?.summary?.totalRevenue}AED
//                         </span>

//                         <span>Total Revenue</span>
//                       </div>
//                     </Col>
//                     <Col
//                       sm={4}
//                       className="text-center text-sm-right  mt-4 mt-sm-0 d-flex justify-content-end"
//                     >
//                       <i className="bx bx-dollar icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
//                     </Col>
//                   </Row>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col sm={12} className="py-3">
//               <Card
//                 className={`card-modern dashboard_card  ${TAB === 5 && "active_tab"
//                   }`}
//                 onClick={() => setTAB(5)}
//                 style={{ cursor: "pointer" }}
//               >
//                 <Card.Body className="py-4 box text-dark">
//                   <Row className="align-items-center justify-content-between">
//                     <Col
//                       // sm={4}
//                       className="col-12"
//                     >
//                       <h3
//                         className="text-4-1 my-0 "
//                         style={{ whiteSpace: "nowrap" }}
//                       >
//                         Today
//                       </h3>
//                       <strong className="text-6 ">  {revenue?.summary?.todayRevenue}AED</strong>
//                     </Col>
//                     <Col className="  mt-auto">
//                       <div className="d-flex align-items-end ">
//                         <span className="text-color-success mr-1">
//                           {revenue?.summary?.totalRevenue}AED
//                         </span>

//                         <span>Total Revenue</span>
//                       </div>
//                     </Col>
//                     <Col
//                       sm={4}
//                       className="text-center text-sm-right  mt-4 mt-sm-0 d-flex justify-content-end"
//                     >
//                       <i className="bx bx-dollar icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
//                     </Col>
//                   </Row>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         </Col>
//         <Col lg={8} className="py-3">
//           <Card className="card-modern h-100">
//             <Card.Header>
//               <Row>
//                 <Col>
//                   <Card.Title>Revenue</Card.Title>
//                 </Col>
//               </Row>
//             </Card.Header>
//             <Card.Body className="h-100 pt-2">
//               <Row>
//                 <Col className="col-auto">
//                   <strong className="text-color-dark text-6">{curentData}</strong>
//                   <h3 className="text-4 mt-0 mb-2">This {labelData}</h3>
//                 </Col>
//                 <Col className="col-auto">
//                   <strong className="text-color-dark text-6">{lastData}</strong>
//                   <h3 className="text-4 mt-0 mb-2">Last {labelData}</h3>
//                 </Col>
//                 <Col className="col-auto">
//                   <strong className="text-color-dark text-6">${total}</strong>
//                   <h3 className="text-4 mt-0 mb-2">Total Profit</h3>
//                 </Col>
//               </Row>
//               <Row className=" h-100">
//                 <Col
//                   lg={12}
//                   className="px-0 h-100 d-flex align-items-md-center justify-content-center"
//                 >
//                   <div className="" style={{ height: "80%", width: "100%" }}>
//                     <Chart
//                       type="donut"
//                       options={donutOptions}
//                       series={getDonutData()}
//                       width="100%"
//                       height="100%"
//                     />
//                   </div>
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col lg={12} className="py-3">
//           <Card className="card-modern h-100">
//             <Card.Header>
//               <Card.Title>Revenue</Card.Title>
//             </Card.Header>
//             <Card.Body className="h-100 pt-2">
//               <Row>
//                 <Col className="col-auto">
//                   <strong className="text-color-dark text-6">${month}</strong>
//                   <h3 className="text-4 mt-0 mb-2">This Month</h3>
//                 </Col>
//                 <Col className="col-auto">
//                   <strong className="text-color-dark text-6">$14,345.26</strong>
//                   <h3 className="text-4 mt-0 mb-2">Last Month</h3>
//                 </Col>
//                 <Col className="col-auto">
//                   <strong className="text-color-dark text-6">
//                     ${total}
//                   </strong>
//                   <h3 className="text-4 mt-0 mb-2">Total Profit</h3>
//                 </Col>
//               </Row>

//               <Row>
//                 <Col className="px-0" style={{ height: "400px" }}>
//                   <Chart
//                     options={options}
//                     series={data}
//                     type="bar"
//                     height={"100%"}
//                   />
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </>
//   );
// };

// export default Revenue;









import Chart from "react-apexcharts";
import React, { useMemo, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { usegetDataRevenue } from "src/services/dashboard.service";

const formatAED = (value: any) => {
  const n = Number(value || 0);
  return `${n.toLocaleString("en-US", { maximumFractionDigits: 2 })} AED`;
};

const Revenue = () => {
  const [TAB, setTAB] = useState(2);

  // Your actual API hook
  const { data: revenue } = usegetDataRevenue();

  // ====== Safe derived values from your actual API response ======
  const totals = useMemo(() => {
    const s = revenue?.summary;
    return {
      total: Number(s?.totalRevenue || 0),

      year: Number(s?.yearRevenue || 0),
      month: Number(s?.monthRevenue || 0),
      week: Number(s?.weekRevenue || 0),
      today: Number(s?.todayRevenue || 0),

      lastYear: Number(s?.lastYearRevenue || 0),
      lastMonth: Number(s?.lastMonthRevenue || 0),
      lastWeek: Number(s?.lastWeekRevenue || 0),
      lastDay: Number(s?.lastDayRevenue || 0),

      yearGrowthPct: Number(s?.yearGrowthPct || 0),
      monthGrowthPct: Number(s?.monthGrowthPct || 0),
      weekGrowthPct: Number(s?.weekGrowthPct || 0),
      todayGrowthPct: Number(s?.todayGrowthPct || 0),

      totalOrders: Number(s?.totalOrders || 0),
    };
  }, [revenue]);

  // ====== Donut data/labels (kept same behavior, but safe) ======
  const donutLabels = useMemo(() => {
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
  }, [TAB]);

  const donutSeries = useMemo(() => {
    switch (TAB) {
      case 1:
        return [totals.total];
      case 2:
        return [totals.total, totals.year];
      case 3:
        return [totals.total, totals.month];
      case 4:
        return [totals.total, totals.week];
      case 5:
        return [totals.total, totals.today];
      default:
        return [0];
    }
  }, [TAB, totals]);

  const donutOptions: any = useMemo(
    () => ({
      legend: { show: false },
      labels: donutLabels,
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: { fontWeight: 700 },
              value: { fontWeight: 700 },
              total: {
                show: true,
                label: "Total Revenue",
                formatter: () => formatAED(totals.total),
                fontWeight: 700,
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 1400,
          options: { chart: { height: 300 } },
        },
      ],
    }),
    [donutLabels, totals.total]
  );

  // ====== Revenue stats for top numbers (This vs Last) ======
  const revenueStats = useMemo(() => {
    switch (TAB) {
      case 2:
        return { current: totals.year, last: totals.lastYear, label: "Year" };
      case 3:
        return { current: totals.month, last: totals.lastMonth, label: "Month" };
      case 4:
        return { current: totals.week, last: totals.lastWeek, label: "Week" };
      case 5:
        return { current: totals.today, last: totals.lastDay, label: "Day" };
      default:
        return { current: totals.month, last: totals.lastMonth, label: "Month" };
    }
  }, [TAB, totals]);

  // ====== Timeline for BAR chart changes based on TAB ======
  const activeTimeline = useMemo(() => {
    const t = revenue?.timelines;
    switch (TAB) {
      case 2:
        return t?.year || []; // 12 months
      case 3:
        return t?.month || []; // days (1..31 typically)
      case 4:
        return t?.week || []; // 7 days (period as date string)
      case 5:
        return t?.today || []; // 24 hours
      default:
        return t?.year || [];
    }
  }, [TAB, revenue]);

  const barCategories = useMemo(() => {
    switch (TAB) {
      case 2:
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      case 3:
        // If backend sends only some days, this still works with chart alignment by index.
        // For perfect alignment, backend should send full 1..31.
        return Array.from({ length: 31 }, (_, i) => `${i + 1}`);
      case 4:
        // Use the actual date strings from API if available
        return activeTimeline.map((x: any) => String(x.period));
      case 5:
        return Array.from({ length: 24 }, (_, i) => `${i}:00`);
      default:
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }
  }, [TAB, activeTimeline]);

  const barOptions: any = useMemo(
    () => ({
      chart: {
        stacked: false,
        toolbar: { show: false },
      },
      legend: { show: false },
      xaxis: { categories: barCategories },
      dataLabels: { enabled: false },
    }),
    [barCategories]
  );

  // Revenue-only series (use Orders too if you want)
  const barSeries = useMemo(
    () => [
      {
        name: "Revenue",
        data: activeTimeline.map((x: any) => Number(x.revenue || 0)),
      },
      // Uncomment if you want Orders line/bar too:
      // {
      //   name: "Orders",
      //   data: activeTimeline.map((x: any) => Number(x.orders || 0)),
      // },
    ],
    [activeTimeline]
  );

  return (
    <Row>
      <Col lg={4}>
        <Row>
          <Col sm={12} className="py-3">
            <Card
              className={`card-modern dashboard_card ${TAB === 2 ? "active_tab" : ""}`}
              onClick={() => setTAB(2)}
              style={{ cursor: "pointer" }}
            >
              <Card.Body className="py-4 box text-dark">
                <Row className="align-items-center justify-content-between">
                  <Col className="col-12">
                    <h3 className="text-4-1 my-0" style={{ whiteSpace: "nowrap" }}>
                      This Year
                    </h3>
                    <strong className="text-6">{formatAED(totals.year)}</strong>
                  </Col>
                  <Col className="mt-auto">
                    {/* <div className="d-flex align-items-end">
                      <span className="text-color-success mr-1">{formatAED(totals.total)}</span>
                      <span>Total Revenue</span>
                    </div> */}
                  </Col>
                  <Col sm={4} className="text-center text-sm-right mt-4 mt-sm-0 d-flex justify-content-end">
                    <i className="bx bx-dollar icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col sm={12} className="py-3">
            <Card
              className={`card-modern dashboard_card ${TAB === 3 ? "active_tab" : ""}`}
              onClick={() => setTAB(3)}
              style={{ cursor: "pointer" }}
            >
              <Card.Body className="py-4 box text-dark">
                <Row className="align-items-center justify-content-between">
                  <Col className="col-12">
                    <h3 className="text-4-1 my-0" style={{ whiteSpace: "nowrap" }}>
                      This Month
                    </h3>
                    <strong className="text-6">{formatAED(totals.month)}</strong>
                  </Col>
                  <Col className="mt-auto">
                    {/* <div className="d-flex align-items-end">
                      <span className="text-color-success mr-1">{formatAED(totals.total)}</span>
                      <span>Total Revenue</span>
                    </div> */}
                  </Col>
                  <Col sm={4} className="text-center text-sm-right mt-4 mt-sm-0 d-flex justify-content-end">
                    <i className="bx bx-dollar icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col sm={12} className="py-3">
            <Card
              className={`card-modern dashboard_card ${TAB === 4 ? "active_tab" : ""}`}
              onClick={() => setTAB(4)}
              style={{ cursor: "pointer" }}
            >
              <Card.Body className="py-4 box text-dark">
                <Row className="align-items-center justify-content-between">
                  <Col className="col-12">
                    <h3 className="text-4-1 my-0" style={{ whiteSpace: "nowrap" }}>
                      This Week
                    </h3>
                    <strong className="text-6">{formatAED(totals.week)}</strong>
                  </Col>
                  <Col className="mt-auto">
                    {/* <div className="d-flex align-items-end">
                      <span className="text-color-success mr-1">{formatAED(totals.total)}</span>
                      <span>Total Revenue</span>
                    </div> */}
                  </Col>
                  <Col sm={4} className="text-center text-sm-right mt-4 mt-sm-0 d-flex justify-content-end">
                    <i className="bx bx-dollar icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col sm={12} className="py-3">
            <Card
              className={`card-modern dashboard_card ${TAB === 5 ? "active_tab" : ""}`}
              onClick={() => setTAB(5)}
              style={{ cursor: "pointer" }}
            >
              <Card.Body className="py-4 box text-dark">
                <Row className="align-items-center justify-content-between">
                  <Col className="col-12">
                    <h3 className="text-4-1 my-0" style={{ whiteSpace: "nowrap" }}>
                      Today
                    </h3>
                    <strong className="text-6">{formatAED(totals.today)}</strong>
                  </Col>
                  <Col className="mt-auto">
                    <div className="d-flex align-items-end">
                      <span className="text-color-success mr-1">{formatAED(totals.total)}</span>
                      <span>Total Revenue</span>
                    </div>
                  </Col>
                  <Col sm={4} className="text-center text-sm-right mt-4 mt-sm-0 d-flex justify-content-end">
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
                <strong className="text-color-dark text-6">{formatAED(revenueStats.current)}</strong>
                <h3 className="text-4 mt-0 mb-2">This {revenueStats.label}</h3>
              </Col>
              <Col className="col-auto">
                <strong className="text-color-dark text-6">{formatAED(revenueStats.last)}</strong>
                <h3 className="text-4 mt-0 mb-2">Last {revenueStats.label}</h3>
              </Col>
              <Col className="col-auto">
                <strong className="text-color-dark text-6">{formatAED(totals.total)}</strong>
                <h3 className="text-4 mt-0 mb-2">Total Revenue</h3>
              </Col>
            </Row>

            <Row className="h-100">
              <Col lg={12} className="px-0 h-100 d-flex align-items-md-center justify-content-center">
                <div style={{ height: "80%", width: "100%" }}>
                  <Chart type="donut" options={donutOptions} series={donutSeries} width="100%" height="100%" />
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
                <strong className="text-color-dark text-6">{formatAED(totals.month)}</strong>
                <h3 className="text-4 mt-0 mb-2">This Month</h3>
              </Col>
              <Col className="col-auto">
                <strong className="text-color-dark text-6">{formatAED(totals.lastMonth)}</strong>
                <h3 className="text-4 mt-0 mb-2">Last Month</h3>
              </Col>
              <Col className="col-auto">
                <strong className="text-color-dark text-6">{formatAED(totals.total)}</strong>
                <h3 className="text-4 mt-0 mb-2">Total Revenue</h3>
              </Col>
            </Row>

            <Row>
              <Col className="px-0" style={{ height: "400px" }}>
                <Chart options={barOptions} series={barSeries} type="bar" height={"100%"} />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Revenue;







