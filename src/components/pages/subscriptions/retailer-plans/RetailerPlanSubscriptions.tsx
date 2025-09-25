import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Pagination from "src/components/common/Pagination";
import PtSwitch from "src/components/features/elements/switch";
import { User } from "src/types/user.types";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";
import { toast } from "react-toastify";
import { ORDER_TYPES } from "src/common/constant.common";

import { errorMsg } from "src/utils/toast";
import _ from "lodash";
import Loader from "src/components/features/loader";
import { format } from "date-fns";

const RetailerPlanSubscriptions = ({ header = false, planId }: any) => {
  // STATES
  const [order, setOrder] = useState<any>(null);

  //pagination
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 5;

  //DATA
  // const { data, isLoading } = useGetAllOrders(
  //   { planId: planId, type: ORDER_TYPES.AUCTION_PLAN },
  //   !!planId
  // );
  const subscriptions = [];

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
                          placeholder="Search by Name"
                          style={{ width: "250px" }}
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

                    <th>Retailer</th>
                    <th>Phone Number</th>
                    <th>Purchase Date</th>
                    <th>Validity</th>
                    <th>Status</th>
                    {/* <th
                      className="text-center"
                      style={{ width: "80px" }}
                    >
                      Actions
                    </th> */}
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
                    (!subscriptions || subscriptions?.length === 0) && (
                      <tr>
                        <td
                          colSpan={9}
                          style={{ textAlign: "center", height: "100px" }}
                        >
                          No subscriptions found.
                        </td>
                      </tr>
                    )}
                  {false &&
                    subscriptions &&
                    subscriptions?.length > 0 &&
                    subscriptions?.map((item: any, index: number) => (
                      <tr>
                        <td>
                          <Link to={`/organizers/detail?_id=${item?.user?._id}`}>
                            <strong>{index + 1}</strong>
                          </Link>
                        </td>
                        <td>
                          <Link to={`/organizers/detail?_id=${item?.user?._id}`}>
                            {item?.user?.fullName}
                          </Link>
                        </td>
                        <td>{`${item?.user?.phoneNumber}`}</td>
                        <td>
                          {item?.createdAt
                            ? format(new Date(item?.createdAt), "dd/MM/yyyy")
                            : ""}
                        </td>
                        <td>
                          <span
                            className={`ecommerce-status ${
                              item?.isUsed ? "on-hold" : "completed"
                            }`}
                          >
                            {item?.isUsed ? "Used" : "Not-used"}
                          </span>
                        </td>
                        <td>
                          <div
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
                              {item?.isSuspended ? "Suspended": "Active" }
                            </h5>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
            {20 > limit && (
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalButtonsToShow={3}
                totalPages={20}
                style={{ marginTop: "20px" }}
              />
            )}
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
