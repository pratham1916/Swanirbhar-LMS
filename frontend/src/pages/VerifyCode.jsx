// VerifyCode.js
import React, { useEffect, useState } from 'react';
import logo from "../images/logo.webp";
import otp1 from "../images/otp-1.png";
import otp2 from "../images/otp-2.png";
import otp3 from "../images/otp-3.png";
import { Button, Form, Input, Typography, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import axios from 'axios';
import { baseUrl } from '../App';

const { Text } = Typography;

const VerifyCode = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [ReSendloading, setReSendLoading] = useState(false);
    const email = new URLSearchParams(location.search).get('email');
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const userDetails = async () => {
            try {
                const user = await axios.get(`${baseUrl}/user/verifyOTP/${email}`);
                setUserData(user.data)
            } catch (error) {
                if (error.response && error.response.data) {
                    message.error(error.response.data.message);
                }
            }
        }
        userDetails();
    }, [])

    const handleVerify = (values) => {
        setLoading(true);
        const enteredOTP = values.otp;
        const storedOTP = userData.resetPasswordOTP
        

        if (enteredOTP === storedOTP) {
            message.success('OTP Verified');
            navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        } else {
            message.error('Incorrect OTP. Please try again.');
        }
        setLoading(false)
    };

    const handleResend = async () => {
        setReSendLoading(true);
        const otp = generateOTP();

        try {
            const response = await axios.post(`${baseUrl}/user/sendOTP`, { email, otp });
            message.success(response.data.message);
            localStorage.setItem('otp', otp);
        } catch (error) {
            message.error(error.response.data.message);
        }
        setReSendLoading(false)
    };

    return (
        <div className="body-container">
            <div className='form-container'>
                <div className="login-product-logo">
                    <img src={logo} alt="Logo" />
                </div>
                <div className="form-content">
                    <div className="form-data">
                        <div className='back-to-login-container'>
                            <Link className='back-to-login' to="/login">
                                <span className='arrow'>&lt;</span>
                                Back to login
                            </Link>
                        </div>
                        <h2 className="form-heading">Verify Code</h2>
                        <p className="form-description">An authentication code has been sent to your email.</p>
                        <Form form={form} layout="vertical" onFinish={handleVerify}>
                            <Form.Item
                                name="otp"
                                rules={[{ required: true, message: 'Please enter OTP!' }]}
                            >
                                <Input.OTP className="form-input" placeholder="Enter Code" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" className="form-button" loading={loading} htmlType="submit">Verify</Button>
                            </Form.Item>
                            <div className="resend-container">
                                <Text className="account-link-text">Didn’t receive a code?</Text>
                                <Button type='link' className='form-link-btn' onClick={handleResend} loading={ReSendloading}>Resend</Button>
                            </div>
                        </Form>
                    </div>

                    <div className="image-slider">
                        <Carousel autoPlay infiniteLoop showIndicators={false} showThumbs={false} showArrows={false} showStatus={false}>
                            <div>
                                <img src={otp1} alt="Slide 1" />
                            </div>
                            <div>
                                <img src={otp2} alt="Slide 2" />
                            </div>
                            <div>
                                <img src={otp3} alt="Slide 3" />
                            </div>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyCode;
