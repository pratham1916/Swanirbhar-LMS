import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Drawer, Form, Input, Spin, Pagination, message } from 'antd';
import axios from 'axios';
import { baseUrl } from '../App';
import { Link } from 'react-router-dom';
import '../styles/AllCourses.css';

const { Meta } = Card;

const AllCourses = () => {
    const [courses, setCourses] = useState([]);
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 12,
        total: 0
    });
    const userData = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize]);

    const fetchData = async (page, limit) => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/courses?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: token
                }
            });
            setCourses(response.data.courses);
            setPagination({
                ...pagination,
                total: response.data.totalData
            });
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
        setLoading(false);
    };

    const showDrawer = () => {
        setVisible(true);
    };

    const closeDrawer = () => {
        setVisible(false);
    };

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            const { courseName, description, title, url } = formData;
            const courseData = {
                courseName,
                description,
                materials: [{ title, url }]
            };
            const response = await axios.post(`${baseUrl}/courses`, courseData, {
                headers: {
                    Authorization: token
                }
            });
            const totalPages = Math.ceil((pagination.total + 1) / pagination.pageSize);
            fetchData(totalPages, pagination.pageSize);
            message.success(response.data.message)
            setVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Error creating course:', error);
        }
        setLoading(false);
    };

    const handlePageChange = (page) => {
        setPagination({ ...pagination, current: page });
    };

    return (
        <div className="all-courses-container">
            {loading ? <Spin className="loading-spinner" /> : (
                <>
                    {userData.role === 'instructor' && (
                        <Button size='small' type="primary" onClick={showDrawer} className="create-course-button">Create New Course</Button>
                    )}

                    <Row gutter={[16, 16]} className="courses-row">
                        {courses.map(course => (
                            <Col key={course._id} xs={24} sm={12} md={8} lg={6} className="course-col">
                                <Card className="course-card"
                                    actions={[
                                        <Link to={`/singleCourses/${course._id}`} className="view-course-link">View Course</Link>
                                    ]}
                                >
                                    <Meta
                                        title={course.courseName}
                                        description={
                                            <div>
                                                <p className="course-instructor">Instructor: {course.instructor.fullname}</p>
                                                <p className="course-students">Students Enrolled: {course.students.length}</p>
                                            </div>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <div className="pagination-container">
                        <Pagination
                            total={pagination.total}
                            current={pagination.current}
                            pageSize={pagination.pageSize}
                            onChange={handlePageChange}
                            showTotal={(total) => `Total ${total} Courses`}
                        />
                    </div>
                </>
            )}

            <Drawer
                title="Create New Course"
                placement="right"
                onClose={closeDrawer}
                visible={visible}
                width={400}
                className="create-course-drawer"
            >
                <Form layout="vertical" form={form} onFinish={handleSubmit} className="create-course-form">
                    <Form.Item name="courseName" rules={[{ required: true, message: 'Please enter the course name' }]}>
                        <Input placeholder='Course Name' className="form-input" />
                    </Form.Item>
                    <Form.Item name="description" rules={[{ required: true, message: 'Please enter the description' }]}>
                        <Input.TextArea placeholder='Description' className="form-textarea" />
                    </Form.Item>
                    <Form.Item name="title" rules={[{ required: true, message: 'Please enter the title' }]}>
                        <Input placeholder='Material Title' className="form-input" />
                    </Form.Item>
                    <Form.Item name="url" rules={[{ required: true, message: 'Please enter the URL' }]}>
                        <Input placeholder='Material URL' className="form-input" />
                    </Form.Item>
                    <Form.Item>
                        <Button size='small' type="primary" loading={loading} htmlType="submit" className="form-submit-button">Submit</Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default AllCourses;
