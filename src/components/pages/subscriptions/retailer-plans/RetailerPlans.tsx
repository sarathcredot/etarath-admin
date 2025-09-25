import { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Breadcrumb from "src/components/common/breadcrumb";
import Pagination from "src/components/common/Pagination";
import PtSwitch from "src/components/features/elements/switch";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";
import { toast } from "react-toastify";
import AddAuctionPlan from "./Popups/AddAuctionPlan";
import EditAuctionPlan from "./Popups/EditAuctionPlan";
import { errorMsg } from "src/utils/toast";
import _, { capitalize } from "lodash";
import Loader from "src/components/features/loader";

export type RetailerPlan = {
  planName: string;
  description: string;
  trialDays: number;
  price: number;
  currency: string;
  frequency: string;
  status: boolean;
  features: string[];
};

const RetailerPlans = ({ header = false }) => {
  //STATES
  const [isAddOpen, setAddOpen] = useState<boolean>(false);
  const [isEditOpen, setEditOpen] = useState<any>(null);
  const [isDeleteOpen, setDeleteOpen] = useState<any>(null);
  const [auctionPlan, setAuctionPlan] = useState<any>(null);
  const [auctionPlans, setAuctionPlans] = useState<any>([]);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  //QUERY
  const queryObj = useMemo(() => {
    const obj: any = {
      skip: true,
    };

    if (currentPage) {
      obj.page = currentPage;
    }

    if (limit) {
      obj.limit = limit;
    }

    return obj;
  }, [currentPage, limit]);

  //DATA
  // const { data, isLoading } = useGetAllAuctionPlans(queryObj);
  // const auctionPlans = data?.auctionPlans || [];
  const pagination = { totalPages: 10 } ;

  //MUTATION
  // const { mutateAsync: updateAuctionPlan } = useUpdateAuctionPlanById();
  // const { mutateAsync: deleteAuctionPlan } = useDeleteAuctionPlan();

  //HANDLERS
  const handleDeleteAuctionPlan = async (id: string) => {
    try {
      // const res = await deleteAuctionPlan(id);
      // toast(res?.data?.message, {
      //   containerId: "default",
      //   className: "no-icon notification-success",
      // });
      setDeleteOpen(null);
    } catch (error) {
      toast(_.capitalize(errorMsg(error).toLowerCase()), {
        containerId: "default",
        className: "no-icon notification-danger",
      });
    }
  };
  const handleChangeStatus = async () => {
    try {
      // const res = await updateAuctionPlan({
      //   id: auctionPlan?._id,
      //   isActive: !auctionPlan?.isActive,
      // });
      // toast(res?.data?.message, {
      //   containerId: "default",
      //   className: "no-icon notification-success",
      // });
      setAuctionPlan(null);
    } catch (error) {
      toast(_.capitalize(errorMsg(error).toLowerCase()), {
        containerId: "default",
        className: "no-icon notification-danger",
      });
    }
  };
  // useEffect(() => {
  //   if (data?.auctionPlans) {
  //     setAuctionPlans(data?.auctionPlans);
  //   }
  // }, [data, currentPage]);

  const retailerPlans: RetailerPlan[] = [
    {
      planName: "Standard",
      description: "For small shop owners and retailers",
      trialDays: 75,
      price: 49,
      currency: "AED",
      frequency: "monthly",
      status: true,
      features: [
        "Up to 50 products",
        "Basic analytics dashboard",
        "Email support",
        "1 staff account",
      ],
    },
    {
      planName: "Executive",
      description: "For intermediate shop owners and retailers",
      trialDays: 75,
      price: 89,
      currency: "AED",
      frequency: "monthly",
      status: true,
      features: [
        "Up to 200 products",
        "Advanced analytics",
        "Priority email + chat support",
        "3 staff accounts",
        "Custom branding",
      ],
    },
    {
      planName: "Corporate",
      description: "For large scale business owners and retailers",
      trialDays: 75,
      price: 129,
      currency: "AED",
      frequency: "monthly",
      status: false,
      features: [
        "Unlimited products",
        "Full analytics suite",
        "Dedicated account manager",
        "10 staff accounts",
        "Custom integrations",
        "Premium support",
      ],
    },
  ];
  return (
    <>
      <Breadcrumb
        current={"Retailer Plans"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "retailer plans",
            url: "/subscriptions/retailer-plans",
          },
        ]}
      />
      <div>
        <Row>
          <Col>
            <Card className="card-modern">
              {/* <Card.Header>
                <Card.Title>Recent Orders</Card.Title>
              </Card.Header> */}
              <Card.Body>
                <div className="datatables-header-footer-wrapper">
                  <div className="datatable-header">
                    <Row className="align-items-lg-center justify-content-end mb-3">
                      {header && (
                        <Col>
                          <h5 className="m-0 card-title h5 font-weight-bold">
                            Auction Plans
                          </h5>
                        </Col>
                      )}
                      {/* <Col xl="auto" className="mb-2 mt-1 mb-xl-0">
                        <Button
                          className="font-weight-semibold"
                          variant="dark"
                          style={{ background: "#000" }}
                          onClick={() => setAddOpen(true)}
                        >
                          + Add Auction Plans
                        </Button>
                      </Col> */}
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
                            <option value="">All</option>
                            <option value="">Football</option>
                            <option value="">Cricket</option>
                          </Form.Control>
                          <Button
                            type="submit"
                            className="filter-btn my-1"
                            variant="primary"
                          >
                            Filter
                          </Button>
                        </div>
                      </Col> */}
                    </Row>
                  </div>
                  <Table
                    className="table-ecommerce-simple mb-0"
                    responsive="xl"
                    striped
                    // bordered
                    style={{ minWidth: "600px" }}
                  >
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>#</th>

                        <th>Plan</th>
                        <th>Price</th>
                        <th>Features</th>
                        <th>Trial</th>
                        <th>Frequency</th>
                        <th>Status</th>
                        <th className="text-center" style={{ width: "80px" }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ borderBottom: "1px solid #dee2e6" }}>
                      {false && (
                        <tr>
                          <td colSpan={9}>
                            <Loader />
                          </td>
                        </tr>
                      )}
                      {false &&
                        retailerPlans &&
                        retailerPlans?.length === 0 && (
                          <tr>
                            <td
                              colSpan={9}
                              style={{ textAlign: "center", height: "100px" }}
                            >
                              No plans found.
                            </td>
                          </tr>
                        )}
                      {true &&
                        retailerPlans &&
                        retailerPlans?.length > 0 &&
                        retailerPlans?.map(
                          (item: RetailerPlan, index: number) => (
                            <tr key={index}>
                              <td>
                                <Link
                                  to={`/subscriptions/retailer-plans/detail?_id=${index}`}
                                >
                                  <strong>{index + 1}</strong>
                                </Link>
                              </td>
                              <td>
                                <Link
                                  to={`/subscriptions/retailer-plans/detail?_id=${index}`}
                                >
                                  {item?.planName}
                                </Link>
                              </td>
                              <td>{item?.price || 0} AED</td>
                              <td>
                                {item?.features
                                  .slice(0, 3)
                                  .map((feature: any, i: number) => (
                                    <li key={i}>{feature}</li>
                                  ))}
                                {item?.features.length > 3 && (
                                  <li className="text-secondary">
                                    +{item.features.length - 3} more
                                  </li>
                                )}
                              </td>
                              <td>{item?.trialDays} Days</td>
                              <td>{capitalize(item?.frequency)}</td>
                              <td>
                                <div
                                  onClick={() => {
                                    setAuctionPlan(item);
                                  }}
                                >
                                  <PtSwitch
                                    className="mr-1"
                                    on={item?.status}
                                    size="sm"
                                    variant="success"
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-around">
                                  <div
                                    className="action_btn"
                                    onClick={() => {
                                      setEditOpen(index);
                                    }}
                                  >
                                    <i className="fas fa-pencil-alt"></i>
                                  </div>
                                  <div
                                    className="action_btn"
                                    onClick={() => {
                                      setDeleteOpen(index);
                                    }}
                                  >
                                    <i className="far fa-trash-alt"></i>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                    </tbody>
                  </Table>
                </div>
                {pagination?.totalPages && pagination?.totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalButtonsToShow={3}
                    totalPages={pagination?.totalPages || 0}
                    style={{ marginTop: "20px" }}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <ConfirmationPopup
        submit={() => handleDeleteAuctionPlan(isDeleteOpen)}
        isOpen={isDeleteOpen !== null}
        toggle={() => setDeleteOpen(null)}
        text={"Are you sure that you want to delete this auction plan?"}
      />
      <ConfirmationPopup
        submit={() => handleChangeStatus()}
        isOpen={auctionPlan !== null}
        toggle={() => setAuctionPlan(null)}
        text={
          "Are you sure that you want to change the status of this auction plan?"
        }
      />
      <AddAuctionPlan
        isOpen={isAddOpen}
        toggle={() => setAddOpen(!isAddOpen)}
      />
      <EditAuctionPlan
        isOpen={isEditOpen !== null}
        toggle={() => setEditOpen(null)}
        id={isEditOpen}
      />
    </>
  );
};

export default RetailerPlans;
