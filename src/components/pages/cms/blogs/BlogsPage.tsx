"use client";

import { posix } from "path";
import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import Breadcrumb from "src/components/common/breadcrumb";
import PtSwitch from "src/components/features/elements/switch";
import Loader from "src/components/features/loader";
import Pagination from "src/components/features/pagination";
import {
  useDeleteOffer,
} from "src/services/offer.service";
import { generateFilePath } from "src/services/url.service";
import { toast } from "react-toastify";
import ConfirmationPopup from "src/components/common/Popups/ConfirmationPopup";
import { useGetBlogs, useUpdateBlogStatus } from "src/services/blog.service";
import AddBlog from "./popups/AddBlog";
import dayjs from "dayjs";
import EditBlog from "./popups/EditBlog";

const BlogsPage = () => {
  const [search, setSearch] = useState<string>("");
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  // QUERIES
  const { data: blogs, isLoading: blogsLoading } = useGetBlogs();
  const isLoading = false;

  // MUTATIONS
  const { mutateAsync: updateBlogStatus } = useUpdateBlogStatus();
  const { mutateAsync: deleteOffer } = useDeleteOffer();

  //pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const totalRecords = blogs?.length || 0;
  const totalPages = Math.ceil(totalRecords / 5);

  function closeLightBox() {
    setSelectedBlog(null);
  }

  const handleStatusChange = async (id: string, status: boolean) => {
    try {
      if (id) {
        const res = await updateBlogStatus({ id, status });
        if (res) {
          toast(res?.data?.message, {
            containerId: "default",
            className: "no-icon notification-success",
          });
        }
      }
    } catch (error: any) {
      console.log("error status updation :", error);
      toast(
        error?.response?.data?.message ||
          "Something went wrong while updating the status.",
        {
          containerId: "default",
          className: "no-icon notification-danger",
        }
      );
    }
  };
  const handleDeleteBlog = async (id: string) => {
    try {
      if (id) {
        const res = await deleteOffer(id);
        if (res) {
          toast(res?.data?.message, {
            containerId: "default",
            className: "no-icon notification-success",
          });
          setIsDeleteOpen(false);
        }
      }
    } catch (error: any) {
      console.log("error offer deletion :", error);
      toast(
        error?.response?.data?.message ||
          "Something went wrong while deleting the offer.",
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
        current={"Blogs"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "cms",
            url: "",
          },
          {
            name: "blogs",
            url: "/cms/blogs",
          },
        ]}
      />
      <Card>
        <Card.Body className="bg-white">
          <div className="" style={{ position: "relative" }}>
            <Row>
              <Col>
                <div className="datatables-header-footer-wrapper">
                  <div className="datatable-header">
                    <Row className="align-items-lg-center justify-content-end mb-3">
                      <Col className="col-auto pl-lg-1">
                        <div className="search search-style-1 mx-lg-auto w-auto">
                          <InputGroup>
                            <Form.Control
                              type="text"
                              className="search-term"
                              placeholder="Search Blog"
                              style={{ width: "250px" }}
                              //   onChange={(e: any) =>
                              //     setSearch(e.target.value)
                              //   }
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
                        <th>Blog</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Tags</th>
                        <th>Date</th>
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
                      {!isLoading &&
                        (!blogs || blogs?.result?.length === 0) && (
                          <tr>
                            <td
                              colSpan={9}
                              style={{ textAlign: "center", height: "100px" }}
                            >
                              No bolgs found.
                            </td>
                          </tr>
                        )}
                      {!isLoading &&
                        blogs &&
                        blogs?.result?.length > 0 &&
                        blogs?.result?.map((item: any, index: any) => (
                          <tr>
                            <td>
                              <strong>
                                {/* {search
                                ? index + 1
                                : index +
                                  (organisersData?.page - 1) *
                                    organisersData?.limit +
                                  1} */}
                                {index + 1}
                              </strong>
                            </td>
                            <td>
                              <div
                                style={{ width: "100px", height: "50px" }}
                                className="d-flex align-items-center justify-content-center"
                                onClick={() => setSelectedBlog(item)}
                              >
                                <img
                                  className="mr-1"
                                  src={generateFilePath(item?.imgUrl)}
                                  alt="product"
                                  width="100"
                                  height="50"
                                  // crossOrigin="anonymous"
                                />
                              </div>
                            </td>
                            <td className="">{item?.title}</td>
                            <td>{item?.category}</td>
                            {/* tags are array of strings  */}
                            <td>{item?.tags}</td>
                            <td>
                              {item?.date
                                ? dayjs(item.date).format("DD-MM-YYYY")
                                : "-"}
                            </td>
                            <td>
                              <div
                                onClick={() => {
                                  handleStatusChange(item?._id, !item?.status);
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
                                    setIsEditOpen(true);
                                    setSelectedBlog(item);
                                  }}
                                >
                                  <i className="fas fa-pencil-alt"></i>
                                </div>
                                <div
                                  className="action_btn"
                                  onClick={() => {
                                    setSelectedBlog(item);
                                    setIsDeleteOpen(true);
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
            {/* {selectedBlog && (
              <Lightbox
                mainSrc={selectedBlog?.image}
                reactModalStyle={{
                  overlay: {
                    zIndex: "9999",
                  },
                }}
                onCloseRequest={closeLightBox}
                imageCrossOrigin="anonymous"
              />
            )} */}
          </div>
        </Card.Body>
      </Card>

      <AddBlog isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
      <EditBlog
        blogId={selectedBlog?._id}
        isOpen={isEditOpen}
        toggle={() => setIsEditOpen(!isEditOpen)}
      />

      <ConfirmationPopup
        submit={() => handleDeleteBlog(selectedBlog?._id)}
        isOpen={isDeleteOpen}
        toggle={() => setIsDeleteOpen(!isDeleteOpen)}
        text={"Are you sure that you want to delete this blog?"}
      />
    </>
  );
};

export default BlogsPage;
