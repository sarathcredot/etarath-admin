import { add, capitalize } from "lodash";
import React, { Dispatch, useCallback, useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import Pagination from "src/components/common/Pagination";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";
import Loader from "src/components/features/loader";
import { generateFilePath } from "src/services/url.service";
import { formatDate } from "src/utils/formats";
import PtSwitch from "src/components/features/elements/switch";
import AddBrand from "./popups/AddBrand";
import EditBrand from "./popups/EditBrand";
import { debounce } from "lodash";

import {
  useDeleteBrand,
  useUpdateBrandStatus,
} from "src/services/brand.service";

// Type definition
export type Brand = {
  _id: string;
  name: string;
  imageUrl: string;
  imageUrl2: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productCount: string;
  priority: string;
};

const BrandsList = ({
  header = false,
  brandsData,
  isLoading,
  setPage = () => { },
  setSearch = () => { }, // fallback so debounce doesn’t break
  setLimit,
  page = 1,
  limit = 10,
  search = "",
  setStatus = () => { }, // fallback so debounce doesn’t break
}: {
  header?: boolean;
  brandsData?: any;
  isLoading?: boolean;
  setPage?: Dispatch<React.SetStateAction<number>>;
  setLimit?: Dispatch<React.SetStateAction<number>>;
  setSearch?: Dispatch<React.SetStateAction<any>>;
  setStatus?: Dispatch<React.SetStateAction<any>>;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const navigate = useNavigate();

  //STATES
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [addBrandOpen, setAddBrandOpen] = useState<boolean>(false);
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");

  // MUTATION
  const { mutateAsync: deleteBrand } = useDeleteBrand();
  const { mutateAsync: updateBrandStatus } = useUpdateBrandStatus();

  //HANDLERS
  const handleDeleteBrand = async () => {
    try {
      if (selectedBrandId) {
        const res = await deleteBrand(selectedBrandId);
        if (res) {
          toast(res?.data?.message, {
            containerId: "default",
            className: "no-icon notification-success",
          });

          setDeleteOpen(false);
          setSelectedBrandId("");
        }
      } else {
        toast("Brand ID is missing. Unable to delete the brand.", {
          containerId: "default",
          className: "no-icon notification-danger",
        });
      }
    } catch (error: any) {
      console.log("error deleting brand :", error);
      toast(
        error?.response?.data?.message ||
        "Something went wrong while deleting the brand.",
        {
          containerId: "default",
          className: "no-icon notification-danger",
        }
      );
    }
  };
  const handleStatusChangeBrand = async (id: string, isActive: boolean) => {
    try {
      if (id) {
        const res = await updateBrandStatus({ id, isActive });
        if (res) {
          toast(res?.data?.message, {
            containerId: "default",
            className: "no-icon notification-success",
          });

          setSelectedBrandId("");
        }
      } else {
        toast("Brand ID is missing. Unable to change status of the brand.", {
          containerId: "default",
          className: "no-icon notification-danger",
        });
      }
    } catch (error: any) {
      console.log("error changing status of brand :", error);
      toast(
        error?.response?.data?.message ||
        "Something went wrong while changing status of the brand.",
        {
          containerId: "default",
          className: "no-icon notification-danger",
        }
      );
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

  const debouncedHandleStatus = useCallback(
    debounce((text) => {
      try {
        setStatus(text);
      } catch (error) {
        console.log(error, "error in the debounce function");
      }
    }, 1000),
    []
  );


  const totalRecords = brandsData?.total || 0;
  const totalPages = brandsData?.totalPages || 0;

  useEffect(() => {
    console.log(brandsData, "BRANDS DATA");
  }, [brandsData]);
  return (
    <>
      <div className="">
        <Row>
          <Col>
            {/* <Card className="card-modern"> */}
            {/* <Card.Body> */}
            <div className="datatables-header-footer-wrapper">
              <div className="datatable-header">
                <Row className="align-items-lg-center justify-content-between mb-3">
                  {header && (
                    <Col>
                      <h5 className="m-0 card-title h5 font-weight-bold">
                        Brands
                      </h5>
                    </Col>
                  )}
                  <Col className="col-auto pl-lg-2">
                    <div className="search search-style-1 mx-lg-auto w-auto">
                      <InputGroup>
                        <Form.Control
                          type="text"
                          className="search-term"
                          placeholder="Search Brand"
                          style={{ width: "250px" }}
                          onChange={(e: any) =>
                            debouncedHandleSearch(e.target.value)
                          }
                        // value={search}
                        />
                      </InputGroup>
                    </div>
                  </Col>
                  <Col xl="auto" className="mb-2 mt-1 mb-xl-0">
                    <button
                      className="btn-black"
                      // className="font-weight-semibold"
                      // variant="dark"
                      //   size="md"
                      onClick={() => setAddBrandOpen(true)}
                    >
                      + Add Brand
                    </button>
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
                      Logo
                    </th>
                    <th>Brand</th>
                    <th>Priority</th>
                    <th>Product Count</th>
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
                            debouncedHandleStatus(e.target.value)
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
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={9}>
                        <Loader />
                      </td>
                    </tr>
                  ) : brandsData?.result?.length > 0 ? (
                    brandsData?.result?.map((item: Brand, index: number) => (
                      <tr key={index}>
                        <td>
                          <Link to={`/brands/detail?_id=${item?._id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            {/* <strong> */}
                            {/* {index + 1} */}
                            {(brandsData?.currentPage - 1) * limit + index + 1}
                            {/* </strong> */}
                          </Link>
                        </td>
                        <td>
                          <Link
                            to={`/brands/detail?_id=${item?._id}`}
                            className="d-flex align-items-center justify-content-center"
                          >
                            <img
                              className="mr-1 w-100"
                              src={generateFilePath(item?.imageUrl)}
                              // src={"/assets/images/brands/CEAT.svg"}
                              alt="logo"
                            // crossOrigin="anonymous"
                            />
                          </Link>
                        </td>
                        <td>
                          <Link to={`/brands/detail?_id=${item?._id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            <strong>
                              {item?.name || "-"}
                            </strong>
                          </Link>
                        </td>
                        <td>{item?.priority || "-"}</td>
                        <td>{item?.productCount}</td>

                        <td>
                          <div
                            onClick={() => {
                              handleStatusChangeBrand(
                                item?._id,
                                !item?.isActive
                              );
                            }}
                          >
                            <PtSwitch
                              className="mr-1"
                              on={item?.isActive}
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
                                setSelectedBrandId(item?._id);
                                setEditOpen(true);
                              }}
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </div>
                            <div
                              className="action_btn"
                              onClick={() => {
                                setSelectedBrandId(item?._id);
                                setDeleteOpen(true);
                              }}
                            >
                              <i className="far fa-trash-alt"></i>
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
              totalPages={totalPages}
              style={{ marginTop: "20px" }}
            />
            {/* </Card.Body>
            </Card> */}
          </Col>
        </Row>
      </div>
      <ConfirmationPopup
        submit={() => handleDeleteBrand()}
        isOpen={isDeleteOpen}
        toggle={() => setDeleteOpen(!isDeleteOpen)}
        text={"Are you sure that you want to delete this brand?"}
      />
      <AddBrand
        isOpen={addBrandOpen}
        toggle={() => setAddBrandOpen(!addBrandOpen)}
      />
      <EditBrand
        isOpen={isEditOpen}
        toggle={() => setEditOpen(!isEditOpen)}
        brandId={selectedBrandId}
      />
    </>
  );
};

export default BrandsList;
