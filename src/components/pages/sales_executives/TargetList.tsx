import _, { capitalize, debounce } from "lodash";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Loader from "src/components/features/loader";
import { generateFilePath } from "src/services/url.service";
import dayjs from "dayjs";
import Pagination from "src/components/common/Pagination";
import { formatDate } from "../../../../src/utils/formats"
import ProgressBar from "src/components/common/ProgressBar";

const TargetList = ({
  target,
  targetLoading = false,
  setPage = () => { },
  setSearch = () => { }, // fallback so debounce doesn’t break
  setLimit,
  page = 1,
  limit = 10,
  search = "",
}: {
  vendorId: any;
  target: any;
  targetLoading: boolean;
  setPage?: Dispatch<React.SetStateAction<number>>;
  setLimit?: Dispatch<React.SetStateAction<number>>;
  setSearch?: Dispatch<React.SetStateAction<any>>;
  page?: number;
  limit?: number;
  search?: string;

}) => {
  const navigate = useNavigate();

  //STATES
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [isEditOpen, setEditOpen] = useState<boolean>(false);

  const totalRecords = target?.total || 0;
  const totalPages = target?.totalPages || 0;

  const debouncedHandleSearch = useCallback(
    debounce((text) => {
      try {
        setSearch(text);
      } catch (error) {
        console.log(error, "error in the debounce function");
      }
    }, 1000),
    []
  );

  return (
    <>
      <div className="">
        <Row>
          <Col>
            {/* <Card className="card-modern"> */}
            {/* <Card.Body> */}
            <div className="datatables-header-footer-wrapper">
              <div className="datatable-header">
                <Row className="align-items-lg-center justify-content-end mb-3">
                  <Col>
                    <h5 className="m-0 card-title h5 font-weight-bold">
                      Targets
                    </h5>
                  </Col>

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
                  <Col className="col-auto pl-lg-1">
                    <div className="search search-style-1 mx-lg-auto w-auto">
                      {/* <InputGroup>
                        <Form.Control
                          type="text"
                          className="search-term"
                          placeholder="Search Claim"
                          style={{ width: "250px" }}
                          value={search}
                          onChange={(e) =>
                            debouncedHandleSearch(e.target.value)
                          }
                        />
                      </InputGroup> */}
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
                    <th
                      // className="text-center"
                      style={{ width: "80px" }}
                    >
                      Date
                    </th>
                    <th> </th>

                    <th>Target</th>
                    {/* <th>Quantity</th> */}
                    <th>Total Orders</th>
                    <th>Completed Orders</th>
                    <th>Pending Orders</th>
                    <th>Perfomance Bar</th>
                    <th>Status</th>
                    {/* <th className="text-center" style={{ width: "80px" }}>
                        Actions
                      </th> */}
                  </tr>
                </thead>
                <tbody>
                  {targetLoading ? (
                    <tr>
                      <td colSpan={9}>
                        <Loader />
                      </td>
                    </tr>
                  ) : !targetLoading && target && target?.result?.length > 0 ? (
                    target?.result?.map((item: any, index: number) => (
                      <tr

                        key={index}
                        style={{ cursor: "pointer" }}
                      >
                        <td>

                          {/* <strong style={{ whiteSpace: "nowrap" }}> */}
                          {index + 1}
                          {/* </strong> */}
                        </td>
                        <td>
                          <strong>
                            {formatDate(item?.startDate)}
                          </strong>
                        </td>
                        <td></td>

                        <td>

                          {item?.target}

                        </td>
                        {/* <td>{item?.quantity || 0} </td> */}

                        <td>{item?.orderResult?.total}</td>

                        <td>
                          {item?.orderResult?.completed}
                        </td>
                        <td>
                          {item?.orderResult?.pending}
                        </td>
                        <td>
                          {/* <strong>
                            {item?.performance}
                          </strong> */}

                          <ProgressBar

                            progress={item?.progress}
                            width={100}
                            height={20}
                          />
                        </td>

                        <td>
                          {item?.performance}
                        </td>


                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        style={{ textAlign: "center", height: "100px" }}
                      >
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            <Pagination
              currentPage={page}
              setCurrentPage={setPage}
              totalButtonsToShow={3}
              totalPages={totalPages}
              style={{ marginTop: "20px" }}
            />
            {/* </Card.Body>
            </Card> */}
          </Col>
        </Row>
      </div>
      {/* <ConfirmationPopup
        submit={() => handleDeleteStock()}
        isOpen={isDeleteOpen}
        toggle={() => setDeleteOpen(!isDeleteOpen)}
        text={"Are you sure that you want to delete this stock?"}
      /> */}
    </>
  );
};

export default TargetList;
