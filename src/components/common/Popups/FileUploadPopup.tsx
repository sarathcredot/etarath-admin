import { Dispatch, SetStateAction, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { PLANS, PLANS_TYPE } from "src/common/constant.common";
import PtDropzone from "src/components/features/elements/dropzone";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  submit: (files: any[]) => void;
  multiple: boolean;
  availableForPlan: PLANS_TYPE;
  setAvailableForPlan: Dispatch<SetStateAction<PLANS_TYPE>>;
};

const FileUploadPopup = ({
  isOpen,
  toggle,
  submit,
  multiple = false,
  availableForPlan,
  setAvailableForPlan,
}: Props) => {
  const [files, setFiles] = useState<any[]>([]);

  return (
    <>
      <Modal show={isOpen} onHide={toggle} centered={true} size="lg">
        <Modal.Header>
          <h3 className="my-2">Upload Image</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-wrapper">
            {/* <div className="modal-text">
                <p className="mb-0">{text}</p>
              </div> */}
            <PtDropzone
              multiple={multiple}
              onUpload={(files: any) => setFiles(files)}
              onRemove={(index: number) =>
                setFiles((prev) => prev.filter((_, i) => i !== index))
              }
            />
            <Form.Group className="align-items-center">
              <Form.Label className="col-form-label">
                Available For Plan
              </Form.Label>
              <Form.Control
                style={{ color: "#000" }}
                //   size="md"
                as="select"
                name="sportsType"
                value={availableForPlan}
                onChange={(e) =>
                  setAvailableForPlan(e.target.value as PLANS_TYPE)
                }
              >
                {(Object.keys(PLANS) as Array<keyof typeof PLANS>).map(
                  (plan) => (
                    <option key={plan} value={PLANS[plan]}>
                      {plan}
                    </option>
                  )
                )}
              </Form.Control>
              {/* <Form.Control.Feedback type="invalid">
                {formik.errors.sportsType}
              </Form.Control.Feedback> */}
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Row>
            <Col md={12} className="text-right">
              <Button variant="default" onClick={toggle} className="mr-2">
                Cancel
              </Button>
              <Button
                variant="dark"
                onClick={() =>
                  files.length > 0 && submit(files.map((f) => f.file))
                }
                style={{ background: "#000" }}
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

export default FileUploadPopup;
