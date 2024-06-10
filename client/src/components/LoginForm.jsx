import React, { useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/login-register.css";
import { baseUrl } from '../App';
const { Text } = Typography;

const LoginForm = ({ setIsUser }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (formData) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/user/login`, formData);
            if (response.data.status === "success") {
                message.success(response.data.message);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setIsUser(true);
                navigate('/allCourses');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
        setLoading(false);
    };

    return (
        <div className="body-container">
            <div className='form-container'>
                <div className="login-image-container"></div>
                <div className="form-content">
                    <Form name="signInForm" form={form} onFinish={onFinish}>
                        <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email!' }]}>
                            <Input className="form-input" placeholder="Enter Your Email" />
                        </Form.Item>
                        <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password!' }]}>
                            <Input.Password className="form-input" placeholder="Enter password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" className="form-button" loading={loading} htmlType="submit">Login</Button>
                        </Form.Item>
                        <div className="account-link-container">
                            <Text className="account-link-text">Don't have an account?</Text>
                            <Link to="/register" className='form-link-btn'>Register</Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
