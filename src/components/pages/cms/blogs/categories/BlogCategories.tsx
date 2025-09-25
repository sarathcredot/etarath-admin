"use client";
import React, { useEffect, useMemo, useState } from "react";
import Breadcrumb from "src/components/common/breadcrumb";
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "src/components/features/loader";
import { Link, useNavigate } from "react-router-dom";
import { capitalize } from "lodash";
import PtSwitch from "src/components/features/elements/switch";
import Pagination from "src/components/common/Pagination";
import {
  useDeleteProduct,
  useGetAllProducts,
  useUpdateProductStatus,
} from "src/services/product.service";
import { generateFilePath } from "src/services/url.service";
import AddBlogCategory from "./popups/AddBlogCategory";
import {
  useDeleteBlogCategory,
  useGetAllBlogCategories,
} from "src/services/blog.category.service";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";

const BlogCategories = () => {
  const navigate = useNavigate();
  //STATE
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  //USE MEMO
  const queryObj = useMemo(() => {
    const obj: any = {
      skip: true,
    };

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

  // QUERIES
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error,
  }: any = useGetAllBlogCategories();

  // MUTATIONS
  const { mutateAsync: deleteBlogCategory } = useDeleteBlogCategory();

  console.log("categories = ", categories);

  const handleDeleteBlogCategory = async () => {
    if (!selectedCategory) {
      toast("Category selection failed", {
        containerId: "default",
        className: "no-icon notification-danger",
      });
      return;
    }
    try {
      const res = await deleteBlogCategory({ category: selectedCategory });
      if (res) {
        toast(res?.data?.message, {
          containerId: "default",
          className: "no-icon notification-success",
        });
        setDeleteOpen(false);
      }
    } catch (error: any) {
      console.log("error deleting category :", error);
      toast(
        error?.response?.data?.message ||
          "Something went wrong while deleting the category.",
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
        current={"Blog Categories"}
        paths={[
          {
            name: "dashboard",
            url: "/dashboard",
          },
          {
            name: "cms",
          },
          {
            name: "blogs",
            url: "/cms/blogs",
          },
          {
            name: "categories",
            url: "/cms/blogs/categories",
          },
        ]}
      />
      <Card>
        <Card.Body className="bg-white">
          <div className="">
            <Row>
              <Col>
                {/* <Card className="card-modern"> */}
                {/* <Card.Body> */}
                <div className="datatables-header-footer-wrapper">
                  <div className="datatable-header">
                    <Row className="align-items-lg-center justify-content-end mb-3">
                      {/* <Col>
                        <h5 className="m-0 card-title h5 font-weight-bold">
                          Vendors
                        </h5>
                      </Col> */}
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
                              placeholder="Search "
                              style={{ width: "250px" }}
                              value={search}
                              onChange={(e) =>
                                setSearch && setSearch(e.target.value)
                              }
                            />
                            {/* <InputGroup.Append> */}
                            {/* <Button
                              variant="default"
                              type="submit"
                            >
                              <i className="bx bx-search"></i>
                            </Button> */}
                            {/* </InputGroup.Append> */}
                          </InputGroup>
                        </div>
                      </Col>
                      <Col xl="auto" className="mb-2 mt-1 mb-xl-0">
                        <Button
                          className="font-weight-semibold"
                          variant="dark"
                          //   size="md"
                          onClick={() => setIsOpen(true)}
                        >
                          + Add
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
                        <th>Category</th>
                        <th className="text-center" style={{ width: "80px" }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isCategoriesLoading ? (
                        <tr>
                          <td colSpan={9}>
                            <Loader />
                          </td>
                        </tr>
                      ) : !isCategoriesLoading &&
                        categories[0]?.categories?.length > 0 ? (
                        categories[0]?.categories?.map(
                          (item: string, index: number) => (
                            <tr key={index}>
                              <td>
                                <strong>
                                  {/* {index +
                                  (productsData?.pagination?.page - 1) *
                                    productsData?.pagination?.limit +
                                  1} */}
                                  {index + 1}
                                </strong>
                              </td>
                              <td>{item}</td>
                              <td className="">
                                <div
                                  className="action_btn "
                                  style={{ margin: "auto" }}
                                  onClick={() => {
                                    setDeleteOpen(true);
                                    setSelectedCategory(item);
                                  }}
                                >
                                  <i className="far fa-trash-alt"></i>
                                </div>
                              </td>
                            </tr>
                          )
                        )
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
                {/* <Pagination
                  currentPage={page}
                  setCurrentPage={setPage}
                  totalButtonsToShow={3}
                  totalPages={2}
                  style={{ marginTop: "20px" }}
                /> */}
                {/* </Card.Body>
            </Card> */}
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>

      <AddBlogCategory isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
      <ConfirmationPopup
        submit={() => handleDeleteBlogCategory()}
        isOpen={isDeleteOpen}
        toggle={() => setDeleteOpen(!isDeleteOpen)}
        text={"Are you sure that you want to delete this category?"}
      />
    </>
  );
};

export default BlogCategories;
