import React, { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/login-register.css";
const { Text } = Typography;

const RegisterForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (formData) => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/user/register", formData);
            if (response.data.status === "success") {
                message.success(response.data.message);
                navigate('/login');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
        setLoading(false);
    };

    return (
        <div className='form-container'>
            <div className="register-image-container"></div>
            <div className="form-content">
                <Form form={form} onFinish={onFinish}>
                    <Form.Item name='fullname' rules={[{ required: true, message: 'Please add Full Name' }]}>
                        <Input className="form-input" placeholder="Full Name" />
                    </Form.Item>
                    <Form.Item name='email' rules={[{ required: true, type: 'email', message: 'Please add valid Email' }]}>
                        <Input className="form-input" placeholder='Enter Email' />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'Please enter Password' }]}>
                        <Input.Password className="form-input" placeholder="Enter Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" className="form-button" loading={loading} htmlType="submit">Register</Button>
                    </Form.Item>
                    <div className="account-link-container">
                        <Text className="account-link-text">Already Have Account</Text>
                        <Link to="/login" className='form-link-btn'>Login</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default RegisterForm;
