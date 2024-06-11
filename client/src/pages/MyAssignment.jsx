import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, Pagination, Card, Row, Col, Empty, message } from 'antd';
import { baseUrl } from '../App';
import { Link } from 'react-router-dom';
import "../styles/MyAssignment.css"

const { Meta } = Card;

const MyAssignment = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 12,
        total: 0
    });
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchAssignments(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize]);

    const fetchAssignments = async (page, limit) => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/assignment/myAssignment?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: token
                }
            });

            setAssignments(response.data.assignments);
            setPagination({
                ...pagination,
                total: response.data.totalData
            });
            setLoading(false);
        } catch (error) {
            message.error(error.response.data.message );
        }
    };

    const handlePageChange = (page) => {
        setPagination({ ...pagination, current: page });
    };

    return (
        <div className="all-assignments-container">
            {loading ?
                (<Spin className="loading-spinner" />) : assignments.length === 0 ? (
                    <Empty className="empty-message" description="No assignments found" />
                )
                : (
                    <>
                        <Row gutter={[16, 16]} className="assignments-row">
                            {assignments.map(assignment => (
                                <Col key={assignment._id} xs={24} sm={12} md={8} lg={6} className="assignment-col">
                                    <Card className="assignment-card"
                                        actions={[
                                            <Link to={`/singleAssignment/${assignment._id}`} className="view-course-link">View Assignment</Link>
                                        ]}
                                    >
                                        <Meta
                                            title={assignment.title}
                                            description={
                                                <div>
                                                    <p className="assignment-course">Course: {assignment.course.courseName}</p>
                                                    <p className="assignment-deadline">Deadline: {assignment.deadline}</p>
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
                                showTotal={(total) => `Total ${total} Assignments`}
                            />
                        </div>
                    </>
                )}
        </div>
    );
};

export default MyAssignment;
