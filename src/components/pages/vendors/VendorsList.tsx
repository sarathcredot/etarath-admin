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
import AddVendor from "./forms/AddVendor";
import AddBussinessDetails from "./forms/AddBussinessDetails";
import { generateFilePath } from "src/services/url.service";
import EditVendor from "./forms/EditVendor";

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

const VendorsList = ({
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
  const [isAddOpen, setAddOpen] = useState<boolean>(false);
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [isStatusOpen, setStatusOpen] = useState<boolean>(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  //MUTATIONS
  // const { mutateAsync: updateOrganiser } = useUpdateOrganiser();

  //HANDLERS
  const handleChangeStatus = async (organiserId: string, isActive: boolean) => {
    try {
      if (!organiserId) throw new Error("Organiser ID is required!");
      if (typeof isActive !== "boolean")
        throw new Error("Unexpected Active status!");

      // const resp = await updateOrganiser({
      //   id: organiserId,
      //   isActive: !isActive,
      // });

      // setSelectedVendor(null);
      // setStatusOpen(false);
      // toast(resp?.data?.message, {
      //   containerId: "default",
      //   className: "no-icon notification-success",
      // });
    } catch (error) {
      toast("Can't update Organiser right now, please try later!", {
        containerId: "default",
        className: "no-icon notification-success",
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
                  {header && (
                    <Col>
                      <h5 className="m-0 card-title h5 font-weight-bold">
                        Vendors
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
                      style={{ background: "#000" }}
                      // onClick={() => navigate("/vendors/add-vendor")}
                      onClick={() => setAddOpen(true)}
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
                    <th style={{ width: "80px" }}>Profile</th>

                    <th>Full Name</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>Verifaction</th>
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
                        <td>
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
                              crossOrigin="anonymous"
                            />
                          </Link>
                        </td>
                        <td>
                          <Link to={`/vendors/detail?_id=${item?._id}`}>
                            {item?.userName}
                          </Link>
                        </td>
                        <td>{item?.phoneNumber}</td>
                        <td>{item?.email}</td>
                        <td>
                          <div
                            className={`ecommerce-status ${item?.isVerified}`}
                          >
                            {item?.isVerified}
                          </div>
                        </td>

                        <td>
                          <div
                            onClick={() => {
                              setStatusOpen(true);
                              setSelectedVendor(item);
                            }}
                          >
                            <PtSwitch
                              className="mr-1"
                              on={!item?.isSuspended}
                              size="sm"
                              variant="success"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center justify-content-around">
                            
                            <div
                              className="action_btn "
                              onClick={() => {
                                setSelectedVendor(item);
                                setEditOpen(true);
                              }}
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </div>
                            {/* <div
                              className="action_btn"
                              onClick={() => {
                                setDeleteOpen(true);
                                setSelectedVendor(item);
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
        submit={() =>
          handleChangeStatus(selectedVendor?._id, selectedVendor?.isSuspended)
        }
        isOpen={isStatusOpen}
        toggle={() => setStatusOpen(!isStatusOpen)}
        text={"Are you sure that you want to change the status of this vendor?"}
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
