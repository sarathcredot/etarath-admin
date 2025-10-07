import React, { useEffect, useMemo, useState } from "react";
import Breadcrumb from "src/components/common/breadcrumb";
import { Card, Col, Row, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import AttributesList from "./AttributesList";
import Loader from "src/components/features/loader";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "src/components/common/Pagination";
import { capitalCase } from "capital-case";

const AttributesPage = () => {
  const navigate = useNavigate();
  //STATE
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  //USE MEMO
  const queryObj = useMemo(() => {
    const obj: any = {
      skip: true,
    };

    if (page) {
      obj.page = page;
    }

    if (limit) {
      obj.limit = limit;
    }

    if (search) {
      obj.search = search;
    }

    return obj;
  }, [page, limit, search]);

  //QUERY
  // const {
  //   data: tournaments,
  //   isLoading: isTournamentsLoading,
  //   error,
  // }: any = useGetAllTournaments(queryObj);

  // useEffect(() => {
  //   if(tournaments && tournaments?.pagination && tournaments?.pagination?.totalPages) {
  //     setPage(tournaments?.pagination?.page || 1);
  //     setLimit(tournaments?.pagination?.limit || 10);
  //   }
  // },[tournaments])

  // useEffect(() => {
  //   if (error) {
  //     toast(error?.response?.data?.message, {
  //       containerId: "default",
  //       className: "no-icon notification-danger",
  //     });
  //   }
  // }, [error]);

  const attributes = ["origin", "year_of_manufacture"];

  return (
    <>
      <Breadcrumb
        current={"Attributes"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "attributes",
            url: "/attributes",
          },
        ]}
      />
      <Card>
        <Card.Body className="bg-white">
          <div className="">
            <Row>
              <Col>
                {/* <Card className="card-modern"> */}
                {/* <Card.Body> */}
                <div className="datatables-header-footer-wrapper">
                  <div className="datatable-header">
                    <Row className="align-items-lg-center justify-content-end mb-3"></Row>
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

                        <th>Attribute</th>
                        <th className="text-center" style={{ width: "80px" }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {false ? (
                        <tr>
                          <td colSpan={9}>
                            <Loader />
                          </td>
                        </tr>
                      ) : attributes?.length > 0 ? (
                        attributes?.map((item: string, index: number) => (
                          <tr key={index}>
                            <td>
                              <Link to={`/attributes/${item}`}>
                                <strong>
                                  {/* {index +
                                            (attributesData?.pagination?.page - 1) *
                                              attributesData?.pagination?.limit +
                                            1} */}
                                  {index + 1}
                                </strong>
                              </Link>
                            </td>
                            <td>
                              <Link to={`/attributes/${item}`}>
                                {capitalCase(item)}
                              </Link>
                            </td>

                            <td>
                              <div className="d-flex align-items-center justify-content-around">
                                <div
                                  className="action_btn"
                                  onClick={() => {
                                    navigate(
                                      `/attributes/${item}`
                                    );
                                  }}
                                >
                                  <i className="far fa-eye"></i>
                                </div>
                                
                              </div>
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
                  totalPages={1}
                  style={{ marginTop: "20px" }}
                />
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default AttributesPage;
