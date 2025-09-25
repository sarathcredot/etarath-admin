import React from "react";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  submit: () => void;
  text:string;
};

const ConfirmationPopup = ({ isOpen, toggle,submit,text }: Props) => {
  return (
    <>
      <Modal
        show={isOpen}
        onHide={toggle}
        centered={true}
      >
          <Modal.Header>
            {/* <Modal.Title>Are you sure?</Modal.Title> */}
            <h3 className="my-2">Are you sure?</h3>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-wrapper">
              <div className="modal-text">
                <p className="mb-0">{text}</p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Col
                md={12}
                className="text-right"
              >
                <Button
                  variant="default"
                  onClick={toggle}
                  className="mr-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="dark"
                  onClick={submit}
                  style={{background:"#000"}}
                  >
                  Confirm
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmationPopup;
