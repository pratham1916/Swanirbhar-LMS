import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/login-register.css";
import { baseUrl } from '../App';
import logo from "../images/logo.webp";
import register1 from "../images/register-1.png";
import register2 from "../images/register-2.png";
import register3 from "../images/register-3.png";
import { Carousel } from 'react-responsive-carousel';
import facebook from "../images/facebook.png";
import google from "../images/google.png";
import apple from "../images/apple.png";

const { Text } = Typography;

const RegisterForm = () => {
    const [registerForm] = Form.useForm();
    const [otpForm] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [formData, setFormData] = useState({});

    const handleVerifyOtp = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/user/verificationOTP`, values);
            message.success(response.data.message);
            setFormData(values);
            setOtpSent(true);
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
        setLoading(false);
    };

    const handleRegister = async (otpValues) => {
        setLoading(true);
        try {
            const combinedData = { ...formData, ...otpValues };
            const response = await axios.put(`${baseUrl}/user/register/${formData.email}`, combinedData);
            message.success(response.data.message);
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
        setLoading(false);
    };

    return (
        <div className="body-container">
            <div className="form-container">
                <div className="register-product-logo">
                    <img src={logo} alt="Logo" />
                </div>
                <div className="form-content">
                    <div className="image-slider">
                        <Carousel autoPlay infiniteLoop showIndicators={false} showThumbs={false} showArrows={false} showStatus={false}>
                            <div>
                                <img src={register1} alt="Slide 1" />
                            </div>
                            <div>
                                <img src={register2} alt="Slide 2" />
                            </div>
                            <div>
                                <img src={register3} alt="Slide 3" />
                            </div>
                        </Carousel>
                    </div>
                    <div className="form-data">
                        <h2 className="form-heading">Sign Up</h2>
                        <p className="form-description">Let’s get you all set up so you can access your personal account.</p>
                        {!otpSent ? (
                            <Form form={registerForm} onFinish={handleVerifyOtp} layout="vertical">
                                <div className="form-row">
                                    <Form.Item
                                        name="firstname"
                                        rules={[{ required: true, message: 'Required Field' }]}
                                        className="form-item"
                                    >
                                        <Input className="form-input" placeholder="First name" />
                                    </Form.Item>
                                    <Form.Item
                                        name="lastname"
                                        rules={[{ required: true, message: 'Required Field' }]}
                                        className="form-item"
                                    >
                                        <Input className="form-input" placeholder="Last name" />
                                    </Form.Item>
                                </div>
                                <div className="form-row">
                                    <Form.Item
                                        name="email"
                                        rules={[{ required: true, type: 'email', message: 'Required Field' }]}
                                        className="form-item"
                                    >
                                        <Input className="form-input" placeholder="Email" />
                                    </Form.Item>
                                    <Form.Item
                                        name="phoneNumber"
                                        rules={[
                                            { required: true, message: 'Required Field' },
                                            { len: 10, message: 'Must consist of 10 digits' }
                                        ]}
                                        className="form-item"
                                    >
                                        <Input className="form-input" placeholder="Phone number" />
                                    </Form.Item>
                                </div>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Required Field' },
                                        { min: 8, message: 'Password must be at least 8 characters' }
                                    ]}
                                >
                                    <Input.Password className="form-input" placeholder="Password" />
                                </Form.Item>
                                <Form.Item
                                    name="confirmPassword"
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                        { required: true, message: 'Required Field' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject();
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password className="form-input" placeholder="Confirm password" />
                                </Form.Item>
                                <Form.Item
                                    name="agreement"
                                    valuePropName="checked"
                                    rules={[
                                        { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('You must accept the agreement')) },
                                    ]}
                                >
                                    <Checkbox className="agreement">
                                        I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policies</a>
                                    </Checkbox>
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        className="form-button"
                                        loading={loading}
                                        htmlType="submit"
                                    >
                                        Send Verification Code
                                    </Button>
                                </Form.Item>
                            </Form>
                        ) : (
                            <Form form={otpForm} onFinish={handleRegister} layout="vertical">
                                <Form.Item name="verificationOTP" rules={[{ required: true, message: 'Please input the OTP sent to your email!' }]}>
                                    <Input.OTP placeholder="Enter OTP" />
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        className="form-button"
                                        loading={loading}
                                        htmlType="submit"
                                    >
                                        Verify Code and Create Account
                                    </Button>
                                </Form.Item>
                            </Form>
                        )}

                        <div className="account-link-container">
                            <Text className="account-link-text">Already have an account?</Text>
                            <Link to="/login" className="form-link-btn">Login</Link>
                        </div>

                        <div className="divider">
                            <span className="divider-text">Or Sign Up with</span>
                        </div>

                        <div className="social-icons">
                            <div className="social-icon">
                                <img src={facebook} alt="Facebook" />
                            </div>
                            <div className="social-icon">
                                <img src={google} alt="Google" />
                            </div>
                            <div className="social-icon">
                                <img src={apple} alt="Apple" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
