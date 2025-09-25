import React, { useMemo, useState } from "react";
import { Col, Row, Card } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "src/components/common/breadcrumb";
import PtSwitch from "src/components/features/elements/switch";
import { toast } from "react-toastify";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";
import { Brand } from "./BrandsList";
import ProductsList, { Product } from "../products/ProductsList";
import EditBrand from "./popups/EditBrand";
import {
  useGetAllProductsByBrandId,
  useGetBrandById,
  useUpdateBrandStatus,
} from "src/services/brand.service";
import { generateFilePath } from "src/services/url.service";
import BrandProductsList from "./stock/BrandProductsList";

const BrandsDetailPage = () => {
  //IMPORTS
  const [searchParams] = useSearchParams();
  const brandId = searchParams.get("_id");

  //STATE
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [isStatusOpen, setStatusOpen] = useState<boolean>(false);
  //pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");

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

    if (brandId) {
      obj.brandId = brandId;
    }

    return obj;
  }, [page, limit, search]);

  // QUERIES
  const {
    data: brand,
    isLoading,
    error: brandError,
  } = useGetBrandById(brandId ? brandId : "", !!brandId) as {
    data: Brand | undefined;
    isLoading: boolean;
    error: unknown;
  };

  //MUTATION
  const { mutateAsync: updateBrandStatus } = useUpdateBrandStatus();

  //HANDLERS
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

  return (
    <>
      <Breadcrumb
        current={"Brand Details"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "brands",
            url: "/brands",
          },
          {
            name: "Product Details",
            url: `/brands/detail?_id=${brandId}`,
          },
        ]}
      />
      <div>
        <Row>
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
                    if (brand?._id) {
                      setEditOpen(true);
                      setSelectedBrandId(brand?._id);
                    }
                  }}
                >
                  <i className="fas fa-pencil-alt"></i>
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={2} className="px-3  ">
                    <div className="">
                      <h6>Logo</h6>
                      <div
                        className="product_image_div"
                        style={{ cursor: "default" }}
                      >
                        <img
                          src={generateFilePath(brand?.imageUrl)}
                          alt="brand"
                          width="110"
                          height="110"
                          crossOrigin="anonymous"
                        />
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <div>
                      <h6>Brand </h6>
                      <h5 className=" text-dark font-weight-500 ">
                        {brand?.name}
                      </h5>
                    </div>
                    <div>
                      <h6>Product Count</h6>
                      <h5 className=" text-dark font-weight-500 ">0</h5>
                    </div>
                    {/* </Col>

                  <Col md={3} xl={2}> */}
                    <div>
                      <h6 className="mb-0">Status</h6>
                      <div
                        className="d-flex align-items-center"
                        onClick={() => {
                          handleStatusChangeBrand(
                            brand?._id ? brand?._id : "",
                            !brand?.isActive
                          );
                        }}
                      >
                        <PtSwitch
                          className="mr-2"
                          on={brand?.isActive}
                          size="sm"
                          variant="success"
                        />
                        <h5 className=" text-dark font-weight-500 ">
                          {brand?.isActive ? "Active" : "Blocked"}
                        </h5>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* <div
              className="tabs"
              style={{ borderRadius: "5px", overflow: "hidden" }}
            >
              <Tabs className="nav-justified">
                <Tab
                  eventKey="about"
                  title="About"
                >
                  <p>About</p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitat.
                  </p>
                </Tab>
                <Tab
                  eventKey="tournaments"
                  title="Tournaments"
                >
                  <div className="mt-2">
                    <TournamentsList />
                  </div>
                </Tab>
              </Tabs>
            </div> */}
          </Col>
          <Col lg={12} className="mt-4">
            <Card className="card-modern">
              <Card.Body>
                <BrandProductsList brandId={brand?._id ? brand?._id : ""} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <ConfirmationPopup
        // submit={() => handleChangeStatus(organiser?.isActive)}
        submit={() =>
          toast("Status Update", {
            containerId: "default",
            className: "no-icon notification-success",
          })
        }
        isOpen={isStatusOpen}
        toggle={() => setStatusOpen(!isStatusOpen)}
        text={
          "Are you sure that you want to change the status of this product?"
        }
      />
      <EditBrand
        isOpen={isEditOpen}
        toggle={() => setEditOpen(!isEditOpen)}
        brandId={selectedBrandId}
      />
    </>
  );
};

export default BrandsDetailPage;
