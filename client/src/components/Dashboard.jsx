import React, { useState } from 'react';
import { Layout, Menu, Button, Input, FloatButton } from 'antd';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import AllCourses from '../pages/AllCourses';
import PrivateRoute from '../AllRoutes/PrivateRoutes';
import SingleCourse from '../pages/SingleCourse';
import MyCourses from '../pages/MyCourses';
import Assignment from '../pages/Assignment';
import SingleAssignment from '../pages/SingleAssignment';
import MyAssignment from '../pages/MyAssignment';
import MySubmission from '../pages/MySubmission';
import Profile from '../pages/Profile';
import {
    HomeOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    BookOutlined,
    FileDoneOutlined,
    FileOutlined,
    UserOutlined,
    SearchOutlined,
    SettingOutlined,
    BellOutlined,
    HeartOutlined
} from '@ant-design/icons';
import ChatBox from './ChatBox';
import logo from "../images/logo.png"
import '../styles/Dashboard.css';
import Notifications from '../pages/Notifications';
import Wishlist from '../pages/Wishlist';

const { Header, Sider, Content } = Layout;

const Dashboard = ({userDetails}) => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider
                width={250}
                className="sidebar"
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="light"
            >
                <div className="logo">
                    <img src={logo} alt="Logo" className="logo-icon" />
                    {!collapsed && <span className="logo-text">Swanirbhar</span>}
                </div>
                <div className="slider-search-container">
                    <Input
                        placeholder={collapsed ? "" : "Search"}
                        className="slider-search-bar"
                        prefix={<i class="fa-solid fa-magnifying-glass"></i>}
                    />
                </div>
                <Menu className='menu-items' selectedKeys={[location.pathname]}>
                    <Menu.Item key="/dashboard/home" icon={<HomeOutlined />}>
                        <Link to="/dashboard/home" className='navbar-link'>Home</Link>
                    </Menu.Item>
                    <Menu.Item key="/dashboard/allCourses" icon={<BookOutlined />}>
                        <Link to="/dashboard/allCourses" className='navbar-link'>All Courses</Link>
                    </Menu.Item>
                    <Menu.Item key="/dashboard/myCourses" icon={<BookOutlined />}>
                        <Link to="/dashboard/myCourses" className='navbar-link'>My Courses</Link>
                    </Menu.Item>
                    <Menu.Item key="/dashboard/wishlist" icon={<HeartOutlined />}>
                        <Link to="/dashboard/wishlist" className='navbar-link'>Wishlist</Link>
                    </Menu.Item>
                </Menu>
                <Menu className="menu-bottom" selectedKeys={[location.pathname]}>
                    <Menu.Item key="/dashboard/settings" icon={<SettingOutlined />}>
                        <Link to="/dashboard/settings" className='navbar-link'>Settings</Link>
                    </Menu.Item>
                    <Menu.Item key="/dashboard/notifications" icon={<BellOutlined />}>
                        <Link to="/dashboard/notifications" className='navbar-link'>Notifications</Link>
                    </Menu.Item>
                    <Menu.Item key="/dashboard/profile" icon={<UserOutlined />}>
                        <Link to="/dashboard/profile" className='navbar-link'>Profile</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="header">
                    <div className="header-left">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className="toggle-button"
                        />
                    </div>
                    <div className="search-container">
                        <Input placeholder="Search your course here...." className="search-bar" prefix={<i class="fa-solid fa-magnifying-glass"></i>} />
                        <i className="fa-solid fa-filter search-filter-icon"></i>
                    </div>
                </Header>
                <Content className="content">
                    <Routes>
                        <Route path="home" element={<PrivateRoute><div>Home Content</div></PrivateRoute>} />
                        <Route path="allCourses" element={<PrivateRoute><AllCourses /></PrivateRoute>} />
                        <Route path="singleCourse/:courseId" element={<PrivateRoute><SingleCourse userDetails={userDetails} /></PrivateRoute>} />
                        <Route path="myCourses" element={<PrivateRoute><MyCourses /></PrivateRoute>} />
                        <Route path="wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
                        <Route path="notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                        <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

                        <Route path="assignment" element={<PrivateRoute><Assignment /></PrivateRoute>} />
                        <Route path="myAssignment" element={<PrivateRoute><MyAssignment /></PrivateRoute>} />
                        <Route path="mySubmission" element={<PrivateRoute><MySubmission /></PrivateRoute>} />
                        <Route path="singleAssignment/:assignmentId" element={<PrivateRoute><SingleAssignment /></PrivateRoute>} />
                        
                    </Routes>
                </Content>
                <FloatButton description="Ask" className="float-button" onClick={() => setModalVisible(true)} />
                {modalVisible && <ChatBox onClose={() => setModalVisible(false)} />}
            </Layout>
        </Layout>
    );
};

export default Dashboard;