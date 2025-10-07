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
  const [isEditOpen, setEditOpen] = useState<any>(null);
  const [isDeleteOpen, setDeleteOpen] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);

  //DATA
  // const { data: plans, isLoading } = useGetAllPosterPlans({});

  //MUTATION
  // const { mutateAsync: updatePlan } = useUpdatePosterPlanById();
  // const { mutateAsync: deletePlan } = useDeletePosterPlan();

  //HANDLERS
  const handleDeletePlan = async (id: string) => {
    try {
      // const res = await deletePlan(id);
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
      // const res = await updatePlan({
      //   id: plan?._id,
      //   isActive: !plan?.isActive,
      // });
      // toast(res?.data?.message, {
      //   containerId: "default",
      //   className: "no-icon notification-success",
      // });
      setPlan(null);
    } catch (error) {
      toast(_.capitalize(errorMsg(error).toLowerCase()), {
        containerId: "default",
        className: "no-icon notification-danger",
      });
    }
  };

  const vendorPlans: VendorPlan[] = [
    {
      planName: "Executive",
      description: "Best fit for mid-level vendors to expand operations",
      price: 49,
      currency: "AED",
      frequency: "monthly",
      status: true,
      features: [
        "Lorem ipsum set amet elit sed dotempor enim.",
        "Lorem ipsum set amet elit.",
        "Lorem ipsum set amet elit sed.",
        "Lorem ipsum.",
        "Lorem ipsum set.",
      ],
    },
    {
      planName: "Corporate",
      description:
        "Designed for large-scale vendors with high-volume requirements",
      price: 99,
      currency: "AED",
      frequency: "monthly",
      status: true,
      features: [
        "Lorem ipsum set amet elit sed dotempor enim.",
        "Lorem ipsum set amet elit.",
        "Lorem ipsum set amet elit sed.",
        "Lorem ipsum.",
        "Lorem ipsum set.",
      ],
    },
  ];

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
                      {false && vendorPlans && vendorPlans.length === 0 && (
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
                        vendorPlans &&
                        vendorPlans?.length > 0 &&
                        vendorPlans?.map((item: VendorPlan, index: number) => (
                          <tr>
                            <td>
                              <Link
                                to={`/subscriptions/vendor-plans/detail?_id=${index}`}
                              >
                                <strong>{index + 1}</strong>
                              </Link>
                            </td>
                            <td>
                              <Link
                                to={`/subscriptions/vendor-plans/detail?_id=${index}`}
                              >
                                {_.capitalize(item?.planName.toLowerCase())}
                              </Link>
                            </td>
                            <td>{item?.price} AED</td>
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
                            <td>{capitalize(item?.frequency)}</td>
                            <td>
                              <div
                                onClick={() => {
                                  setPlan(item);
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
                        ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <ConfirmationPopup
        submit={() => handleDeletePlan(isDeleteOpen)}
        isOpen={isDeleteOpen !== null}
        toggle={() => setDeleteOpen(null)}
        text={"Are you sure that you want to delete this plan?"}
      />
      <ConfirmationPopup
        submit={() => handleChangeStatus()}
        isOpen={plan !== null}
        toggle={() => setPlan(null)}
        text={"Are you sure that you want to change the status of this plan?"}
      />
      <AddPlan isOpen={isAddOpen} toggle={() => setAddOpen(!isAddOpen)} />
      <EditPlan
        isOpen={isEditOpen !== null}
        toggle={() => setEditOpen(null)}
        id={isEditOpen}
      />
    </>
  );
};

export default VendorPlans;
