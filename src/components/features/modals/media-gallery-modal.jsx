import React, { useState, useEffect } from "react";
import { Row, Card, Col, Button } from "react-bootstrap";
import Modal from "react-modal";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import Loader from "../loader";
import PtDropzone from "../elements/dropzone";

import { getCroppedImageUrl } from "../../../utils";
import { toast, ToastContainer } from "react-toastify";

const modalStyles = {
  overlay: {
    background: "rgba(11, 11, 11, .8)",
    zIndex: 9999,
  },
  content: {
    top: "10%",
    right: "10%",
    bottom: "10%",
    left: "10%",
    outline: "none",
    width: "805",
    height: "80%",
    maxWidth: "100%",
    padding: 0,
    position: "absolute",
  },
};

Modal.setAppElement("#app");

export default function MediaGalleryModal({
  isOpen,
  onClose,
  chooseOne = false,
  selected = [],
  limit = 0,
  objectFit = "cover",
}) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (isOpen) {
  //     setLoading(true);
  //     getMedia(0).then((results) => {
  //       let newMedia = results.data.map((file) => {
  //         return {
  //           ...file,
  //           selected: false,
  //         };
  //       });
  //       setMedia(newMedia);
  //       setLoading(false);
  //     });
  //   }
  // }, [isOpen]);

  function closeModal(result = false) {
    if (!result) {
      onClose([]);
      setMedia([]);
      return;
    }

    let selectedMedia = media.filter((item) => item.selected);

    if (limit > 0) {
      if (selectedMedia.length < limit) {
        toast(`Please select exactly ${limit} images.`, {
          containerId: "modal",
          className: "no-icon notification-danger",
        });
        return;
      }

      if (selectedMedia.length > limit) {
        // ✅ update selectedMedia itself
        selectedMedia = selectedMedia.slice(0, limit);
        toast(`Only ${limit} images allowed. Extra images have been ignored.`, {
          containerId: "default",
          className: "no-icon notification-info",
        });
      }
    }

    onClose(selectedMedia);
    setMedia([]);
  }

  function toggleSelect(id, checked) {
    setMedia(
      media.map((file) => {
        if (id === file.id) {
          return {
            ...file,
            selected: checked,
          };
        } else if (chooseOne && checked && file.selected) {
          return {
            ...file,
            selected: false,
          };
        }
        return file;
      })
    );
  }

  function uploadImage(files) {
    let temp = [...media];
    let newMedia = temp.concat(
      files.map((file) => {
        return {
          ...file,
          virtual: true,
          selected: true,
        };
      })
    );
    setMedia(newMedia);
  }

  function removeImage(id) {
    setMedia(media.filter((file) => file.id !== id));
  }

  return (
    <Modal isOpen={isOpen} style={modalStyles} className="modal-media-gallery">
      <Card>
        <Card.Header>
          <Card.Title>Select Images</Card.Title>
        </Card.Header>

        <Card.Body>
          <div className="modal-wrapper">
            {loading ? (
              <Loader />
            ) : (
              <Tabs
                className="tabs"
                defaultIndex={0}
                selectedTabClassName="active"
                selectedTabPanelClassName="show"
                forceRenderTabPanel={true}
              >
                <TabList className="nav nav-tabs">
                  {/* <Tab className="nav-item">
                    <a
                      href="#upload"
                      onClick={(e) => e.preventDefault()}
                      className="nav-link border-bottom-0"
                    >
                      Upload Media
                    </a>
                  </Tab> */}
                  {/* <Tab className="nav-item">
                    <a
                      href="#gallery"
                      onClick={(e) => e.preventDefault()}
                      className="nav-link border-bottom-0"
                    >
                      Media Gallery
                    </a>
                  </Tab> */}
                </TabList>

                <TabPanel
                  className="tab-pane h-100  overflow-scroll"
                  style={{ minHeight: "100%" }}
                >
                  <PtDropzone
                    multiple={!chooseOne}
                    onUpload={uploadImage}
                    onRemove={removeImage}
                    objectFit={objectFit}
                  />
                </TabPanel>

                {/* <TabPanel className="tab-pane media-gallery overflow-auto">
                  {
                    <Row className="mg-files">
                      {media.map((medium, index) => (
                        <Col
                          xs={4}
                          sm={3}
                          md="1-5"
                          lg={2}
                          xl="1-8"
                          className="col-6 col-xxl-1-10"
                          key={"modal-media-" + index}
                        >
                          <div
                            className={`thumbnail ${
                              medium.selected ? "thumbnail-selected" : ""
                            }`}
                          >
                            <div className="thumb-preview">
                              <div className="centered">
                                <a className="thumb-image" href="#media">
                                  <PtLazyLoad
                                    src={
                                      medium.virtual
                                        ? medium.copy_link
                                        : getCroppedImageUrl(
                                            `/mock-server/images/${medium.copy_link}`,
                                            150
                                          )
                                    }
                                    className="img-fluid"
                                    width={150}
                                    height={150}
                                    alt={
                                      medium.alt_text
                                        ? medium.alt_text
                                        : "thumb"
                                    }
                                  />
                                </a>
                              </div>
                              <div className="mg-thumb-options">
                                <div className="mg-toolbar">
                                  <div className="mg-option custom-checkbox checkbox-inline">
                                    <input
                                      type="checkbox"
                                      id={"media_" + medium.id}
                                      checked={medium.selected}
                                      onChange={(e) =>
                                        toggleSelect(
                                          medium.id,
                                          e.target.checked
                                        )
                                      }
                                    />
                                    <label htmlFor={"media_" + medium.id}>
                                      Select
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  }
                </TabPanel> */}
              </Tabs>
            )}
          </div>
        </Card.Body>
        <Card.Footer>
          <Row>
            <Col md={12} className="text-right">
              <Button
                className="modal-confirm mr-2 "
                style={{ width: "100px" }}
                onClick={() => closeModal(true)}
                variant="dark"
              >
                Set
              </Button>
              <Button
                className="modal-dismiss"
                variant="default"
                onClick={() => closeModal(false)}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
      <ToastContainer
        className="ui-pnotify"
        closeButton={false}
        closeOnClick={false}
        draggable={false}
        position="top-right"
        hideProgressBar={true}
        autoClose={3000}
        containerId="modal"
        enableMultiContainer={true}
      />
    </Modal>
  );
}
