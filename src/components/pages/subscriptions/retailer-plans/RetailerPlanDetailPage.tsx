import React, { useState } from "react";
import { Col, Row, Tabs, Tab, Card } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "src/components/common/breadcrumb";
import PtSwitch from "src/components/features/elements/switch";
import { toast } from "react-toastify";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";
import EditAuctionPlan from "./Popups/EditAuctionPlan";
import RetailerPlanSubscriptions from "./RetailerPlanSubscriptions";

import _, { capitalize } from "lodash";
import { useGetPlanById } from "src/services/subscription.service";
import { SubscriptionPlan } from "src/types/types";
import EditPlan from "../vendor-plans/Popups/EditPlan";

const RetailerPlanDetailPage = () => {
  //IMPORTS
  const [searchParams] = useSearchParams();
  const planId: any = searchParams.get("_id");

  //STATE
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [isStatusOpen, setStatusOpen] = useState<boolean>(false);

  //  QUERIES
  const { data: plan } = useGetPlanById(planId, !!planId) as {
    data: any;
  };

  //MUTATION
  // const { mutateAsync: updateAuctionPlan } = useUpdateAuctionPlanById();

  //HANDLERS
  // const handleChangeStatus = async () => {
  //   try {
  //     const res = await updateAuctionPlan({
  //       id: auctionPlan?._id,
  //       isActive: !auctionPlan?.isActive,
  //     });
  //     toast(res?.data?.message, {
  //       containerId: "default",
  //       className: "no-icon notification-success",
  //     });
  //     setStatusOpen(false);
  //   } catch (error) {
  //     toast(_.capitalize(errorMsg(error).toLowerCase()), {
  //       containerId: "default",
  //       className: "no-icon notification-danger",
  //     });
  //   }
  // };

  return (
    <>
      <Breadcrumb
        current={
          plan ? `${_.capitalize(plan?.plan.toLowerCase())}  Plan` : "Plan"
        }
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "retailer plans",
            url: "/subscriptions/retailer-plans",
          },
         {
            name: `${plan?.plan} Plan Details`,
            url:`/subscriptions/retailer-plans/detail?_id=${planId}`
           
          }
        ]}
      />
      <div>
        <Row className="pt-0">
          <Col lg={3} className="py-3">
            <Card className={`card-modern`}>
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
                      Total Subscriptions
                    </h3>
                    <strong className="text-6 ">
                      {plan?.totalSubscriptions || 0}
                    </strong>
                  </Col>
                  <Col
                    sm={4}
                    className="text-center text-sm-right ml-auto  mt-4 mt-sm-0 d-flex justify-content-end"
                  >
                    <i className="bx bx-group icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} className="py-3">
            <Card className={`card-modern  `}>
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
                      Active Subscriptions
                    </h3>
                    <strong className="text-6 ">
                      {plan?.totalActiveSubscriptions || 0}
                    </strong>
                  </Col>

                  <Col
                    sm={4}
                    className="text-center text-sm-right ml-auto  mt-4 mt-sm-0 d-flex justify-content-end"
                  >
                    <i className="bx bx-hourglass icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} className="py-3">
            <Card className={`card-modern  `}>
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
                      Expired Subscriptions
                    </h3>
                    <strong className="text-6 ">
                      {plan?.totalExpiredSubscriptions || 0}
                    </strong>
                  </Col>

                  <Col
                    sm={4}
                    className="text-center text-sm-right ml-auto  mt-4 mt-sm-0 d-flex justify-content-end"
                  >
                    <i className="bx bx-hourglass icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} className="py-3">
            <Card className={`card-modern `}>
              <Card.Body className="py-4 box text-dark">
                <Row className="align-items-center justify-content-between">
                  <Col
                    // sm={4}
                    className="col-12"
                  >
                    <h3
                      className="text-4-1 my-0"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Total Revenue
                    </h3>
                    <strong className="text-6 ">
                      {plan?.totalRevenue || 0}AED
                    </strong>
                  </Col>
                  <Col
                    sm={4}
                    className="text-center text-sm-right ml-auto mt-4 mt-sm-0 d-flex justify-content-end"
                  >
                    <i className="bx bx-dollar icon icon-inline icon-md bg-primary rounded-circle text-color-light p-0"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={12} className="py-3">
            <Card className="card-modern">
              <Card.Header className="d-flex align-items-center justify-content-between">
                <Card.Title>Plan Details</Card.Title>
                <div
                  className="action_btn "
                  onClick={() => {
                    setEditOpen(true);
                  }}
                >
                  <i className="fas fa-pencil-alt"></i>
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col>
                    <div>
                      <h6>Name</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {_.capitalize(plan?.plan.toLowerCase())}
                      </h5>
                    </div>
                    <div>
                      <h6>Price</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {plan?.price_monthly || 0} AED
                      </h5>
                    </div>
                    <div>
                      <h6>Yearly Off</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {plan?.yearly_off || 0} %
                      </h5>
                    </div>
                    <div>
                      <h6>Trial Period</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {plan?.trial_period || 0} days
                      </h5>
                    </div>
                    <div>
                      <h6>Description</h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {plan?.description}
                      </h5>
                    </div>
                  </Col>
                  <Col>
                    <div>
                      <h6 className="mb-0">Status</h6>
                      <div
                        className="d-flex align-items-center"
                        onClick={() => {
                          setStatusOpen(true);
                        }}
                      >
                        <PtSwitch
                          className="mr-2"
                          on={!plan?.isSuspend}
                          size="sm"
                          variant="success"
                        />
                        <h5 className=" text-dark font-weight-500 ">
                          {!plan?.isSuspend ? "Active" : "Inactive"}
                        </h5>
                      </div>
                    </div>
                    <div>
                      <h6>Features</h6>
                      <div className=" list-unstyled">
                        {plan?.features &&
                          plan?.features?.length > 0 &&
                          plan?.features?.map((feature: string) => (
                            <li className="d-flex align-items-center m-0 p-0">
                              <i className="bx bx-check bg-gray p-1 rounded-circle mr-2"></i>
                              <h5 className="my-1 text-dark font-weight-500 ">
                                {feature}
                              </h5>
                            </li>
                          ))}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={12} className="py-3">
            <Card className="card-modern">
              <Card.Body>
                <RetailerPlanSubscriptions planId={planId} header={true} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <ConfirmationPopup
        // submit={() => handleChangeStatus()}
        submit={() =>
          toast("Status change ", {
            containerId: "default",
            className: "no-icon notification-success",
          })
        }
        isOpen={isStatusOpen}
        toggle={() => setStatusOpen(!isStatusOpen)}
        text={
          "Are you sure that you want to change the status of this retailer plan ?"
        }
      />
      <EditPlan
        isOpen={isEditOpen}
        toggle={() => setEditOpen(!isEditOpen)}
        plan={plan ? plan : null}
      />
    </>
  );
};

export default RetailerPlanDetailPage;
