import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Drawer, Form, Input, message, List } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { baseUrl } from '../App';
import '../styles/SingleCourse.css';

const SingleCourse = () => {
    const [courseData, setCourseData] = useState(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [isEditingMode, setIsEditingMode] = useState(false);
    const [currentEditingTopic, setCurrentEditingTopic] = useState(null);
    const [form] = Form.useForm();
    const { courseId } = useParams();
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    const userRole = userData.role;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await axios.get(`${baseUrl}/courses/${courseId}`, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                setCourseData(response.data.course);
            } catch (error) {
                console.error('Error fetching course:', error);
            }
        };
        fetchCourseData();
    }, [courseId, token]);

    const handleEnrollCourse = async () => {
        try {
            const response = await axios.put(`${baseUrl}/courses/enroll/${courseId}`, {}, {
                headers: {
                    Authorization: `${token}`
                }
            });
            message.success(response.data.message);
            navigate("/allCourses");
        } catch (error) {
            message.error('Failed to enroll in the course. Please try again.');
        }
    };

    const handleShowDrawer = () => {
        setIsEditingMode(false);
        setIsDrawerVisible(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerVisible(false);
        form.resetFields();
    };

    const handleAddTopics = async (values) => {
        try {
            const response = await axios.post(`${baseUrl}/courses/${courseId}/topics`, { topics: [values] }, {
                headers: {
                    Authorization: `${token}`
                }
            });
            message.success(response.data.message);
            setCourseData(response.data.course);
            setIsDrawerVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Failed to add material. Please try again.');
        }
    };

    const handleEditCourse = () => {
        setIsEditingMode(true);
        form.setFieldsValue({
            courseName: courseData.courseName,
            description: courseData.description
        });
        setIsDrawerVisible(true);
    };

    const handleUpdateCourse = async (values) => {
        try {
            const response = await axios.put(`${baseUrl}/courses/${courseId}`, values, {
                headers: {
                    Authorization: `${token}`
                }
            });
            message.success(response.data.message);
            setCourseData(response.data.course);
            setIsDrawerVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Error updating course:', error);
            message.error('Failed to update course. Please try again.');
        }
    };

    const handleEditTopic = (topic) => {
        setIsEditingMode(true);
        setCurrentEditingTopic(topic);
        form.setFieldsValue({
            title: topic.title,
            url: topic.url
        });
        setIsDrawerVisible(true);
    };

    const handleUpdateTopic = async (values) => {
        try {
            const response = await axios.put(`${baseUrl}/courses/${courseId}/topics/${currentEditingTopic._id}`, values, {
                headers: {
                    Authorization: `${token}`
                }
            });
            message.success(response.data.message);
            setCourseData(response.data.course);
            setIsDrawerVisible(false);
            form.resetFields();
            setCurrentEditingTopic(null);
        } catch (error) {
            console.error('Error updating topic:', error);
            message.error('Failed to update topic. Please try again.');
        }
    };

    const handleDeleteCourse = async () => {
        try {
            await axios.delete(`${baseUrl}/courses/${courseId}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            message.success('Course deleted successfully');
            navigate("/allCourses");
        } catch (error) {
            console.error('Error deleting course:', error);
            message.error('Failed to delete course. Please try again.');
        }
    };

    const renderActionButton = () => {
        if (userRole === 'student') {
            return <Button size="small" type="primary" onClick={handleEnrollCourse}>Enroll</Button>;
        } else {
            return (
                <>
                    <Button  size="small" type="primary" onClick={handleShowDrawer}>Add Topics</Button>
                    <Button size="small" type="primary" onClick={handleEditCourse} style={{ marginLeft: 8 }}>Edit Course</Button>
                    <Button type="primary" size="small" danger onClick={handleDeleteCourse} style={{ marginLeft: 8 }}>Delete Course</Button>
                </>
            );
        }
    };

    return (
        <div className="single-course">
            {courseData && (
                <Card className="single-course-card">
                    <h2 className="single-course-name">{courseData.courseName}</h2>
                    <p className="single-course-description">{courseData.description}</p>
                    <div className="single-course-topics">
                        <List
                            dataSource={courseData.topics}
                            renderItem={(material) => (
                                <List.Item
                                    actions={userRole === 'instructor' ? [<EditOutlined onClick={() => handleEditTopic(material)} />] : []}
                                >
                                    <List.Item.Meta
                                        title={<a href={material.url} target="_blank" rel="noopener noreferrer">{material.title}</a>}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                    <div className="single-course-action-buttons">{renderActionButton()}</div>
                    <Link to="/allCourses" className="single-course-back-link">Back to All Courses</Link>
                </Card>
            )}
            <Drawer
                title={isEditingMode ? (currentEditingTopic ? "Edit Topic" : "Edit Course") : "Add Material"}
                placement="right"
                closable={false}
                onClose={handleCloseDrawer}
                visible={isDrawerVisible}
            >
                <Form form={form} onFinish={isEditingMode ? (currentEditingTopic ? handleUpdateTopic : handleUpdateCourse) : handleAddTopics} layout="vertical">
                    {isEditingMode && !currentEditingTopic ? (
                        <>
                            <Form.Item
                                name="courseName"
                                label="Course Name"
                                rules={[{ required: true, message: 'Please enter the course name' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: 'Please enter the description' }]}
                            >
                                <Input />
                            </Form.Item>
                        </>
                    ) : (
                        <>
                            <Form.Item
                                name="title"
                                label="Title"
                                rules={[{ required: true, message: 'Please enter the title' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="url"
                                label="URL"
                                rules={[{ required: true, message: 'Please enter the URL' }]}
                            >
                                <Input />
                            </Form.Item>
                        </>
                    )}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">{isEditingMode ? (currentEditingTopic ? "Update Topic" : "Update Course") : "Submit"}</Button>
                        <Button onClick={handleCloseDrawer} style={{ marginLeft: 8 }}>Cancel</Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default SingleCourse;
