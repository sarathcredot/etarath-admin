import React, { useMemo, useState } from "react";
import { Col, Row, Tabs, Tab, Card } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "src/components/common/breadcrumb";
import PtSwitch from "src/components/features/elements/switch";
import { toast } from "react-toastify";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";
import { useGetWarehousesId, useUpdateWarehouseStatus, useGetWarehouseallOrdersById, useGetWarehouseallClaimsById, useGetWarehouseallProductsById } from "src/services/warehouse.service";
import EditWarehouse from "./Popups/EditWarehouse";
import { generateFilePath } from "src/services/url.service";
import VendorOrdersList from "../vendors/VendorOrdersList";
import VendorClaimsList from "../vendors/VendorClaimList";
import StocksList from "./StocksList";


const WarehouseDetailPage = () => {
    //IMPORTS
    const [searchParams] = useSearchParams();
    const warehouseId = searchParams.get("_id");
    const vendorId = searchParams.get("vendorId")

    console.log("v", vendorId, "w", warehouseId)

    //STATE
    const [isEditOpen, setEditOpen] = useState<boolean>(false);
    const [isStatusOpen, setStatusOpen] = useState<boolean>(false);
    //pagination
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [search, setSearch] = useState<string>("");

    const [stockPage, setStockPage] = useState<number>(1);
    const [stockLimit, setStockLimit] = useState<number>(10);
    const [stockSearch, setStockSearch] = useState<string>("");

    const [orderPage, setOrderPage] = useState<number>(1);
    const [orderLimit, setOrderLimit] = useState<number>(10);
    const [orderSearch, setOrderSearch] = useState<string>("");

    const [claimPage, setClaimPage] = useState<number>(1);
    const [claimLimit, setClaimLimit] = useState<number>(10);
    const [claimSearch, setClaimSearch] = useState<string>("");

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

        if (warehouseId) {
            obj.warehouseId = warehouseId;
        }

        return obj;
    }, [page, limit, search]);


    //order USE MEMO
    const orderQueryObj = useMemo(() => {
        const obj: any = {};

        if (orderPage) {
            obj.page = orderPage;
        }

        if (orderLimit) {
            obj.limit = orderLimit;
        }

        if (orderSearch) {
            obj.search = orderSearch;
        }

        if (warehouseId) {
            obj.warehouseId = warehouseId;
        }

        return obj;
    }, [orderPage, orderLimit, orderSearch, warehouseId]);


    // claim use memo

    const claimQueryObj = useMemo(() => {
        const obj: any = {};

        if (claimPage) {
            obj.page = claimPage;
        }

        if (claimLimit) {
            obj.limit = claimLimit;
        }

        if (claimSearch) {
            obj.search = claimSearch;
        }

        if (warehouseId) {
            obj.warehouseId = warehouseId;
        }

        return obj;
    }, [claimPage, claimLimit, claimSearch, warehouseId]);


    const stockQueryObj = useMemo(() => {
        const obj: any = {};

        if (stockPage) {
            obj.page = stockPage;
        }

        if (stockLimit) {
            obj.limit = stockLimit;
        }

        if (stockSearch) {
            obj.search = stockSearch;
        }

        if (warehouseId) {
            obj.vendorID = warehouseId;
        }

        return obj;
    }, [stockPage, stockLimit, stockSearch, warehouseId]);



    //HANDLERS
    const handleChangeStatus = async (isActive: boolean) => {
        try {
            if (typeof isActive !== "boolean")
                throw new Error("Unexpected Active status!");
            const resp = await updateWaerhouseStatus({
                vendorId,
                warehouseId,
                isActive: !isActive,
            });

            setStatusOpen(false);
            toast(resp?.data?.message, {
                containerId: "default",
                className: !isActive
                    ? "no-icon notification-warning" // when activated
                    : "no-icon notification-success", // when deactivated
            });

        } catch (error) {
            console.log("s e", error)
            toast("Can't update Warehouse right now, please try later!", {
                containerId: "default",
                className: "no-icon notification-success",
            });
            setStatusOpen(false);
        }
    };



    const { data: warehouse, isLoading: warehouseLoading } = useGetWarehousesId(vendorId, !!vendorId, warehouseId)
    const { data: orders, isLoading: ordersLoading } = useGetWarehouseallOrdersById(warehouseId, !!warehouseId, orderQueryObj)
    const { data: claims, isLoading: claimsLoading } = useGetWarehouseallClaimsById(warehouseId, !!warehouseId, claimQueryObj)
    const { data: stocks, isLoading: stocksLoading } = useGetWarehouseallProductsById(warehouseId, !!warehouseId, stockQueryObj)


    const { mutateAsync: updateWaerhouseStatus } = useUpdateWarehouseStatus();


    console.log("agent", warehouse)

    return (
        <>
            <Breadcrumb
                current={"Warehouse"}
                paths={[
                    {
                        name: "Dashboard",
                        url: "/dashboard",
                    },
                    {
                        name: "vendor",
                        url: "/vendors",
                    },
                    //   {
                    //     name: "sales-executive",
                    //     url: `/sales-executives/detail?_id=${agentId}`,
                    //   },
                ]}
            />
            <div>
                <Row>
                    {/* <Col
            lg={12}
            className=" "
          >
            <div className="banner_section">
              <div className="w-100 banner_image_div">
                <img
                  className="banner_image"
                  src="/assets/images/banner/banner_1.png"
                  alt=""
                />
                <div className="edit-icon" >
                  <div onClick={()=> setEditBannerOpen(true)}>

                 <i className="bx bxs-edit fa " ></i>
                  </div>
                </div>
              </div>
              <div className="content" style={{zIndex:1000}}>
                <div className="logo_div" >
                  <img
                    className="logo_img"
                    src="/assets/images/banner/Pepsi_IPL_logo 1.png"
                    alt=""
                  />
                </div>
                <h1>Pepsi Indian Premier League</h1>
              </div>
            </div>
          </Col> */}
                    <Col
                        lg={12}
                    // className="mt-5"
                    >
                        <Card className="card-modern">
                            <Card.Header className="d-flex align-items-center justify-content-between">
                                <Card.Title>Details</Card.Title>
                                <div
                                    className="action_btn "
                                    onClick={() => {
                                        setEditOpen(true);
                                    }}
                                >
                                    <i className="fas fa-pencil-alt"></i>
                                </div>
                            </Card.Header>
                            <Card.Body>

                                <Row>

                                    <Col className="text-center">
                                        <div>
                                            <div>
                                                <img
                                                    src={generateFilePath(
                                                        warehouse?.shop_photo_logo
                                                    )}
                                                    width={150}
                                                    height={150}
                                                    alt="profile"
                                                    style={{
                                                        borderRadius: "50%",
                                                        marginBottom: 20,
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </div>
                                        </div>

                                    </Col>
                                    <Col>
                                        <div>
                                            <h6>Warehouse Name</h6>
                                            <h5 className=" text-dark font-weight-500 ">
                                                {warehouse?.shop_name}
                                            </h5>
                                        </div>
                                        <div>
                                            <h6>Phone Number</h6>
                                            <h5 className=" text-dark font-weight-500 ">
                                                {warehouse?.vendorDetails?.phoneNumber}
                                            </h5>
                                        </div>
                                    </Col>

                                    <Col>
                                        <div>
                                            <h6>Email</h6>
                                            <h5 className=" text-dark font-weight-500 ">
                                                {warehouse?.vendorDetails?.email}
                                            </h5>
                                        </div>
                                        <div>
                                            <h6>Location</h6>
                                            <h5 className=" text-dark font-weight-500 ">
                                                {warehouse?.location} , {warehouse?.address}
                                            </h5>
                                        </div>
                                    </Col>




                                    <Col>
                                        {/* <div>
                      <h6>Verification Status</h6>
                      <span
                        className={`ecommerce-status ${true ? "completed" : "pending"
                          } text-dark font-weight-500`}
                      >
                        {true ? "Completed" : "Pending"}
                      </span>
                    
                    </div> */}
                                        <div>
                                            <h6 className="mb-0">Status</h6>
                                            <div
                                                className="d-flex align-items-center"
                                                onClick={() => {
                                                    setStatusOpen(true);
                                                }}
                                            >
                                                <PtSwitch
                                                    className="mr-2"
                                                    on={!warehouse?.issuspended}
                                                    size="sm"
                                                    variant="success"
                                                />
                                                <h5 className=" text-dark font-weight-500 ">
                                                    {warehouse?.issuspended ? "Blocked" : "Active"}
                                                </h5>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={12} className="mt-4">
                        <Card className="card-modern">
                            <Card.Body>
                                {/* <TournamentsList
                  header={true}
                  tournamentsData={tournamentsData}
                  isLoading={isTournamentsLoading}
                  setPage={setPage}
                  setLimit={setLimit}
                  setSearch={setSearch}
                  page={page}
                  limit={limit}
                  search={search}
                /> */}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <div
                    className="tabs"
                    style={{ borderRadius: "5px", marginTop: "20px", overflow: "hidden" }}
                >
                    <Tabs className="nav-justified">
                        <Tab eventKey="products" title="Products">
                            <StocksList
                                waerhouseId={warehouseId}
                                stocks={stocks}
                                stocksLoading={stocksLoading}
                                setPage={setStockPage}
                                setLimit={setStockLimit}
                                setSearch={setStockSearch}
                                page={stockPage}
                                limit={stockLimit}
                                search={stockSearch}
                                
                            />
                        </Tab>
                        <Tab eventKey="orders" title="Orders">
                            <VendorOrdersList
                                vendorId={warehouseId ? warehouseId : ""}
                                orders={orders}
                                ordersLoading={ordersLoading}
                                setPage={setOrderPage}
                                setLimit={setOrderLimit}
                                setSearch={setOrderSearch}
                                page={orderPage}
                                limit={orderLimit}
                                search={orderSearch}
                            />
                        </Tab>
                        <Tab eventKey="claims" title="Claims">
                            <VendorClaimsList
                                vendorId={warehouseId ? warehouseId : ""}
                                claims={claims}
                                claimsLoading={claimsLoading}
                                setPage={setClaimPage}
                                setLimit={setClaimLimit}
                                setSearch={setClaimSearch}
                                page={claimPage}
                                limit={claimLimit}
                                search={claimSearch}
                            />
                        </Tab>


                    </Tabs>
                </div>
            </div>
            <ConfirmationPopup
                submit={() => handleChangeStatus(warehouse?.issuspended)}
                isOpen={isStatusOpen}
                toggle={() => setStatusOpen(!isStatusOpen)}
                text={
                    "Are you sure that you want to change the status of this warehouse?"
                }
            />
            <EditWarehouse
                isOpen={isEditOpen}
                toggle={() => setEditOpen(!isEditOpen)}
                warehouseId={warehouseId}
                vendorId={vendorId}
                data={warehouse}
            />
        </>
    );
};

export default WarehouseDetailPage;
