import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message, Spin, Button, Drawer, Form, Input, DatePicker, Table, Pagination, Modal } from 'antd';
import { baseUrl } from '../App';
import moment from 'moment';
import '../styles/SingleAssignment.css';

const { TextArea } = Input;

const SingleAssignment = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignmentData, setAssignmentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [form] = Form.useForm();
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem('user'));
    const userRole = userData.role;
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [feedbackDrawerVisible, setFeedbackDrawerVisible] = useState(false);

    // New state variables for submissions and pagination
    const [submissions, setSubmissions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalData, setTotalData] = useState(0);

    useEffect(() => {
        fetchAssignment();
        if (userRole === 'instructor') {
            fetchSubmissions(currentPage);
        }
    }, [assignmentId, currentPage, userRole]);

    const fetchAssignment = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/assignment/${assignmentId}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            setAssignmentData(response.data.assignmentDetails);
        } catch (error) {
            message.error(error.response.data.message);
        }
        setLoading(false);
    };

    const fetchSubmissions = async (page) => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/submission/${assignmentId}`, {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    page: page,
                    limit: 12
                }
            });
            const data = response.data;
            setSubmissions(data.submissions);
            setTotalPages(data.pages);
            setTotalData(data.totalData);
        } catch (error) {
            message.error(error.response?.data?.message || "Error fetching submissions");
        }
        setLoading(false);
    };

    const showDrawer = () => {
        setDrawerVisible(true);
        form.setFieldsValue({
            title: assignmentData.title,
            description: assignmentData.description,
            deadline: moment(assignmentData.deadline)
        });
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    const handleEdit = async (values) => {
        setLoading(true);
        try {
            const response = await axios.put(`${baseUrl}/assignment/${assignmentId}`, values, {
                headers: {
                    Authorization: `${token}`
                }
            });
            setAssignmentData(response.data.assignment);
            message.success(response.data.message);
            closeDrawer();
        } catch (error) {
            message.error(error.response.data.message);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(`${baseUrl}/assignment/${assignmentId}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            message.success(response.data.message);
            navigate('/assignment');
        } catch (error) {
            message.error(error.response.data.message);
        }
        setLoading(false);
    };

    const handleSubmission = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/submission/submit/${assignmentId}`, values, {
                headers: {
                    Authorization: token
                }
            });
            message.success(response.data.message);
            setSubmissionSuccess(true);
        } catch (error) {
            message.error(error.response.data.message);
        }
        setLoading(false);
    };

    const columns = [
        {
            title: 'Student Name',
            dataIndex: ['submittedBy', 'fullname'],
            key: 'submittedBy.fullname',
        },
        {
            title: 'Submission URL',
            dataIndex: 'submissionURL',
            key: 'submissionURL',
            render: (text) => <a href={text} target="_blank" rel="noopener noreferrer">{text}</a>,
        },
        {
            title: 'Grade',
            dataIndex: 'grade',
            key: 'grade',
        },
        {
            title: 'Feedback',
            dataIndex: 'feedback',
            key: 'feedback',
        },
        {
            title: 'Submission Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button type="primary" onClick={() => handleFeedback(record)}>Provide Feedback</Button>
            ),
        },
    ];

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFeedback = (record) => {
        setSelectedSubmission(record);
        setFeedbackDrawerVisible(true);
    };

    const closeFeedbackDrawer = () => {
        setFeedbackDrawerVisible(false);
    };

    const submitFeedback = async (values) => {
        setLoading(true);
        try {
            const response = await axios.put(`${baseUrl}/submission/feedback/${selectedSubmission._id}`, values, {
                headers: {
                    Authorization: token
                }
            });
            message.success(response.data.message);
            closeFeedbackDrawer();
            // Refetch submissions after providing feedback
            fetchSubmissions(currentPage);
        } catch (error) {
            message.error(error.response.data.message);
        }
        setLoading(false);
    };

    return (
        <div className="single-assignment-container">
            {loading ? <Spin className="loading-spinner" /> : (
                assignmentData ? (
                    <>
                        <div className="single-assignment-card">
                            <h2 className="single-assignment-title">{assignmentData.title}</h2>
                            <p className="single-assignment-description">Problem Statement: {assignmentData.description}</p>
                            <p className="single-assignment-deadline">Deadline: {moment(assignmentData.deadline).format("DD/MM/YYYY HH:mm")}</p>
                            {userRole === 'instructor' && (
                                <>
                                    <Button size='small' style={{ marginRight: "10px" }} type="primary" onClick={showDrawer}>Edit</Button>
                                    <Button size='small' danger onClick={handleDelete}>Delete</Button>
                                </>
                            )}
                        </div>

                        {userRole === 'instructor' && (
                            <div className="submissions-container">
                                <Table
                                    columns={columns}
                                    dataSource={submissions}
                                    rowKey="_id"
                                    pagination={false}
                                />
                                <Pagination
                                    current={currentPage}
                                    total={totalData}
                                    pageSize={12}
                                    onChange={handlePageChange}
                                    style={{ marginTop: '20px', textAlign: 'right' }}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <p>No assignment data available</p>
                )
            )}        <Drawer
                title="Edit Assignment"
                width={420}
                onClose={closeDrawer}
                visible={drawerVisible}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <Form form={form} layout="vertical" onFinish={handleEdit}>
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please enter the title' }]}
                    >
                        <Input placeholder="Please enter the title" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter the description' }]}
                    >
                        <TextArea placeholder="Please enter the description" />
                    </Form.Item>
                    <Form.Item
                        name="deadline"
                        label="Deadline"
                        rules={[{ required: true, message: 'Please enter the deadline' }]}
                    >
                        <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" loading={loading} htmlType="submit">Save</Button>
                    </Form.Item>
                </Form>
            </Drawer>

            <Drawer
                title="Provide Feedback and Grade"
                width={420}
                onClose={closeFeedbackDrawer}
                visible={feedbackDrawerVisible}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <Form layout="vertical" onFinish={submitFeedback}>
                    <Form.Item
                        name="grade"
                        label="Grade"
                        rules={[{ required: true, message: 'Please enter the grade' }]}
                    >
                        <Input placeholder="Please enter the grade" />
                    </Form.Item>
                    <Form.Item
                        name="feedback"
                        label="Feedback"
                        rules={[{ required: true, message: 'Please enter the feedback' }]}
                    >
                        <TextArea placeholder="Please enter the feedback" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" loading={loading} htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default SingleAssignment;                        
