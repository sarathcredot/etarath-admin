import _, { capitalize, debounce } from "lodash";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Loader from "src/components/features/loader";
import { generateFilePath } from "src/services/url.service";
import dayjs from "dayjs";
import { useGetAllVendorWarehouses, useDeleteWarehouse } from "src/services/warehouse.service";
import AddWarehouse from "./popups/AddWarehouse";
import { toast } from "react-toastify";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";
import { errorMsg } from "src/utils/toast";
import EditWarehouse from "./forms/edit-vendor/EditWarehouse";
import Pagination from "src/components/common/Pagination";
import { truncate } from "src/utils/formats";

const VendorWarehousesList = ({

  vendorId,
  warehouses,
  setPage = () => { },
  setSearch = () => { }, // fallback so debounce doesn’t break
  setStatus = () => { }, // fallback so debounce doesn’t break
  setLimit,
  page = 1,
  limit = 10,
  search = "",
  warehousesLoading

}: {
  vendorId: any;
  warehouses: any
  warehousesLoading: any
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
  const [isAddOpen, setAddOpen] = useState<boolean>(false);
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  //  const [selectedStock, setSelectedStock] = useState<any>(null);

  const { mutateAsync: deleteWarehouse } = useDeleteWarehouse()

  // QUERIES


  const totalRecords = warehouses?.total || 0;
  const totalPages = warehouses?.totalPages || 0;

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



  const handleDeleteStock = async () => {

    try {

      console.log("de", selectedStock)

      const res = await deleteWarehouse({ vendorId: vendorId, warehouseId: selectedStock?._id })
      toast(res?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });

      setDeleteOpen(false)

    } catch (error) {

      toast(_.capitalize(errorMsg(error).toLowerCase()), {
        containerId: "default",
        className: "no-icon notification-danger",
      });

      setDeleteOpen(false)
    }

  }



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
                      Warehouses
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
                      <InputGroup>
                        <Form.Control
                          type="text"
                          className="search-term"
                          placeholder="Search Warehouse"
                          style={{ width: "250px" }}
                          value={search}
                          onChange={(e) =>
                            debouncedHandleSearch(e.target.value)
                          }
                        />
                      </InputGroup>
                    </div>
                  </Col>
                  <Col xl="auto" className="mb-2 mt-1 mb-xl-0">
                    <button
                      style={{ height: "40px" }}
                      // className="font-weight-semibold"
                      // variant="dark"
                      className="btn-black"
                      onClick={() => setAddOpen(true)}
                    >
                      + Add
                    </button>
                  </Col>
                </Row>
              </div>
              <Table
                className="table-ecommerce-simple mb-0"
                responsive="xl"
                striped
                style={{ minWidth: "600px" }}
              >
                <thead>
                  <tr>
                    <th >#</th>
                    <th>Warehouse</th>
                    <th></th>
                    <th>Location</th>
                    <th>Created Date</th>
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
                  {warehousesLoading ? (
                    <tr>
                      <td colSpan={9}>
                        <Loader />
                      </td>
                    </tr>
                  ) : !warehousesLoading &&
                    warehouses &&
                    warehouses?.result?.length > 0 ? (
                    warehouses?.result?.map((item: any, index: number) => (
                      <tr
                        // onClick={() =>
                        //   navigate(`/warehouses/detail?_id=${item?._id}&vendorId=${item?.vendorId}`)
                        // }
                        key={index}
                      >
                        <td>{index + 1}</td>
                        <td>

                          <img
                            className=""
                            src={generateFilePath(item?.shop_photo_logo)}
                            // src={item?.imageUrl[0]}
                            alt="warehouses"
                            width="40"
                            height="40"
                          // crossOrigin="anonymous"
                          />
                          {/* </Link> */}
                        </td>
                        <td>
                          <Link
                            to={`/warehouses/detail?_id=${item?._id}&vendorId=${item?.vendorId}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            <strong>
                              {item?.shop_name}
                            </strong>
                          </Link>

                        </td>
                        <td>

                          {truncate(item?.location)}

                        </td>
                        <td>
                          {item?.createdAt
                            ? dayjs(item?.createdAt).format("DD-MM-YYYY")
                            : "-"}
                        </td>
                        <td>
                          <div
                            className={`ecommerce-status ${item?.issuspended ? "failed" : "completed"
                              }`}
                          >
                            {item?.issuspended ? "Suspended" : "Active"}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center justify-content-around">
                            <div
                              className="action_btn"
                              onClick={() => {
                                setSelectedStock(item);
                                setEditOpen(true);
                              }}
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </div>
                            <div
                              className="action_btn"
                              onClick={() => {
                                setSelectedStock(item);
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
        submit={() => handleDeleteStock()}
        isOpen={isDeleteOpen}
        toggle={() => setDeleteOpen(!isDeleteOpen)}
        text={"Are you sure that you want to delete this warehouse?"}
      />

      <AddWarehouse
        isOpen={isAddOpen}
        toggle={() => setAddOpen(!isAddOpen)}
        vendorId={vendorId}
      />

      <EditWarehouse
        isOpen={isEditOpen}
        toggle={() => setEditOpen(!isEditOpen)}
        warehouseId={selectedStock?._id}
        vendorId={vendorId}
        data={selectedStock}
      />

    </>
  );
};

export default VendorWarehousesList;
