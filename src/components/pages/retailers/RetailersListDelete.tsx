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
import { debounce } from "lodash";
import AddRetailer from "./popups/AddRetailer";
import { generateFilePath } from "src/services/url.service";
import EditRetailer from "./popups/EditRetailer";
import { useUpdateRetailerStatus, useDeleteRetailer } from "src/services/retailer.service";
import { useExportUserDataCSV } from "src/services/bulk.service";
import { truncate } from "src/utils/formats";

type Props = {
  header?: boolean;
  retailers: any;
  isLoading: boolean;
  setPage: Dispatch<React.SetStateAction<number>>;
  setLimit: Dispatch<React.SetStateAction<number>>;
  setSearch: Dispatch<React.SetStateAction<string>>;
  setStatusU: Dispatch<React.SetStateAction<string>>;
  setIsSupend: Dispatch<React.SetStateAction<string>>;
  page: number;
  limit: number;
  search: string;
  data: any
};

const RetailersList = ({
  header = false,
  retailers,
  isLoading,
  setPage = () => { },
  setLimit,
  setSearch = () => { }, // fallback so debounce doesn’t break
  setStatusU = () => { }, // fallback so debounce doesn’t break
  setIsSupend = () => { }, // fallback so debounce doesn’t break
  page = 1,
  limit = 10,
  search = "",
  data
}: Props) => {
  const navigate = useNavigate();
  //STATE
  // states for popups
  const [isAddOpen, setAddOpen] = useState<boolean>(false);
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [isStatusOpen, setStatusOpen] = useState<boolean>(false);
  const [selectedRetailer, setSelectedRetailer] = useState<any>(null);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  console.log(selectedRetailer, "selectedRetailer");
  //MUTATIONS
  const { mutateAsync: updateRetailerStatus } = useUpdateRetailerStatus();
  const { mutateAsync: deleteRetailer } = useDeleteRetailer()

  const exportMutation: any = useExportUserDataCSV();

  //HANDLERS
  const handleChangeStatus = async (retailerId: string, isActive: boolean) => {
    try {
      if (!retailerId) throw new Error("Retailer ID is required!");
      if (typeof isActive !== "boolean")
        throw new Error("Unexpected Active status!");

      const resp = await updateRetailerStatus({
        id: retailerId,
        isActive: !isActive,
      });

      setSelectedRetailer(null);
      setStatusOpen(false);
      toast(resp?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });
    } catch (error) {
      toast("Can't update Retailer right now, please try later!", {
        containerId: "default",
        className: "no-icon notification-danger",
      });
      setStatusOpen(false);
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
        console.log("text", text)
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


  const handleChangeDelete = async (vendorId: string) => {
    try {
      if (!vendorId) throw new Error("Vendor ID is required!");

      const resp = await deleteRetailer({
        id: vendorId,

      });

      setSelectedRetailer(null);
      setDeleteOpen(false);
      toast("Retailer deleted successfully", {
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
                        Retailers
                      </h5>
                    </Col>
                  )}

                  <Col className="col-auto pl-lg-2">
                    <div className="search search-style-1 mx-lg-auto w-auto">
                      <InputGroup>
                        <Form.Control
                          type="text"
                          className="search-term"
                          placeholder="Search Retailer"
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
                    <th style={{ width: "80px" }}>Retailer</th>
                    <th></th>
                    <th>Phone Number</th>
                    <th>Email</th>




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
                  {!isLoading && retailers && retailers.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        style={{ textAlign: "center", height: "100px" }}
                      >
                        No retailers found.
                      </td>
                    </tr>
                  )}
                  {!isLoading &&
                    retailers &&
                    retailers?.length > 0 &&
                    retailers?.map((item: any, index: any) => (
                      <tr
                        onClick={() =>
                          navigate(`/retailers/detail?_id=${item?._id}`)
                        }
                      >
                        <td>
                          {/* <Link to={`/retailers/detail?_id=${item?._id}`}> */}
                          {/* <strong> */}
                          {(data?.currentPage - 1) * limit + index + 1}
                          {/* {index + 1} */}
                          {/* </strong> */}
                          {/* </Link> */}
                        </td>
                        <td>
                          <Link
                            to={`/retailers/detail?_id=${item?._id}`}
                            style={{ width: "50px", height: "50px" }}
                            className="d-flex align-items-center justify-content-center"
                          >
                            {item?.imgUrl ? (
                              <img
                                src={generateFilePath(item.imgUrl)}
                                alt="profile"
                                width="50"
                                height="50"
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "50%",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                  backgroundColor: "#ff600f", // orange
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: "600",
                                  fontSize: "20px",
                                  textTransform: "uppercase",
                                }}
                              >
                                {item?.userName?.charAt(0) || "?"}
                              </div>
                            )}
                          </Link>

                        </td>
                        <td>
                          {/* <Link to={`/retailers/detail?_id=${item?._id}`}>
                            {item?.userName}
                          </Link> */}
                          <td>
                            <strong>
                              {/* {item?.userName} */}
                              {truncate(item?.kycDetails?.business_name || item?.userName)}
                            </strong>
                          </td>
                        </td>
                        <td>
                          {(item?.phoneNumber)?.split('/')?.[0]}
                        </td>
                        <td>
                          {(item?.email)?.split('/')?.[0]}
                        </td>

                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="d-flex align-items-center justify-content-around">

                            <div
                              className="action_btn "
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/retailers/detail?_id=${item?._id}`);
                              }}
                            >
                              <i className="far fa-eye"></i>
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
          handleChangeStatus(selectedRetailer?._id, selectedRetailer?.isSuspend)
        }
        isOpen={isStatusOpen}
        toggle={() => setStatusOpen(!isStatusOpen)}
        text={
          "Are you sure that you want to change the status of this retailer?"
        }
      />

      <ConfirmationPopup
        submit={() =>
          handleChangeDelete(selectedRetailer?._id)
        }
        isOpen={isDeleteOpen}
        toggle={() => setDeleteOpen(!isDeleteOpen)}
        text={"Are you sure that you want to delete of this retailer?"}
      />

      <AddRetailer isOpen={isAddOpen} toggle={() => setAddOpen(!isAddOpen)} />
      <EditRetailer
        retailerId={selectedRetailer?._id}
        isOpen={isEditOpen}
        toggle={() => setEditOpen(!isEditOpen)}
      />
    </>
  );
};

export default RetailersList;
