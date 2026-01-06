import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "src/components/common/Pagination";
import PtSwitch from "src/components/features/elements/switch";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";
import { toast } from "react-toastify";

import { errorMsg } from "src/utils/toast";
import _ from "lodash";
import Loader from "src/components/features/loader";
import { format } from "date-fns";
import { useGetAllPlanOrdersById } from "src/services/subscription-orders";

const RetailerPlanSubscriptions = ({ header = false, planId }: any) => {
  // STATES
  const [order, setOrder] = useState<any>(null);
  const navigate = useNavigate()

  //pagination
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 5;

  //DATA
  // const { data, isLoading } = useGetAllOrders(
  //   { planId: planId, type: ORDER_TYPES.AUCTION_PLAN },
  //   !!planId
  // );
  // const subscriptions = [];

  const [orderPage, setOrderPage] = useState<number>(1);
  const [orderLimit, setOrderLimit] = useState<number>(10);
  const [orderSearch, setOrderSearch] = useState<string>("");


  const orderQueryObj = useMemo(() => {

    const obj: any = {};

    if (orderPage) {
      obj.page = orderPage;
    }

    if (orderLimit) {
      obj.limit = orderLimit;
    }

    if (orderSearch) {
      obj.search = orderSearch;
    }

    if (planId) {
      obj.planId = planId;
    }

    return obj;
  }, [orderPage, orderLimit, orderSearch, planId]);


  //DATA
  // const { data, isLoading } = useGetAllOrders(
  //   { planId, type: ORDER_TYPES.POSTER_PLAN },
  //   !!planId
  // );
  // const subscriptions = [];

  const { data: subscriptions, isLoading: subLoading } = useGetAllPlanOrdersById(planId, !!planId, orderQueryObj);

  console.log("sub", subscriptions)

  const totalPages = subscriptions?.totalPages || 0;

  //MUTATION
  // const { mutateAsync: suspendSubscription } = useSuspendOrderById();

  //HANDLERS
  const handleChangeStatus = async () => {
    try {
      // const res = await suspendSubscription({
      //   id: order?._id,
      //   isSuspended: !order?.isSuspended,
      // });
      // toast(res?.data?.message, {
      //   containerId: "default",
      //   className: "no-icon notification-success",
      // });
      setOrder(null);
    } catch (error) {
      toast(_.capitalize(errorMsg(error).toLowerCase()), {
        containerId: "default",
        className: "no-icon notification-danger",
      });
    }
  };

  return (
    <>
      <div>
        <Row>
          <Col>
            <div className="datatables-header-footer-wrapper">
              <div className="datatable-header">
                <Row className="align-items-lg-center justify-content-end mb-3">
                  {header && (
                    <Col>
                      <h5 className="m-0 card-title h5 font-weight-bold">
                        Subscriptions
                      </h5>
                    </Col>
                  )}

                  <Col className="col-auto pl-lg-1">
                    <div className="search search-style-1 mx-lg-auto w-auto">
                      <InputGroup>
                        <Form.Control
                          type="text"
                          className="search-term"
                          placeholder="Search by Sub Id"
                          style={{ width: "250px" }}
                          onChange={(e) =>
                            setOrderSearch && setOrderSearch(e.target.value)
                          }
                        />
                      </InputGroup>
                    </div>
                  </Col>
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
                    <th> Subscriptions Id </th>
                    <th>Vendor</th>
                    <th>Phone Number</th>
                    <th>Purchase Date</th>
                    <th>Validity</th>
                    <th> Actions</th>
                    {/* <th
                      className="text-center"
                      style={{ width: "80px" }}
                    >
                      Actions
                    </th> */}
                  </tr>
                </thead>
                <tbody style={{ borderBottom: "1px solid #dee2e6" }}>
                  {subLoading && (
                    <tr>
                      <td colSpan={9}>
                        <Loader />
                      </td>
                    </tr>
                  )}
                  {subscriptions?.result?.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        style={{ textAlign: "center", height: "100px" }}
                      >
                        No subscriptions found.
                      </td>
                    </tr>
                  )}
                  {
                    subscriptions &&
                    subscriptions?.result?.length > 0 &&
                    subscriptions?.result?.map((item: any, index: number) => (
                      <tr>
                        <td>
                          <Link to={`/organizers/detail?_id=${item?.user?._id}`}>
                            {/* <strong> */}
                            {/* {index + 1} */}
                                {(subscriptions?.currentPage - 1) * limit + index + 1}
                            {/* </strong> */}
                          </Link>
                        </td>
                        <td>
                          <Link to={`/subscriptions/retailer/order/detail?planId=${planId}&_id=${item?._id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            <strong>
                              {item?.subId}
                            </strong>
                          </Link>
                        </td>
                        <td>
                          {/* <Link to={`/organizers/detail?_id=${item?.user?._id}`}> */}
                          {item?.userDetails?.name}
                          {/* </Link> */}
                        </td>
                        <td>
                          {item?.userDetails?.phoneNumber}
                        </td>
                        <td>
                          {item?.purchased_Date
                            ? format(new Date(item?.purchased_Date), "dd/MM/yyyy")
                            : ""
                          }
                        </td>
                        <td>
                          {item?.plan_end_date
                            ? format(new Date(item?.plan_end_date), "dd/MM/yyyy")
                            : ""
                          }
                        </td>
                        <td>
                          {/* <div
                                            className="d-flex align-items-center"
                                            onClick={() => {
                                              setOrder(item);
                                            }}
                                          >
                                            <PtSwitch
                                              className="mr-1"
                                              on={!item?.isSuspended}
                                              size="sm"
                                              variant="success"
                                            />
                                            <h5 className=" text-dark font-weight-500 ">
                                              {item?.isSuspended ? "Suspended" : "Active"}
                                            </h5>
                                          </div> */}

                          <div
                            className="action_btn"
                            onClick={() => {
                              navigate(`/subscriptions/retailer/order/detail?planId=${planId}&_id=${item?._id}`)
                            }}
                          >
                            <i className="far fa-eye mr-2"></i>
                          </div>

                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>

            <Pagination
              currentPage={orderPage}
              setCurrentPage={setOrderPage}
              totalButtonsToShow={3}
              totalPages={totalPages}
              style={{ marginTop: "20px" }}
            />
          </Col>
        </Row>
      </div>
      <ConfirmationPopup
        submit={() => handleChangeStatus()}
        isOpen={order !== null}
        toggle={() => setOrder(null)}
        text={"Are you sure that you want to suspend this Subscription ?"}
      />
    </>
  );
};

export default RetailerPlanSubscriptions;
