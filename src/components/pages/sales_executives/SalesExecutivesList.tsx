import React, { useCallback, useMemo, useState } from "react";
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
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";
import { toast } from "react-toastify";
import Loader from "src/components/features/loader";
import { debounce } from "lodash";
import EditSalesExecutive from "./Popups/EditSalesExecutive";


type Executives = {
  fullName: string;
  vendorName: string;
  email: string;
  phone: string;
  createdDate: string; // ISO format or date string
  status: boolean; // true = Active, false = Suspended
};

const SalesExecutivesList = ({ header = false }) => {
  //STATE
  // states for popups
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [isStatusOpen, setStatusOpen] = useState<boolean>(false);
  const [organiser, setOrganiser] = useState<any>(null);
  const [search, setSearch] = useState<string>("");

  //pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  //USE MEMO
  const queryObj = useMemo(() => {
    const obj: any = {};

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

  //DATA
  // const { data: organisersData, isLoading } = useGetAllOrganisers(queryObj);
  // const organisers = organisersData?.data;

  //MUTATIONS
  // const { mutateAsync: updateOrganiser } = useUpdateOrganiser();
  // const { mutateAsync: deleteOrganiser } = useDeleteOrganiser();

  //HANDLERS
  const handleDeleteOrganizer = async (organiserId: string) => {
    try {
      if (!organiserId) throw new Error("Organiser ID is required!");

      // const resp = await deleteOrganiser(organiserId);

      // setOrganiser(null);
      // setDeleteOpen(false);
      // toast(resp?.data?.message, {
      //   containerId: "default",
      //   className: "no-icon notification-success",
      // });
    } catch (error) {
      console.log(error, "ERROR IN DLTE ORGNSER");
      toast("Can't delete Organiser right now, please try later!", {
        containerId: "default",
        className: "no-icon notification-danger",
      });
      setDeleteOpen(false);
    }
  };
  const handleChangeStatus = async (organiserId: string, isActive: boolean) => {
    try {
      if (!organiserId) throw new Error("Organiser ID is required!");
      if (typeof isActive !== "boolean")
        throw new Error("Unexpected Active status!");

      // const resp = await updateOrganiser({
      //   id: organiserId,
      //   isActive: !isActive,
      // });

      // setOrganiser(null);
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

  const executives: Executives[] = [
  {
    fullName: "Omar Khalid",
    vendorName: "Al Futtaim Motors",
    email: "omar.khalid@alfuttaim.com",
    phone: "+971501234567",
    createdDate: "2025-01-12",
    status: true,
  },
  {
    fullName: "Sara Ahmed",
    vendorName: "Carrefour UAE",
    email: "sara.ahmed@carrefour.com",
    phone: "+971521112233",
    createdDate: "2025-02-05",
    status: false,
  },
  {
    fullName: "Mohammed Saleh",
    vendorName: "Union Coop",
    email: "mohammed.saleh@unioncoop.ae",
    phone: "+971561234111",
    createdDate: "2025-03-18",
    status: true,
  },
  {
    fullName: "Fatima Noor",
    vendorName: "Lulu Hypermarket",
    email: "fatima.noor@lulu.com",
    phone: "+971581223344",
    createdDate: "2025-04-10",
    status: true,
  },
  {
    fullName: "Rashid Ali",
    vendorName: "Sharaf DG",
    email: "rashid.ali@sharafdg.com",
    phone: "+971551234890",
    createdDate: "2025-05-01",
    status: false,
  },
  {
    fullName: "Aisha Khan",
    vendorName: "Spinneys",
    email: "aisha.khan@spinneys.com",
    phone: "+971509876543",
    createdDate: "2025-05-15",
    status: true,
  },
  {
    fullName: "Khalifa Mansoor",
    vendorName: "Emirates NBD",
    email: "khalifa.mansoor@enbd.com",
    phone: "+971502223344",
    createdDate: "2025-06-02",
    status: true,
  },
  {
    fullName: "Layla Hassan",
    vendorName: "Choithrams",
    email: "layla.hassan@choithrams.com",
    phone: "+971581234765",
    createdDate: "2025-06-20",
    status: false,
  },
  {
    fullName: "Yousef Ibrahim",
    vendorName: "Dubai Duty Free",
    email: "yousef.ibrahim@dubaidutyfree.com",
    phone: "+971501112222",
    createdDate: "2025-07-03",
    status: true,
  },
  {
    fullName: "Huda Al Mansoori",
    vendorName: "Etisalat",
    email: "huda.mansoori@etisalat.ae",
    phone: "+971522334455",
    createdDate: "2025-07-25",
    status: true,
  },
];
  
  const totalRecords = 10 ;
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
                        Sales Executives
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

                    <th>Full Name</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>Vendor</th>
                    <th>Created Date</th>
                    <th>Status</th>
                    <th className="text-center" style={{ width: "80px" }}>
                      Actions
                    </th>
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
                  {false && executives && executives.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        style={{ textAlign: "center", height: "100px" }}
                      >
                        No sales executives found.
                      </td>
                    </tr>
                  )}
                  {true &&
                    executives &&
                    executives?.length > 0 &&
                    executives?.map((item: Executives, index: number) => (
                      <tr>
                        <td>
                          <Link to={`/sales-executives/detail?_id=${item?.fullName}`}>
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
                          <Link to={`/sales-executives/detail?_id=${item?.fullName}`}>
                            {item?.fullName}
                          </Link>
                        </td>
                        <td>{item?.phone}</td>
                        <td>{item?.email}</td>
                        <td>{item?.vendorName}</td>
                        <td>{item?.createdDate}</td>
                        {/* <td>
                          <span
                            className={`ecommerce-status ${
                              item?.isVerified ? "completed" : "on-hold"
                            }`}
                          >
                            {item?.isVerified ? "Completed" : "Pending"}
                          </span>
                        </td> */}
                        <td>
                          <div
                            onClick={() => {
                              setStatusOpen(true);
                              setOrganiser(item);
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
                              className="action_btn "
                              onClick={() => {
                                setEditOpen(true);
                                setOrganiser(item);
                              }}
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </div>
                            <div
                              className="action_btn"
                              onClick={() => {
                                setDeleteOpen(true);
                                setOrganiser(item);
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
        submit={() => handleDeleteOrganizer(organiser?._id)}
        isOpen={isDeleteOpen}
        toggle={() => setDeleteOpen(!isDeleteOpen)}
        text={"Are you sure that you want to delete this sales executive?"}
      />
      <ConfirmationPopup
        submit={() => handleChangeStatus(organiser?._id, organiser?.isActive)}
        isOpen={isStatusOpen}
        toggle={() => setStatusOpen(!isStatusOpen)}
        text={"Are you sure that you want to change the status of this sales executive?"}
      />
      <EditSalesExecutive
        agentId={organiser?._id}
        isOpen={isEditOpen}
        toggle={() => {
          setEditOpen(!isEditOpen);
          setOrganiser(null);
        }}
      />
    </>
  );
};

export default SalesExecutivesList;
