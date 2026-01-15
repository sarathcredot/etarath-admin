
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import withRouter from '../../common/WithRouter';
import { useNavigate } from 'react-router-dom';
import { Formik, Field } from 'formik';
import { LoginValidationSchema } from 'src/validations/validationSchemas';
import { useLogin } from 'src/services/auth.service';
import { toast, ToastContainer } from 'react-toastify';

function SignIn(props) {
    const navigate = useNavigate();
    const { mutateAsync: login } = useLogin();

    const [rememberMe, setRememberMe] = useState(false);
    const [initialValues, setInitialValues] = useState({
        emailOrPhoneNumber: "",
        password: "",
        role: "admin",
    });

    // Load remembered credentials
    useEffect(() => {
        const savedCredentials = localStorage.getItem("rememberMeCredentials");

        if (savedCredentials) {
            const parsed = JSON.parse(savedCredentials);

            setInitialValues({
                emailOrPhoneNumber: parsed.emailOrPhoneNumber || "",
                password: parsed.password || "",
                role: "admin",
            });

            setRememberMe(true);
        }

        const body = document.querySelector('body');
        body.classList.add('loaded');

        return () => {
            body.classList.remove('loaded');
        };
    }, []);

    const handleSubmitForm = async (values, { setSubmitting }) => {
        try {
            const res = await login(values);

            if (res?.status === 200) {

                if (rememberMe) {
                    localStorage.setItem(
                        "rememberMeCredentials",
                        JSON.stringify({
                            emailOrPhoneNumber: values.emailOrPhoneNumber,
                            password: values.password,
                        })
                    );
                } else {
                    localStorage.removeItem("rememberMeCredentials");
                }

                toast(res?.data?.message, {
                    containerId: "default",
                    className: "no-icon notification-success",
                });

                navigate("/");
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

    const handleRememberMe = (event) => {
        setRememberMe(event.target.checked);
    };

    return (
        <section className="body-sign">
            <div className="center-sign">
                <Card className="card-sign">
                    <Card.Body>
                        <h2 className="sign-title">Sign In</h2>

                        <Formik
                            enableReinitialize
                            initialValues={initialValues}
                            validationSchema={LoginValidationSchema}
                            onSubmit={handleSubmitForm}
                        >
                            {({ errors, touched, handleChange, values, handleSubmit, isSubmitting }) => (
                                <Form onSubmit={handleSubmit}>

                                    {/* Email */}
                                    <Form.Group className="form-custom-group">
                                        <Form.Label>
                                            Email Address <span className="required">*</span>
                                        </Form.Label>

                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            name="emailOrPhoneNumber"
                                            value={values.emailOrPhoneNumber}
                                            onChange={handleChange}
                                            className={
                                                errors.emailOrPhoneNumber && touched.emailOrPhoneNumber
                                                    ? "is-invalid"
                                                    : ""
                                            }
                                        />

                                        {errors.emailOrPhoneNumber && touched.emailOrPhoneNumber && (
                                            <p style={{ color: "red" }}>
                                                {errors.emailOrPhoneNumber}
                                            </p>
                                        )}
                                    </Form.Group>

                                    {/* Password */}
                                    <Form.Group className="form-custom-group">
                                        <Form.Label>
                                            Password <span className="required">*</span>
                                        </Form.Label>

                                        <Field
                                            as={Form.Control}
                                            type="password"
                                            name="password"
                                            value={values.password}
                                            onChange={handleChange}
                                            className={
                                                errors.password && touched.password
                                                    ? "is-invalid"
                                                    : ""
                                            }
                                        />

                                        {errors.password && touched.password && (
                                            <p style={{ color: "red" }}>
                                                {errors.password}
                                            </p>
                                        )}
                                    </Form.Group>

                                    {/* Remember Me */}
                                    <Row className="mb-3">
                                        <Col sm={8}>
                                            <Form.Check
                                                type="checkbox"
                                                id="rememberMe"
                                                label="Remember me"
                                                checked={rememberMe}
                                                onChange={handleRememberMe}
                                            />
                                        </Col>
                                    </Row>


                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        // className="btn-login mt-3"
                                        className='btn-black'
                                        style={{ width: "100%" , marginBottom: "10px"}}
                                        block
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                                    </button>

                                </Form>
                            )}
                        </Formik>

                        <span onClick={()=>{navigate("/forgot-password")}} style={{ cursor: "pointer" }} > Forgot Password   </span>


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

export default React.memo(withRouter(SignIn));
