import React, { useEffect, useState } from 'react';
import { Card, Row, Button, Drawer, Form, Input, Spin, Pagination, message, Select, Upload, Empty } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons'; // Import HeartFilled for filled icon
import axios from 'axios';
import { baseUrl, userId } from '../App';
import '../styles/AllCourses.css';
import { Link } from 'react-router-dom';

const { Meta } = Card;
const { Option } = Select;

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
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        fetchCourses(pagination.current, pagination.pageSize);
        fetchWishlist(); 
    }, [pagination.current, pagination.pageSize]);

    const fetchCourses = async (page, limit) => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/courses`, {
                headers: {
                    Authorization: token
                },
                params: {
                    page,
                    limit,
                    sort: '',
                    level: ''
                }
            });
            console.log(response.data.courses);
            setCourses(response.data.courses);
            setPagination({
                ...pagination,
                total: response.data.totalData
            });
        } catch (error) {
            message.error(error.response?.data?.message || 'Error fetching courses');
        }
        setLoading(false);
    };

    const fetchWishlist = async () => {
        try {
            const response = await axios.get(`${baseUrl}/user/${userId}`, {
                headers: {
                    Authorization: token
                }
            });

            setWishlist(response.data.wishlist.map(item => item._id));
        } catch (error) {
            message.error(error.response?.data?.message);
        }
    };

    const addCourse = async (formData) => {
        setLoading(true);
        try {
            const { courseName, description, title, url, pricing, thumbnail, category, level, language, duration } = formData;

            const courseData = new FormData();
            courseData.append('courseName', courseName);
            courseData.append('description', description);
            courseData.append('topics[0][title]', title);
            courseData.append('topics[0][url]', url);
            courseData.append('pricing', parseFloat(pricing));

            if (thumbnail) {
                courseData.append('thumbnail', thumbnail[0].originFileObj);
            }

            courseData.append('category', category);
            courseData.append('level', level);
            courseData.append('language', language);
            courseData.append('duration', Number(duration));

            const response = await axios.post(`${baseUrl}/courses`, courseData, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'multipart/form-data'
                }
            });

            form.resetFields();
            setVisible(false);
            message.success(response.data.message);
            const totalPages = Math.ceil((pagination.total + 1) / pagination.pageSize);
            fetchCourses(totalPages, pagination.pageSize);

        } catch (error) {
            message.error(error.response?.data?.message || 'Error creating course');
        }
        setLoading(false);
    };

    const handleSearch = async (value) => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/courses`, {
                headers: {
                    Authorization: token
                },
                params: {
                    courseName: value,
                    sort: 'price'
                }
            });
            setCourses(response.data.courses);
            setPagination({
                ...pagination,
                total: response.data.totalData
            });
        } catch (error) {
            message.error(error.response?.data?.message || 'Error searching courses');
        }
        setLoading(false);
    };

    const handlePageChange = (page) => { setPagination({ ...pagination, current: page }); };

    const showDrawer = () => { setVisible(true); };
    const closeDrawer = () => { setVisible(false); };

    const addToWishlist = async (courseId) => {
        try {
            const response = await axios.put(`${baseUrl}/user/wishlist`, { courseId }, {
                headers: {
                    Authorization: token
                }
            });
            message.success(response.data.message);
            fetchWishlist();
        } catch (error) {
            message.error(error.response?.data?.message);
        }
    };

    const removeFromWishlist = async (courseId) => {
        try {
            const response = await axios.delete(`${baseUrl}/user/wishlist`, {
                headers: {
                    Authorization: token
                },
                data: {
                    courseId
                }
            });
            message.success(response.data.message);
            fetchWishlist();
        } catch (error) {
            message.error(error.response?.data?.message);
        }
    };

    const languages = [
        { value: 'English', label: 'English' },
        { value: 'Spanish', label: 'Spanish' },
        { value: 'French', label: 'French' },
        { value: 'German', label: 'German' },
        { value: 'Chinese', label: 'Chinese' }
    ];

    return (
        <div className="all-courses-container">
            {loading ? <Spin className="loading-spinner" /> : (
                <>
                    <div className="flex-container">
                        <Button type="primary" onClick={showDrawer} className="create-course-button">Create Course</Button>
                        <div className="pagination-container">
                            <Pagination
                                total={pagination.total}
                                current={pagination.current}
                                pageSize={pagination.pageSize}
                                onChange={handlePageChange}
                                showTotal={(total) => `Total ${total} Courses`}
                            />
                        </div>
                    </div>

                    {courses.length === 0 ? (
                        <div className="empty-results-container">
                            <Empty description="No courses found" />
                        </div>
                    ) : (
                        <Row className="courses-row">
                            {courses.map(course => (
                                <Card
                                    key={course._id}
                                    className="course-card"
                                    actions={[
                                        <Link to={`/dashboard/singleCourse/${course._id}`} className="view-course-link">View Course</Link>,
                                        wishlist.includes(course._id) ? (
                                            <HeartFilled onClick={() => removeFromWishlist(course._id)} className="wishlist-icon" />
                                        ) : (
                                            <HeartOutlined onClick={() => addToWishlist(course._id)} className="wishlist-icon" />
                                        )
                                    ]}
                                >
                                    <div className="course-image-container">
                                        <img className="course-image" src={`${baseUrl}/uploads/thumbnails/${course.thumbnail}`} alt="Course Thumbnail" />
                                    </div>
                                    <Meta
                                        title={course.courseName}
                                        description={
                                            <div>
                                                <p className="course-instructor">Instructor: {course.createdBy.firstname} {course.createdBy.lastname}</p>
                                                <p className="course-students">Students Enrolled: {course.enrolledUsers.length}</p>
                                                <p className="course-price">Price: {course.pricing}</p>
                                            </div>
                                        }
                                    />
                                </Card>
                            ))}
                        </Row>
                    )}
                </>
            )}

            <Drawer
                title="Create New Course"
                placement="right"
                onClose={closeDrawer}
                visible={visible}
                width={500}
                className="create-course-drawer"
            >
                <Form layout="vertical" form={form} onFinish={addCourse} className="create-course-form">
                    <Form.Item name="thumbnail" label="Upload Thumbnail" valuePropName="fileList" rules={[{ required: true, message: 'Please upload the thumbnail' }]} getValueFromEvent={e => e.fileList}>
                        <Upload
                            beforeUpload={() => false}
                            maxCount={1}
                            listType="picture"
                        >
                            <Button>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item name="courseName" rules={[{ required: true, message: 'Please enter the course name' }]}>
                        <Input placeholder='Course Name' className="form-input" />
                    </Form.Item>
                    <Form.Item name="description" rules={[{ required: true, message: 'Please enter the description' }]}>
                        <Input.TextArea rows={5} placeholder='Description' className="form-textarea" />
                    </Form.Item>
                    <Form.Item name="title" rules={[{ required: true, message: 'Please enter the title' }]}>
                        <Input placeholder='Topic Title' className="form-input" />
                    </Form.Item>
                    <Form.Item name="url" rules={[{ required: true, message: 'Please enter the URL' }]}>
                        <Input placeholder='Topic URL' className="form-input" />
                    </Form.Item>
                    <Form.Item name="pricing" rules={[{ required: true, message: 'Please enter the pricing' }]}>
                        <Input type="number" placeholder='Pricing' className="form-input" />
                    </Form.Item>
                    <Form.Item name="duration" rules={[{ required: true, message: 'Please enter the Duration' }]}>
                        <Input type="number" placeholder='Duration' className="form-input" />
                    </Form.Item>
                    <Form.Item name="category" rules={[{ required: true, message: 'Please select the category' }]}>
                        <Select placeholder='Select Category' className="form-select">
                            <Option value="Technology">Technology</Option>
                            <Option value="Business">Business</Option>
                            <Option value="Arts">Arts</Option>
                            <Option value="Science">Science</Option>
                            <Option value="Health">Health</Option>
                            <Option value="Language">Language</Option>
                            <Option value="Mathematics">Mathematics</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="level" rules={[{ required: true, message: 'Please select the level' }]}>
                        <Select placeholder='Select Level' className="form-select">
                            <Option value="Beginner">Beginner</Option>
                            <Option value="Intermediate">Intermediate</Option>
                            <Option value="Advanced">Advanced</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="language" rules={[{ required: true, message: 'Please select the language' }]}>
                        <Select placeholder='Select Language' className="form-select">
                            {languages.map(lang => (
                                <Option key={lang.value} value={lang.value}>{lang.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="create-course-submit-button">Submit</Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default AllCourses;
