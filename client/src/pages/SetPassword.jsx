import React, { useState } from 'react';
import logo from "../images/logo.webp";
import resetPassword1 from "../images/reset-password-1.png";
import resetPassword2 from "../images/reset-password-2.png";
import resetPassword3 from "../images/reset-password-3.png";
import { Button, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import axios from 'axios';
import { baseUrl } from '../App';


const SetPassword = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const email = new URLSearchParams(location.search).get('email');

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.put(`${baseUrl}/user/resetPassword`, { email, newPassword: values.newPassword });
            message.success(response.data.message);
            navigate('/login');
        } catch (error) {
            message.error(error.response.data.message);
        }
        setLoading(false);
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
                                <span className='arrow'><i class="fa-solid fa-less-than"></i></span>
                                Back to login
                            </Link>
                        </div>
                        <h2 className="form-heading">Set a password</h2>
                        <p className="form-description">Your previous password has been reset. Please set a new password for your account.</p>
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Form.Item
                                name="newPassword"
                                rules={[
                                    { required: true, message: 'Required Field' },
                                    { min: 8, message: 'Must have at least 8 characters' }
                                ]}
                            >
                                <Input.Password className="form-input" placeholder="New Password" />
                            </Form.Item>
                            <Form.Item
                                name="confirmPassword"
                                dependencies={['newPassword']}
                                hasFeedback
                                rules={[
                                    { required: true, message: 'Required Field' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('The two passwords do not match.');
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password className="form-input" placeholder="Confirm Password" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" className="form-button" loading={loading} htmlType="submit">Set Password</Button>
                            </Form.Item>
                        </Form>
                    </div>

                    <div className="image-slider">
                        <Carousel autoPlay infiniteLoop showIndicators={false} showThumbs={false} showArrows={false} showStatus={false}>
                            <div>
                                <img src={resetPassword1} alt="Slide 1" />
                            </div>
                            <div>
                                <img src={resetPassword2} alt="Slide 2" />
                            </div>
                            <div>
                                <img src={resetPassword3} alt="Slide 3" />
                            </div>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetPassword;
