import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Drawer, Form, Input, message, List, Spin, Upload } from 'antd';
import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import { baseUrl, userId } from '../App';
import '../styles/SingleCourse.css';

const SingleCourse = () => {
    const [form] = Form.useForm();
    const [courseData, setCourseData] = useState(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [isEditingMode, setIsEditingMode] = useState(false);
    const [currentEditingTopic, setCurrentEditingTopic] = useState(null);
    const { courseId } = useParams();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [isEnrolled, setIsEnrolled] = useState(false);

    const fetchCourseData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/courses/${courseId}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            setCourseData(response.data.course);
            setIsEnrolled(response.data.course.enrolledUsers.some(user => user._id === userId));
        } catch (error) {
            console.error('Error fetching course:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCourseData();
    }, [courseId, userId]);

    const handleEnrollCourse = async () => {
        setLoading(true);
        try {
            const response = await axios.put(`${baseUrl}/courses/enroll/${courseId}`, {}, {
                headers: {
                    Authorization: `${token}`
                }
            });
            message.success(response.data.message);
            navigate("/dashboard/myCourses");
        } catch (error) {
            message.error(error.response.data.message);
        }
        setLoading(false);
    };

    const handleAddTopics = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/courses/${courseId}/topics`, { topics: [values] }, {
                headers: {
                    Authorization: `${token}`
                }
            });
            message.success(response.data.message);
            fetchCourseData();
            setIsDrawerVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Failed to add material. Please try again.');
        }
        setLoading(false);
    };

    const handleEditCourse = () => {
        setIsEditingMode(true);
        form.setFieldsValue({
            courseName: courseData.courseName,
            description: courseData.description,
            pricing: courseData.pricing,
        });
        setIsDrawerVisible(true);
    };

    const handleUpdateCourse = async (values) => {
        const formData = new FormData();
        formData.append('courseName', values.courseName);
        formData.append('description', values.description);
        formData.append('pricing', values.pricing);

        if (values.thumbnail && values.thumbnail.file) {
            formData.append('thumbnail', values.thumbnail.file.originFileObj);
        }

        setLoading(true);
        try {
            const response = await axios.put(`${baseUrl}/courses/${courseId}`, formData, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            message.success(response.data.message);
            fetchCourseData();
            setIsDrawerVisible(false);
            form.resetFields();
        } catch (error) {
            message.error(error.response.data.message);
        }
        setLoading(false);
    };

    const handleUpdateTopic = async (values) => {
        setLoading(true);
        try {
            const response = await axios.put(`${baseUrl}/courses/${courseId}/topics/${currentEditingTopic._id}`, values, {
                headers: {
                    Authorization: `${token}`
                }
            });
            message.success(response.data.message);
            fetchCourseData();
            setIsDrawerVisible(false);
            form.resetFields();
            setCurrentEditingTopic(null);
        } catch (error) {
            message.error(error.response.data.message);
        }
        setLoading(false);
    };

    const handleDeleteCourse = async () => {
        setLoading(true);
        try {
            await axios.delete(`${baseUrl}/courses/${courseId}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            message.success('Course deleted successfully');
            navigate("/dashboard/allCourses");
        } catch (error) {
            message.error(error.response.data.message);
        }
        setLoading(false);
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

    const handleShowDrawer = () => {
        setIsEditingMode(false);
        setIsDrawerVisible(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerVisible(false);
        form.resetFields();
    };

    const renderActionButton = () => {
        if (!isEnrolled && userId !== courseData.createdBy._id) {
            return <Button size="small" type="primary" onClick={handleEnrollCourse}>Enroll</Button>;
        } else if (userId === courseData.createdBy._id) {
            return (
                <>
                    <Button loading={loading} type="primary" onClick={handleShowDrawer}>Add Topics</Button>
                    <Button loading={loading} type="primary" onClick={handleEditCourse} style={{ marginLeft: 8 }}>Edit Course</Button>
                    <Button loading={loading} type="primary" danger onClick={handleDeleteCourse} style={{ marginLeft: 8 }}>Delete Course</Button>
                </>
            );
        }
    };

    return (
        <>
            {loading ? <Spin className="loading-spinner" /> : (
                <div className="single-course">
                    {courseData && (
                        <Card className="single-course-card">
                            <h2 className="single-course-name">{courseData.courseName}</h2>
                            <p className="single-course-description">{courseData.description}</p>
                            <div className="single-course-topics">
                                {isEnrolled ? (
                                    <>
                                        <List
                                            dataSource={courseData.topics}
                                            renderItem={(topic) => (
                                                <List.Item actions={userId === courseData.createdBy._id ? [<EditOutlined key="edit" onClick={() => handleEditTopic(topic)} />] : []}>
                                                    <List.Item.Meta
                                                        title={<a href={topic.url} target="_blank" rel="noopener noreferrer">{topic.title}</a>}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                        <div className="single-course-action-buttons">{renderActionButton()}</div>
                                    </>
                                ) : (
                                    <div className="single-course-action-buttons">{renderActionButton()}</div>
                                )}
                            </div>
                            <Link to="/dashboard/allCourses" className="single-course-back-link">Back to All Courses</Link>
                        </Card>
                    )}
                    <Drawer
                        title={isEditingMode ? (currentEditingTopic ? "Edit Topic" : "Edit Course") : "Add Material"}
                        placement="right"
                        width={500}
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
                                        <Input placeholder='Course Name' />
                                    </Form.Item>
                                    <Form.Item
                                        name="description"
                                        label="Description"
                                        rules={[{ required: true, message: 'Please enter the description' }]}
                                    >
                                        <Input.TextArea rows={8} placeholder='Description' />
                                    </Form.Item>
                                    <Form.Item
                                        name="pricing"
                                        label="Pricing"
                                        rules={[{ required: true, message: 'Please enter the pricing' }]}
                                    >
                                        <Input placeholder='Pricing' />
                                    </Form.Item>
                                    <Form.Item
                                        name="thumbnail"
                                        label="Thumbnail"
                                    >
                                        <Upload
                                            listType="picture"
                                            maxCount={1}
                                        >
                                            <Button icon={<UploadOutlined />}>Upload</Button>
                                        </Upload>
                                    </Form.Item>
                                </>
                            ) : (
                                <>
                                    <Form.Item
                                        name="title"
                                        label="Topic Title"
                                        rules={[{ required: true, message: 'Please enter the title' }]}
                                    >
                                        <Input placeholder='Topic Title' />
                                    </Form.Item>
                                    <Form.Item
                                        name="url"
                                        label="Topic URL"
                                        rules={[{ required: true, message: 'Please enter the URL' }]}
                                    >
                                        <Input placeholder='Topic URL' />
                                    </Form.Item>
                                </>
                            )}
                            <Form.Item>
                                <Button loading={loading} type="primary" htmlType="submit">{isEditingMode ? (currentEditingTopic ? "Update Topic" : "Update Course") : "Submit"}</Button>
                            </Form.Item>
                        </Form>
                    </Drawer>
                </div>
            )}
        </>
    );
};

export default SingleCourse;
