import React, { Dispatch, useCallback, useMemo, useState } from "react";
import { Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "src/components/common/Pagination";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";
import { toast } from "react-toastify";
import Loader from "src/components/features/loader";
import { debounce } from "lodash";
import { useUpdateVendorStatus } from "src/services/vendor.service";
import { useDeleteKyc } from "src/services/kyc.service";

type Props = {
  header?: boolean;
  vendors: any;
  isLoading: boolean;
  setPage: Dispatch<React.SetStateAction<number>>;
  setLimit: Dispatch<React.SetStateAction<number>>;
  setSearch: Dispatch<React.SetStateAction<string>>;
  page: number;
  limit: number;
  search: string;
};

const KycsList = ({
  header = false,
  vendors,
  isLoading,
  setPage = () => {},
  setLimit,
  setSearch = () => {}, // fallback so debounce doesn’t break
  page = 1,
  limit = 10,
  search = "",
}: Props) => {
  const navigate = useNavigate();
  //STATE
  // states for popups
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedKyc, setSelectedKyc] = useState<any>(null);
  console.log(selectedKyc, "selectedKyc");
  //MUTATIONS
  const { mutateAsync: deleteKyc } = useDeleteKyc();

  //HANDLERS
  const handleDeleteKyc = async (userId: string) => {
    try {
      if (!userId) throw new Error("User ID is required!");
      const resp = await deleteKyc(userId);
      toast(resp?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });
    } catch (error) {
      console.log(error);
      toast("Can't delete kyc right now, please try later!", {
        containerId: "default",
        className: "no-icon notification-danger",
      });
    }
    setSelectedKyc(null);
    setDeleteOpen(false);
  };

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

  const totalRecords = vendors?.length || 0;
  const totalPages = Math.ceil(totalRecords / limit);
  return (
    <>
      <div>
        <Row>
          <Col>
            <div className="datatables-header-footer-wrapper">
              <div className="datatable-header">
                <Row className="align-items-lg-center justify-content-end mb-3">
                  <Col className="col-auto pl-lg-1">
                    <div className="search search-style-1 mx-lg-auto w-auto">
                      <InputGroup>
                        <Form.Control
                          type="text"
                          className="search-term"
                          placeholder="Search "
                          style={{ width: "250px" }}
                          onChange={(e: any) =>
                            debouncedHandleSearch(e.target.value)
                          }
                          // value={search}
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
                    {/* <th style={{ width: "80px" }}>Profile</th> */}

                    <th>User</th>
                    <th>Role</th>
                    <th>Shop Name</th>
                    <th>Trade License Number</th>
                    <th>Shop Address</th>
                    <th>Verification</th>
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
                  {!isLoading && vendors && vendors.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        style={{ textAlign: "center", height: "100px" }}
                      >
                        No vendors found.
                      </td>
                    </tr>
                  )}
                  {!isLoading &&
                    vendors &&
                    vendors?.length > 0 &&
                    vendors?.map((item: any, index: any) => (
                      <tr>
                        <td>
                          <Link to={`/vendors/detail?_id=${item?._id}`}>
                            <strong>
                              {/* {search
                                ? index + 1
                                : index +
                                  (organisersData?.page - 1) *
                                    organisersData?.limit +
                                  1} */}
                              {index + 1}
                            </strong>
                          </Link>
                        </td>
                        {/* <td>
                          <Link
                            to={`/vendors/detail?_id=${item?._id}`}
                            style={{ width: "50px", height: "50px" }}
                            className="d-flex align-items-center justify-content-center"
                          >
                            <img
                              className="mr-1"
                              // src={generateFilePath(item?.images[0])}
                              src={generateFilePath(item?.imgUrl)}
                              alt="profile"
                              width="50"
                              height="50"
                              // crossOrigin="anonymous"
                            />
                          </Link>
                        </td> */}
                        <td>
                          <Link to={`/vendors/detail?_id=${item?.createdBy}`}>
                            {item?.userDetails?.userName || "-"}
                          </Link>
                        </td>
                        <td>{item?.userDetails?.role || "-"}</td>
                        <td>{item?.shop_name || "-"}</td>
                        <td>{item?.tradeLicenseNumber}</td>
                        <td>{item?.shop_address}</td>
                        <td>
                          <div
                            className={`ecommerce-status ${item?.kycStatus}`}
                          >
                            {item?.kycStatus}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center justify-content-around">
                            <div
                              className="action_btn"
                              onClick={() => {
                                navigate(
                                  `/vendors/detail?_id=${item?.createdBy}`
                                );
                              }}
                            >
                              <i className="far fa-eye"></i>
                            </div>
                            <div
                              className="action_btn"
                              onClick={() => {
                                setDeleteOpen(true);
                                setSelectedKyc(item);
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
            {totalPages > 1 && !search && (
              <Pagination
                currentPage={page}
                setCurrentPage={setPage}
                totalButtonsToShow={3}
                totalPages={totalPages}
                style={{ marginTop: "20px" }}
              />
            )}
          </Col>
        </Row>
      </div>
      <ConfirmationPopup
        submit={() => handleDeleteKyc(selectedKyc?.createdBy)}
        isOpen={isDeleteOpen}
        toggle={() => setDeleteOpen(!isDeleteOpen)}
        text={"Are you sure that you want to delete  this kyc?"}
      />
    </>
  );
};

export default KycsList;
