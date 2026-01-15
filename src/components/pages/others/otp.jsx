
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import withRouter from '../../common/WithRouter';
import { useNavigate } from 'react-router-dom';
import { Formik, Field } from 'formik';
import { LoginValidationSchema } from 'src/validations/validationSchemas';
import { useOtpVerify } from 'src/services/auth.service';
import { toast, ToastContainer } from 'react-toastify';
import * as Yup from "yup";


function OTP(props) {
    const navigate = useNavigate();
    const { mutateAsync: VerifyOtp } = useOtpVerify();

    const [rememberMe, setRememberMe] = useState(false);
    const [initialValues, setInitialValues] = useState({
        otp: "",

    });

    const OTPValidationSchema = Yup.object().shape({
        otp: Yup.string().required("OTP is required"),
        // .email("Enter a valid email address")

    });

    // Load remembered credentials
    useEffect(() => {

        const body = document.querySelector('body');
        body.classList.add('loaded');

        return () => {
            body.classList.remove('loaded');
        };
    }, []);

    const handleSubmitForm = async (values, { setSubmitting }) => {
        try {

            const savedCredentials = localStorage.getItem("passwordResetCredentials");

            if (!savedCredentials) {

                throw new Error("")
            }

            const parsed = JSON.parse(savedCredentials);


            const res = await VerifyOtp({
                otp: values?.otp,
                emailOrPhoneNumber: parsed?.emailOrPhoneNumber
            });

            if (res?.status === 200) {


                toast(res?.data?.message, {
                    containerId: "default",
                    className: "no-icon notification-success",
                });

                navigate("/reset-password")

            } else {
                toast(res?.data?.message, {
                    containerId: "default",
                    className: "no-icon notification-danger",
                });
            }
        } catch (error) {
            toast(error?.response?.data?.message, {
                containerId: "default",
                className: "no-icon notification-danger",
            });
        }

        setSubmitting(false);
    };



    return (
        <section className="body-sign">
            <div className="center-sign">
                <Card className="card-sign">
                    <Card.Body>
                        <h2 className="sign-title">Verify OTP</h2>


                        <Formik
                            enableReinitialize
                            initialValues={initialValues}
                            validationSchema={OTPValidationSchema}
                            onSubmit={handleSubmitForm}
                        >
                            {({ errors, touched, handleChange, values, handleSubmit, isSubmitting }) => (
                                <Form onSubmit={handleSubmit}>

                                    {/* Email */}
                                    <Form.Group className="form-custom-group">
                                        <Form.Label>
                                            otp <span className="required">*</span>
                                        </Form.Label>

                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            name="otp"
                                            value={values.otp}
                                            onChange={handleChange}
                                            className={
                                                errors.otp && touched.otp
                                                    ? "is-invalid"
                                                    : ""
                                            }
                                        />

                                        {errors.otp && touched.otp && (
                                            <p style={{ color: "red" }}>
                                                {errors.otp}
                                            </p>
                                        )}
                                    </Form.Group>


                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        // className="btn-login mt-3"
                                        className='btn-black'
                                        style={{ width: "100%", marginBottom: "10px" }}
                                        block
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Submiting...' : 'Submit'}
                                    </button>

                                </Form>
                            )}
                        </Formik>

                        {/* <span style={{ cursor: "pointer" }} > Sign in  </span> */}


                    </Card.Body>
                </Card>
            </div>

            <ToastContainer
                className="ui-pnotify"
                closeButton={false}
                closeOnClick={false}
                draggable={false}
                position="top-right"
                hideProgressBar={true}
                autoClose={3000}
                containerId="default"
                enableMultiContainer={true}
            />
        </section>
    );
}

export default React.memo(withRouter(OTP));
