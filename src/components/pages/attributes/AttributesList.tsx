import React, { Dispatch, useCallback, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "src/components/common/Pagination";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";
import Loader from "src/components/features/loader";
import { capitalCase } from "capital-case";
import AddAttribute from "./popups/AddAttribute";
import {
  useDeleteAttribute,
  useUpdateAttributeStatus,
} from "src/services/attribute.service";
import PtSwitch from "src/components/features/elements/switch";
import { debounce } from "lodash";
import { useUploadCsvFileAttribute } from "src/services/bulk.service"
import CsvImportDropModal from "src/components/features/modals/CsvImportModal";


// Type definition
type Brand = {
  brandName: string;
  productCount: number;
  status: boolean;
  logo: string;
};

const AttributesList = ({
  header = false,
  attributesData,
  isLoading,
  setPage = () => { },
  setLimit,
  setSearch = () => { }, // fallback so debounce doesn’t break
  page = 1,
  limit = 10,
  search = "",
  type,
  data
}: {
  header?: boolean;
  attributesData?: any;
  isLoading?: boolean;
  setPage?: Dispatch<React.SetStateAction<number>>;
  setLimit?: Dispatch<React.SetStateAction<number>>;
  setSearch?: Dispatch<React.SetStateAction<any>>;
  page?: number;
  limit?: number;
  search?: string;
  type: string;
  data: any
}) => {
  const navigate = useNavigate();

  //STATES
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedAttribute, setSelectedAttribute] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  // MUTATION
  const { mutateAsync: deleteAttribute } = useDeleteAttribute();
  const { mutateAsync: updateAttributeStatus } = useUpdateAttributeStatus();
  const { mutateAsync: uploadProductCsv } = useUploadCsvFileAttribute()

  //HANDLERS
  const handleDeleteAttribute = async () => {
    try {
      if (selectedAttribute) {
        const res = await deleteAttribute(selectedAttribute);
        if (res) {
          toast(res?.data?.message, {
            containerId: "default",
            className: "no-icon notification-success",
          });
          setDeleteOpen(false);
        }
      } else {
        toast("Attribute is missing. Unable to delete the attribute.", {
          containerId: "default",
          className: "no-icon notification-danger",
        });
      }
    } catch (error: any) {
      console.log("error deleting attribute :", error);
      toast(
        error?.response?.data?.message ||
        "Something went wrong while deleting the attribute.",
        {
          containerId: "default",
          className: "no-icon notification-danger",
        }
      );
    }
  };

  const handleStatusChange = async (data: {
    type: string;
    attributeId: string;
    status: boolean;
  }) => {
    try {
      const res = await updateAttributeStatus(data);
      if (res) {
        toast(res?.data?.message, {
          containerId: "default",
          className: "no-icon notification-success",
        });
      }
      console.log('RES = ', res)
    } catch (error: any) {
      console.log("error updating attribute :", error);
      toast(
        error?.response?.data?.message ||
        "Something went wrong while updating the attribute status.",
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


  const onImport = async (file: any) => {

    console.log("file", file)
    const formData = new FormData();
    formData.append("file", file);

    // // Your backend endpoint for import
    await uploadProductCsv(formData)
  };



  const totalRecords = data?.total || 0;
  const totalPages = data?.totalPages || 0;

  useEffect(() => {
    console.log(attributesData, "ATTRIBUTES DATA");
  }, [attributesData]);
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
                        Attribute
                      </h5>
                    </Col>
                  )}
                  <Col className="col-auto pl-lg-2">
                    <div className="search search-style-1 mx-lg-auto w-auto">
                      <InputGroup>
                        <Form.Control
                          type="text"
                          className="search-term"
                          placeholder="Search Attribute"
                          style={{ width: "250px" }}
                          onChange={(e: any) =>
                            debouncedHandleSearch(e.target.value)
                          }
                        // value={search}
                        />
                      </InputGroup>
                    </div>
                  </Col>
                  <Col xl="auto" className="mb-2 mb-xl-0">
                    <button
                      className="btn-green"
                      style={{ marginRight: "30px" }}
                      onClick={() => { setIsUploadOpen(true) }}

                    >
                      Import CSV
                    </button>
                    <button
                      // className="font-weight-semibold"
                      // variant="dark"
                      className="btn-black"
                      onClick={() => setIsOpen(true)}
                    >
                      + Add Attribute
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
                    <th>Attribute</th>
                    <th>Priority</th>

                    <th style={{ width: "120px" }}>Status</th>
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
                  ) : attributesData?.length > 0 ? (
                    attributesData?.map((item: any, index: number) => (
                      <tr key={index}>
                        <td>
                          {/* <strong> */}

                          {/* {index + 1} */}
                          {(data?.currentPage - 1) * limit + index + 1}
                          {/* </strong> */}
                        </td>

                        <td>
                          <strong>
                            {item?.value}
                          </strong>

                        </td>
                        <td>{item?.priority}</td>
                        <td>
                          <div
                            onClick={() => {
                              handleStatusChange({
                                type,
                                attributeId: item?._id,
                                status: !item?.status,
                              });
                            }}
                          >
                            <PtSwitch
                              className="mr-1"
                              on={item?.status}
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
                                setSelectedAttribute({
                                  type,
                                  attributeId: item?._id,
                                });
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

      {/* MODALS */}

      <AddAttribute
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
        type={type}
      />

      <ConfirmationPopup
        submit={() => handleDeleteAttribute()}
        isOpen={isDeleteOpen}
        toggle={() => setDeleteOpen(!isDeleteOpen)}
        text={"Are you sure that you want to delete this attribute?"}
      />


      <CsvImportDropModal
        show={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onImport={onImport}
        title="Import Origin & Year CSV"
        maxSizeMB={10}
      />


    </>
  );
};

export default AttributesList;
