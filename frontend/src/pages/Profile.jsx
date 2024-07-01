import React, { useEffect, useState } from 'react';
import { Button, Modal, Input, Form, Upload, message, Spin } from 'antd';
import {
    LogoutOutlined,
    IdcardOutlined,
    ReadOutlined,
    MailOutlined,
    PhoneOutlined,
    TeamOutlined,
    GlobalOutlined,
    EditOutlined,
    DeleteOutlined,
    FacebookOutlined,
    LinkedinOutlined,
    GithubOutlined,
    LinkOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';
import { baseUrl } from '../App';

const Profile = () => {
    const [activeQualification, setActiveQualification] = useState('Credential');
    const [activeMembership, setActiveMembership] = useState('Groups');
    const [editMode, setEditMode] = useState(false);
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const userId = localStorage.getItem("userId");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const handleLogout = () => {
        Modal.confirm({
            title: 'Confirm Logout',
            content: 'Are you sure you want to log out?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                navigate('/login');
            },
        });
    };

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/user/${userId}`);
            setUser(response.data);
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
        setLoading(false);
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await axios.delete(`${baseUrl}/user/${user._id}`);
            Modal.confirm({
                title: 'Confirm Delete Account',
                content: 'Are you sure you want to Delete Account?',
                okText: 'Yes',
                cancelText: 'No',
                onOk: () => {
                    message.success(response.data.message);
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    navigate('/login');
                },
            });

        } catch (error) {
            message.error(error.response?.data?.message);
        }
    };

    const onFinish = async (formData) => {
        try {
            const { firstname, lastname, phoneNumber, facebook, linkedin, github, personalWebsite, profilePic } = formData;

            const updatedData = new FormData();
            updatedData.append('firstname', firstname);
            updatedData.append('lastname', lastname);
            updatedData.append('phoneNumber', phoneNumber);
            updatedData.append('facebook', facebook);
            updatedData.append('linkedin', linkedin);
            updatedData.append('github', github);
            updatedData.append('personalWebsite', personalWebsite);

            if (profilePic) {
                updatedData.append('profilePic', profilePic.file.originFileObj);
            }

            const response = await axios.put(`${baseUrl}/user/updateDetails/${user._id}`, updatedData);
            message.success(response.data.message);
            fetchUserDetails()
            setEditMode(false);
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to update user details. Please try again later.");
        }
    };

    const toggleEditMode = () => {
        if (user) {
            form.setFieldsValue({
                firstname: user.firstname,
                lastname: user.lastname,
                phoneNumber: user.phoneNumber,
                email: user.email,
                facebook: user.socials?.facebook || '',
                linkedin: user.socials?.linkedin || '',
                github: user.socials?.github || '',
                personalWebsite: user.socials?.personalWebsite || '',
            });
            setEditMode(!editMode);
        }
    };

    return (
        <div className="profile-container">
            {loading ? <Spin className="loading-spinner" /> : (
                <>
                    <div className="banner">
                        <div className="banner-content">
                            <div className="profile-picture">
                                <img src={user.profilePic ? `${baseUrl}/uploads/profilePics/${user.profilePic}` : 'https://via.placeholder.com/130'} alt="Profile Pic" />
                                <h2>{user.firstname} {user.lastname}</h2>
                            </div>
                            <div className="logout-delete-button">
                                <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
                                    Logout
                                </Button>
                                <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleDeleteAccount} >
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="info-container">
                        <div className="left-container">
                            <div className="about-container">
                                <div className="info-heading">
                                    <h2>About</h2>
                                    {!editMode && <Button size='small' type='primary' onClick={toggleEditMode}>Edit</Button>}
                                </div>
                                {editMode ? (
                                    <Form form={form} onFinish={onFinish} layout="vertical">
                                        <Form.Item name="profilePic">
                                            <Upload style={{ width: "100%" }}>
                                                <Button icon={<EditOutlined />}>Click to Upload</Button>
                                            </Upload>
                                        </Form.Item>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <Form.Item name="firstname" rules={[{ required: true, message: 'Please enter your first name' }]}>
                                                <Input placeholder='Enter FirstName' />
                                            </Form.Item>
                                            <Form.Item name="lastname" rules={[{ required: true, message: 'Please enter your last name' }]}>
                                                <Input placeholder='Enter LastName' />
                                            </Form.Item>
                                        </div>
                                        <Form.Item name="email">
                                            <Input placeholder='Enter Email' disabled />
                                        </Form.Item>
                                        <Form.Item name="phoneNumber" rules={[{ required: true, message: 'Please enter your phone number' }]}>
                                            <Input placeholder='Enter Phone Number' />
                                        </Form.Item>
                                        <Form.Item name="facebook">
                                            <Input prefix={<FacebookOutlined />} placeholder="Facebook link" />
                                        </Form.Item>
                                        <Form.Item name="linkedin">
                                            <Input prefix={<LinkedinOutlined />} placeholder="LinkedIn link" />
                                        </Form.Item>
                                        <Form.Item name="github">
                                            <Input prefix={<GithubOutlined />} placeholder="GitHub link" />
                                        </Form.Item>
                                        <Form.Item name="personalWebsite">
                                            <Input prefix={<LinkOutlined />} placeholder="Personal Website link" />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">Save</Button>
                                            <Button type="primary" danger onClick={toggleEditMode} style={{marginLeft:"10px"}}>Cancel</Button>
                                        </Form.Item>
                                    </Form>
                                ) :
                                    <div className="info-content">
                                        <div className='info-items'>
                                            <i class="fa-solid fa-envelope"></i>
                                            <p><b>{user.email}</b></p>
                                        </div>
                                        <div className='info-items'>
                                            <i class="fa-solid fa-phone"></i>
                                            <p><b>{user.phoneNumber}</b></p>
                                        </div>
                                        <div className='info-items'>
                                            {user.socials?.facebook && <a href={user.socials.facebook} target="_blank"><i class="fa-brands fa-square-facebook"></i></a>}
                                            {user.socials?.linkedin && <a href={user.socials.linkedin} target="_blank"><i class="fa-brands fa-linkedin"></i></a>}
                                            {user.socials?.github && <a href={user.socials.github} target="_blank" ><i class="fa-brands fa-github"></i></a>}
                                            {user.socials?.personalWebsite && <a href={user.socials.personalWebsite} target="_blank" ><i class="fa-solid fa-link"></i></a>}
                                        </div>
                                    </div>}
                            </div>
                            <div className="membership-container">
                                <h2 className="info-heading">Membership</h2>
                                <div className="button-group">
                                    <Button type={activeMembership === 'Groups' ? "primary" : "default"}
                                        onClick={() => setActiveMembership('Groups')}
                                        icon={<TeamOutlined />}> Groups
                                    </Button>

                                    <Button type={activeMembership === "Sites" ? "primary" : "default"}
                                        onClick={() => setActiveMembership('Sites')}
                                        icon={<GlobalOutlined />} > Sites
                                    </Button>
                                </div>
                                <img src="https://app.au.safetyculture.com/static/apps/iauditor/media/generic-light.5e6454fd..svg" alt="" />
                                <div className="info-content">
                                    {activeMembership === "Groups" && (
                                        <div>
                                            <p>Groups data goes here.</p>
                                        </div>
                                    )}
                                    {activeMembership === "Sites" && (
                                        <div>
                                            <p>Sites data goes here.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="qualification-container">
                            <h2 className="info-heading">Qualifications</h2>
                            <div className="button-group">
                                <Button
                                    type={activeQualification === 'Credential' ? 'primary' : 'default'}
                                    onClick={() => setActiveQualification('Credential')}
                                    icon={<IdcardOutlined />}> Credential
                                </Button>
                                <Button
                                    type={activeQualification === 'Training' ? 'primary' : 'default'}
                                    onClick={() => setActiveQualification('Training')}
                                    icon={<ReadOutlined />}> Training
                                </Button>
                            </div>
                            <Input placeholder="Search qualifications" enterButton style={{ marginTop: '10px' }} />
                            <img src="https://app.au.safetyculture.com/static/apps/iauditor/media/generic-light.5e6454fd..svg" alt="" />
                            <div className="info-content">
                                {activeQualification === 'Credential' && (
                                    <div>
                                        <p>Credential data goes here.</p>
                                    </div>
                                )}
                                {activeQualification === 'Training' && (
                                    <div>
                                        <p>Training data goes here.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Profile;
