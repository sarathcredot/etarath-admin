import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import withRouter from '../../common/WithRouter';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { LoginValidationSchema } from 'src/validations/validationSchemas';
import { Formik, Field } from 'formik';
import { useLogin } from 'src/services/auth.service';
import { toast, ToastContainer } from 'react-toastify';
function SignIn(props) {
    const navigate = useNavigate();
    const { mutateAsync: login, isLoading } = useLogin();
    useEffect(() => {
        const body = document.querySelector('body');
        body.classList.add('loaded');
        
        return () => {
            body.classList.remove('loaded');
        };
    }, []);
    
    const handleSubmitForm = async (values, { setSubmitting }) => { 
        console.log("Form values:", values);
        try {
            const res = await login(values);
            console.log("RES = ", res);
            if (res?.status === 200) {

                toast(res?.data?.message, {
                    containerId: "default",
                    className: "no-icon notification-success",
                  });
                // navigate("/dashboard");
                navigate("/vendors");
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
            console.log("ERROR = ", error?.response?.data?.message);
        }

        setSubmitting(false);
        
    };


    return (
        <section className="body-sign">
            <div className="center-sign">
                <Card className="card-sign">
                    <Card.Body>
                        <h2 className="sign-title">Sign In</h2>
                        <Formik
                            initialValues={{
                                emailOrPhoneNumber: "",
                                password: "",
                                role: "admin",
                            }}
                            validationSchema={LoginValidationSchema}
                            onSubmit={handleSubmitForm}
                        >
                            {({ errors, touched, handleChange, values, handleSubmit, isSubmitting }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="form-custom-group">
                                        <Form.Label>Email Address <span className="required">*</span></Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="text"
                                            name="emailOrPhoneNumber"
                                            value={values.emailOrPhoneNumber}
                                            onChange={handleChange}
                                            className={errors.emailOrPhoneNumber && touched.emailOrPhoneNumber ? "is-invalid" : ""}
                                        />
                                        {errors.emailOrPhoneNumber && touched.emailOrPhoneNumber && (
                                            <p style={{ color: "red" }}>{errors.emailOrPhoneNumber}</p>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="form-custom-group">
                                        <Form.Label className="float-left">Password <span className="required">*</span></Form.Label>
                                        <Field
                                            as={Form.Control}
                                            type="password"
                                            name="password"
                                            value={values.password}
                                            onChange={handleChange}
                                            className={errors.password && touched.password ? "is-invalid" : ""}
                                        />
                                        {errors.password && touched.password && (
                                            <p style={{ color: "red" }}>{errors.password}</p>
                                        )}
                                    </Form.Group>
                                    <Button
                                        type="submit"
                                        className="btn-login mt-3"
                                        variant=""
                                        block
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Card.Body>
                </Card>
            </div>
            <ToastContainer
                className="ui-pnotify"
                closeButton={ false }
                closeOnClick={ false }
                draggable={ false }
                position="top-right"
                hideProgressBar={ true }
                autoClose={ 3000 }
                containerId="default"
                enableMultiContainer={ true }
            />
        </section>
    );
}

export default React.memo(withRouter(SignIn));