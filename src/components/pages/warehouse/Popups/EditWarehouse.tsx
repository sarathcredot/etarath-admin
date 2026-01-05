import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { WarehouseValidationSchema } from "src/validations/validationSchemas";
import { generateFilePath } from "src/services/url.service";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { uploadFile } from "src/services/fileUpload.service";
import { useUpdateWarehouse } from "src/services/warehouse.service";
import { Country, State, City } from 'country-state-city';
import { Select } from "antd";



type Props = {
  isOpen: boolean;
  toggle: () => void;
  warehouseId: any;
  vendorId: any
  data?: any
};

const EditWarehouse = ({ isOpen, toggle, vendorId, warehouseId, data }: Props) => {
  //DATA
  // const { data: organiser } = useGetOrganiserById(organiserId, !!organiserId);

  //MUTATION
  // const { mutateAsync: updateOrganiser } = useUpdateOrganiser();

  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  const { mutateAsync: updatewaerehouse } = useUpdateWarehouse();


  const [locations, setLocations] = useState<{ label: string; value: string }[]>([]);
  const uaeCountry: any = Country.getAllCountries().find(c => c.isoCode === "AE"); // UAE country code
  const allCities: { label: string; value: string }[] = [];
  const res = State.getStatesOfCountry(uaeCountry.isoCode)
  useEffect(() => {
    res?.map((state) => {
      City.getCitiesOfState(uaeCountry.isoCode, state.isoCode).forEach((city) => {
        // allCities.push({
        //   label: `${city.name}, ${state.name}`, // optional: add state
        //   value: city.name,
        // });
        allCities.push({ label: city.name, value: city.name })
      });
    })
    console.log("loc", allCities)
    setLocations(allCities)
  }, [])


  //HANDLERS
  const handleEditExecutive = async (values: any) => {
    console.log("edit")
    try {
      if (typeof values?.shop_photo_logo !== "string") {
        let formData = new FormData();
        formData.append("file", values?.shop_photo_logo.file);
        let response = await uploadFile(formData);
        values.shop_photo_logo = response.data.data;
      }

      const res = await updatewaerehouse({
        vendorId,
        warehouseId,
        data: values
      });

      toast(res?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });
      formik.resetForm();
      toggle();

    } catch (error) {
      toast("Can't update Warehouse right now, please try again later!", {
        containerId: "default",
        className: "no-icon notification-warning",
      });
      toggle();
    }
  };

  //FORM
  const formik = useFormik({
    initialValues: {
      shop_name: data?.shop_name,
      shop_photo_logo: data?.shop_photo_logo || " ",
      location: data?.location,
      address: data?.address
    },
    validationSchema: WarehouseValidationSchema,
    enableReinitialize: true,
    onSubmit: handleEditExecutive,
  });

  return (
    <>
      <Modal
        show={isOpen}
        onHide={toggle}
        centered
      // size="lg"
      >
        <Modal.Header>
          <h3 className="my-2">Edit warehouse Executive</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body className="pb-4">
            <Row className="px-3">

              <div style={{ width: "200px" }} className="user_image_div mt-1">
                <img
                  // src={generateFilePath(img)}
                  src={
                    typeof formik.values.shop_photo_logo === "string"
                      ? generateFilePath(formik.values.shop_photo_logo)
                      : formik.values.shop_photo_logo.copy_link
                        ? formik.values.shop_photo_logo.copy_link
                        : URL.createObjectURL(formik.values.shop_photo_logo?.file)
                  }
                  alt="brand logo"
                  width={"100%"}
                  height={"100%"}
                  style={{ objectFit: "cover" }}
                // crossOrigin="anonymous"
                />
                <div
                  onClick={() => setIsUploadOpen(true)}
                  className="edit_div"
                >
                  <i className="bx bxs-edit fa "></i>
                </div>
              </div>

              <Col lg={12} className="px-4 py-1">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Shop Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter shop name"
                    autoFocus
                    name="shop_name"
                    value={formik.values.shop_name}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!(formik.errors.shop_name && formik.touched.shop_name)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.shop_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={12} className="px-4 py-1">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Location
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Location"
                    name="location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    disabled
                    isInvalid={
                      !!(
                        formik.errors.location && formik.touched.location
                      )
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.location}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col lg={12} className="px-4 py-1">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Address
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}

                    isInvalid={
                      !!(
                        formik.errors.address && formik.touched.address
                      )
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>


              {/* <Col lg={6} className="px-2 py-1">
                <Form.Label className="col-form-label">Shop Location</Form.Label>

                <Select
                  options={locations}
                  placeholder="Select Shop Location"

                  value={
                    locations.find(
                      (opt) => opt.value === formik.values.location
                    ) || null
                  }

                  onChange={(selected) => {
                    formik.setFieldValue("location", selected?.value);
                  }}

                  onBlur={() => formik.setFieldTouched("location", true)}
                />

                {formik.touched.location && formik.errors.location && (
                  <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
                    {formik.errors.location}
                  </div>
                )}
              </Col>
 */}






            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Col md={12} className="text-right">
                <Button variant="default" onClick={toggle} className="mr-2">
                  Cancel
                </Button>
                <Button
                  variant="dark"
                  type="submit"
                // style={{ background: "#000" }}
                >
                  Confirm
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
      <MediaGalleryModal
        isOpen={isUploadOpen}
        onClose={(files: any) => {
          if (files.length > 0) {
            formik.setFieldValue("shop_photo_logo", files[0]);
          }
          setIsUploadOpen(!isUploadOpen);
        }}
        objectFit="contain"
        chooseOne={true}
      />
    </>

  );
};

export default EditWarehouse;
