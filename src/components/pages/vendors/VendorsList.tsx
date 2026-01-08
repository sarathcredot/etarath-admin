import React, { Dispatch, useCallback, useMemo, useState } from "react";
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
import Loader from "src/components/features/loader";
import { debounce, result } from "lodash";
import AddVendor from "./popups/AddVendor";
import AddBussinessDetails from "./popups/AddBussinessDetails";
import { generateFilePath } from "src/services/url.service";
import EditVendor from "./popups/EditVendor";
import { useUpdateVendorStatus, useDeleteVendor } from "src/services/vendor.service";

type Props = {
  header?: boolean;
  vendors: any;
  data: any
  isLoading: boolean;
  setPage: Dispatch<React.SetStateAction<number>>;
  setLimit: Dispatch<React.SetStateAction<number>>;
  setSearch: Dispatch<React.SetStateAction<string>>;
  setStatusU: Dispatch<React.SetStateAction<string>>;
  setIsSupend: Dispatch<React.SetStateAction<string>>;
  page: number;
  limit: number;
  search: string;
};

const VendorsList = ({
  header = false,
  vendors,
  data,
  isLoading,
  setPage = () => { },
  setLimit,
  setSearch = () => { }, // fallback so debounce doesn’t break
  setStatusU = () => { }, // fallback so debounce doesn’t break
  setIsSupend = () => { }, // fallback so debounce doesn’t break
  page = 1,
  limit = 10,
  search = "",
}: Props) => {
  const navigate = useNavigate();
  //STATE
  // states for popups
  const [isAddOpen, setAddOpen] = useState<boolean>(false);
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [isStatusOpen, setStatusOpen] = useState<boolean>(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  console.log(selectedVendor, "selectedVendor");
  //MUTATIONS
  const { mutateAsync: updateVendorStatus } = useUpdateVendorStatus();
  const { mutateAsync: deleteVendor } = useDeleteVendor();


  //HANDLERS
  const handleChangeStatus = async (vendorId: string, isActive: boolean) => {
    try {
      if (!vendorId) throw new Error("Vendor ID is required!");
      if (typeof isActive !== "boolean")
        throw new Error("Unexpected Active status!");

      const resp = await updateVendorStatus({
        id: vendorId,
        isActive: !isActive,
      });

      setSelectedVendor(null);
      setStatusOpen(false);
      toast(resp?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });
    } catch (error) {
      toast("Can't update Vendor right now, please try later!", {
        containerId: "default",
        className: "no-icon notification-danger",
      });
      setStatusOpen(false);
    }
  };

  const handleChangeDelete = async (vendorId: string) => {
    try {
      if (!vendorId) throw new Error("Vendor ID is required!");

      const resp = await deleteVendor({
        id: vendorId,

      });

      setSelectedVendor(null);
      setDeleteOpen(false);
      toast("Vendor deleted successfully", {
        containerId: "default",
        className: "no-icon notification-success",
      });
    } catch (error) {
      toast("Can't delete Vendor right now, please try later!", {
        containerId: "default",
        className: "no-icon notification-danger",
      });
      setDeleteOpen(false);
    }
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

  const debouncedHandleFillterStatus = useCallback(
    debounce((text) => {
      try {
        console.log("text",text)
        setStatusU(text);
      } catch (error) {
        console.log(error, "error in the debounce function");
      }
    }, 1000),
    []
  );

  const debouncedHandleSearchFillterisSupaend = useCallback(
    debounce((text) => {
      try {
        setIsSupend(text);
      } catch (error) {
        console.log(error, "error in the debounce function");
      }
    }, 1000),
    []
  );




  // const totalRecords = vendors?.length || 0;
  // const totalPages = Math.ceil(totalRecords / limit);

  const totalRecords = data?.total || 0;
  const totalPages = data?.totalPages || 0;



  return (
    <>
      <div>
        <Row>
          <Col>
            <div className="datatables-header-footer-wrapper">
              <div className="datatable-header">
                <Row className="align-items-lg-center justify-content-between mb-3">
                  {header && (
                    <Col>
                      <h5 className="m-0 card-title h5 font-weight-bold">
                        Vendors
                      </h5>
                    </Col>
                  )}

                  <Col className="col-auto pl-lg-2">
                    <div className="search search-style-1 mx-lg-auto w-auto">
                      <InputGroup>
                        <Form.Control
                          type="text"
                          className="search-term"
                          placeholder="Search Vendor"
                          style={{ width: "250px" }}
                          onChange={(e: any) =>
                            debouncedHandleSearch(e.target.value)
                          }
                        // value={search}
                        />
                      </InputGroup>
                    </div>
                  </Col>
                  <Col xl="auto" className="">
                    <Button
                      className="font-weight-semibold px-3"
                      variant="dark"
                      // style={{ background: "#000" }}
                      // onClick={() => navigate("/vendors/add-vendor")}
                      onClick={() => {
                        // setAddOpen(true);
                        navigate("/vendors/add-vendor");
                      }}
                    >
                      + Add Vendor
                    </Button>
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
                    <th style={{ width: "80px" }}>Vendor</th>
                    <th></th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span>Verification</span>

                        <Form.Control
                          as="select"
                          size="sm"
                          style={{
                            width: "110px",
                            color: "#000",
                          }}
                          name="verification"
                           onChange={(e: any) =>
                            debouncedHandleFillterStatus(e.target.value)
                          }
                        >
                          <option value="all">All</option>
                          <option value="approved">Approved</option>
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                        </Form.Control>
                      </div>
                    </th>

                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span>Status</span>

                        <Form.Control
                          as="select"
                          size="sm"
                          style={{
                            width: "110px",
                            color: "#000",
                          }}
                          name="issuspend"
                          onChange={(e: any) =>
                            debouncedHandleSearchFillterisSupaend(e.target.value)
                          }
                        >
                          <option value="all">All</option>
                          <option value="active">Active</option>
                          <option value="blocked">Blocked</option>
                        </Form.Control>
                      </div>
                    </th>

                    <th className="text-center" style={{ width: "80px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody style={{ borderBottom: "1px solid #dee2e6", cursor: "pointer" }}>
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
                      <tr
                        key={index}
                        onClick={() =>
                          navigate(`/vendors/detail?_id=${item?._id}`)
                        }
                      >
                        <td>
                          {/* <Link to={`/vendors/detail?_id=${item?._id}`}>
                            <strong>
                               {search
                                ? index + 1
                                : index +
                                  (data?.page - 1) *
                                    limit +
                                  1}
                            
                            </strong>
                          </Link> */}
                          <td>
                            {/* {index + 1} */}
                            {/* {(vendors?.currentPage - 1) * itemsPerPage + index + 1} */}


                            {(data?.currentPage - 1) * limit + index + 1}



                          </td>

                        </td>
                        <td>
                          <Link
                            to={`/vendors/detail?_id=${item?._id}`}
                            style={{ width: "50px", height: "50px" }}
                            className="d-flex align-items-center justify-content-center"
                          >
                            <img
                              className="mr-1"
                              src={generateFilePath(
                                item?.kycDetails?.vendor_logo
                              )}
                              alt="profile"
                              width="50"
                              height="50"
                              style={{ objectFit: "cover" }}
                            // crossOrigin="anonymous"
                            />
                          </Link>
                        </td>
                        <td>
                          <strong>
                            {item?.kycDetails?.business_name || item?.userName}
                          </strong>

                        </td>
                        <td>
                          {item?.kycDetails?.phoneNumber || item?.phoneNumber}
                        </td>
                        <td>{item?.kycDetails?.email || item?.email}</td>
                        <td>
                          <div
                            className={`ecommerce-status ${item?.isVerified}`}
                            style={{ textTransform: "capitalize" }}
                          >
                            {item?.isVerified}
                          </div>
                        </td>

                        <td onClick={(e) => e.stopPropagation()}>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setStatusOpen(true);
                              setSelectedVendor(item);
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
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="d-flex align-items-center justify-content-around">
                            <div
                              className="action_btn "
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/vendors/edit-vendor?_id=${item?._id}`
                                );
                                // setSelectedVendor(item);
                                // setEditOpen(true);
                              }}
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </div>
                            <div
                              className="action_btn "
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/vendors/detail?_id=${item?._id}`);
                              }}
                            >
                              <i className="far fa-eye"></i>
                            </div>
                            <div
                              className="action_btn"
                              onClick={() => {
                                setDeleteOpen(true);
                                setSelectedVendor(item);
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
            {(
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
        submit={() =>
          handleChangeStatus(selectedVendor?._id, selectedVendor?.isSuspend)
        }
        isOpen={isStatusOpen}
        toggle={() => setStatusOpen(!isStatusOpen)}
        text={"Are you sure that you want to change the status of this vendor?"}
      />

      <ConfirmationPopup
        submit={() =>
          handleChangeDelete(selectedVendor?._id)
        }
        isOpen={isDeleteOpen}
        toggle={() => setDeleteOpen(!isDeleteOpen)}
        text={"Are you sure that you want to delete of this vendor?"}
      />



      <AddVendor isOpen={isAddOpen} toggle={() => setAddOpen(!isAddOpen)} />
      <EditVendor
        vendorId={selectedVendor?._id}
        isOpen={isEditOpen}
        toggle={() => setEditOpen(!isEditOpen)}
      />
    </>
  );
};

export default VendorsList;
