


import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import withRouter from '../../common/WithRouter';
import { useNavigate } from 'react-router-dom';
import { Formik, Field } from 'formik';
import { LoginValidationSchema } from 'src/validations/validationSchemas';
import { useResetPassword } from 'src/services/auth.service';
import { toast, ToastContainer } from 'react-toastify';
import * as Yup from "yup";


function ResetPassword(props) {
    const navigate = useNavigate();
    const { mutateAsync: resetPassword } = useResetPassword();

    const [rememberMe, setRememberMe] = useState(false);
    const [initialValues, setInitialValues] = useState({
        newPassword: "",

    });

    const OTPValidationSchema = Yup.object().shape({
        newPassword: Yup.string().required("password is required"),
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


            const res = await resetPassword({
                newPassword: values?.newPassword,
                emailOrPhoneNumber: parsed?.emailOrPhoneNumber
            });

            if (res?.status === 200) {


                toast(res?.data?.message, {
                    containerId: "default",
                    className: "no-icon notification-success",
                });

                 navigate("/sign-in")

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
                        <h2 className="sign-title">Reset Password</h2>


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
                                            Password <span className="required">*</span>
                                        </Form.Label>

                                        <Field
                                            as={Form.Control}
                                            type="password"
                                            name="newPassword"
                                            value={values.newPassword}
                                            onChange={handleChange}
                                            className={
                                                errors.newPassword && touched.newPassword
                                                    ? "is-invalid"
                                                    : ""
                                            }
                                        />

                                        {errors.newPassword && touched.newPassword && (
                                            <p style={{ color: "red" }}>
                                                {errors.newPassword}
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

export default React.memo(withRouter(ResetPassword));
