import React, { useState } from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Breadcrumb from "src/components/common/breadcrumb";
import PtSwitch from "src/components/features/elements/switch";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";
import { toast } from "react-toastify";
import AddPlan from "./Popups/AddPlan";
import EditPlan from "./Popups/EditPlan";
import Loader from "src/components/features/loader";
import _, { capitalize } from "lodash";
import { errorMsg } from "src/utils/toast";
import {
  useGetAllPlansByRole,
  useUpdatePlanStatus,
} from "src/services/subscription.service";
import { SubscriptionPlan } from "src/types/types";

export type VendorPlan = {
  planName: string;
  description: string;
  price: number;
  currency: string;
  frequency: string;
  status: boolean;
  features: string[];
};

const VendorPlans = ({ header = false }) => {
  //STATES
  const [isAddOpen, setAddOpen] = useState<boolean>(false);
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [isStatusOpen, setStatusOpen] = useState<boolean>(false);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);

  // QUERIES
  const { data: plans, isLoading } = useGetAllPlansByRole("vendor") as {
    data: SubscriptionPlan[];
    isLoading: boolean;
  };

  //MUTATION
  const { mutateAsync: updatePlanStatus } = useUpdatePlanStatus();
  // const { mutateAsync: deletePlan } = useDeletePosterPlan();

  //HANDLERS
  // const handleDeletePlan = async (id: string) => {
  //   try {
  //     const res = await deletePlan(id);
  //     toast(res?.data?.message, {
  //       containerId: "default",
  //       className: "no-icon notification-success",
  //     });
  //     setDeleteOpen(false);
  //   } catch (error) {
  //     toast(_.capitalize(errorMsg(error).toLowerCase()), {
  //       containerId: "default",
  //       className: "no-icon notification-danger",
  //     });
  //   }
  // };

  const handleChangeStatus = async () => {
    try {
      const res = await updatePlanStatus({
        id: plan?._id || "",
        status: !plan?.isSuspend,
      });
      toast(res?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });
      setPlan(null);
      setStatusOpen(!isStatusOpen);
    } catch (error) {
      toast(_.capitalize(errorMsg(error).toLowerCase()), {
        containerId: "default",
        className: "no-icon notification-danger",
      });
    }
  };

  return (
    <>
      <Breadcrumb
        current={"Vendor Plans"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "Vendor Plans",
            url: "/subscriptions/plans",
          },
        ]}
      />
      <div>
        <Row>
          <Col>
            <Card className="card-modern">
              {/* <Card.Header>
                <Card.Title>Vendor Plans</Card.Title>
              </Card.Header> */}
              <Card.Body>
                <div className="datatables-header-footer-wrapper">
                  <div className="datatable-header">
                    <Row className="align-items-lg-center justify-content-end mb-3">
                      {header && (
                        <Col>
                          <h5 className="m-0 card-title h5 font-weight-bold">
                            Vendor Plans
                          </h5>
                        </Col>
                      )}
                      <Col className="col-auto pl-lg-1">
                        <div className="search search-style-1 mx-lg-auto w-auto">
                          {/* <InputGroup>
                            <Form.Control
                              type="text"
                              className="search-term"
                              placeholder="Search by Name"
                              style={{ width: "250px" }}
                              //   value={search}
                              //   onChange={(e) => setSearch(e.target.value)}
                            /> */}
                          {/* <InputGroup.Append> */}
                          {/* <Button
                              variant="default"
                              type="submit"
                            >
                              <i className="bx bx-search"></i>
                            </Button> */}
                          {/* </InputGroup.Append> */}
                          {/* </InputGroup> */}
                        </div>
                      </Col>
                      {/* <Col xl="auto" className="mb-2 mt-1 mb-xl-0">
                        <Button
                          className="font-weight-semibold"
                          variant="dark"
                          style={{ background: "#000" }}
                          onClick={() => setAddOpen(true)}
                        >
                          + Add Plan
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
                        <th>Trial Period</th>
                        <th>Yearly Off</th>
                        <th>Status</th>
                        <th className="text-center" style={{ width: "80px" }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ borderBottom: "1px solid #dee2e6" }}>
                      {isLoading && (
                        <tr>
                          <td colSpan={9}>
                            <Loader />
                          </td>
                        </tr>
                      )}
                      {!isLoading && plans && plans.length === 0 && (
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
                        plans &&
                        plans?.length > 0 &&
                        plans?.map((item: SubscriptionPlan, index: number) => (
                          <tr key={index}>
                            <td>
                              <Link
                                to={`/subscriptions/vendor-plans/detail?_id=${item?._id}`}
                              >
                                <strong>{index + 1}</strong>
                              </Link>
                            </td>
                            <td>
                              <Link
                                to={`/subscriptions/vendor-plans/detail?_id=${item?._id}`}
                              >
                                {_.capitalize(item?.plan.toLowerCase())}
                              </Link>
                            </td>
                            <td>{item?.price_monthly} AED</td>
                            {/* <td>
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
                            </td> */}
                            <td>{item?.trial_period} Days</td>
                            <td>{item?.yearly_off} %</td>
                            <td>
                              <div
                                onClick={() => {
                                  setPlan(item);
                                  setStatusOpen(true);
                                }}
                              >
                                <PtSwitch
                                  className="mr-1"
                                  on={!item?.isSuspend}
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
                                    setPlan(item);
                                    setEditOpen(true);
                                  }}
                                >
                                  <i className="fas fa-pencil-alt"></i>
                                </div>
                                {/* <div
                                  className="action_btn"
                                  onClick={() => {
                                    setPlan(item);
                                    setDeleteOpen(true);
                                  }}
                                >
                                  <i className="far fa-trash-alt"></i>
                                </div> */}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      {/* <ConfirmationPopup
        submit={() => handleDeletePlan(plan?._id)}
        isOpen={isDeleteOpen}
        toggle={() => setDeleteOpen(!isDeleteOpen)}
        text={"Are you sure that you want to delete this plan?"}
      /> */}
      <ConfirmationPopup
        submit={() => handleChangeStatus()}
        isOpen={isStatusOpen}
        toggle={() => {
          setPlan(null);
          setStatusOpen(!isStatusOpen);
        }}
        text={"Are you sure that you want to change the status of this plan?"}
      />
      <AddPlan isOpen={isAddOpen} toggle={() => setAddOpen(!isAddOpen)} />
      <EditPlan
        isOpen={isEditOpen}
        toggle={() => setEditOpen(!isEditOpen)}
        plan={plan?plan:null}
      />
    </>
  );
};

export default VendorPlans;
