import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, Pagination, Card, Row, Col, Empty } from 'antd';
import { baseUrl } from '../App';
import { Link } from 'react-router-dom';

const { Meta } = Card;

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 12,
        total: 0
    });
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchCourses(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize]);

    const fetchCourses = async (page, limit) => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/courses/myCourses?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: token
                }
            });
            setCourses(response.data.courses);
            setPagination({
                ...pagination,
                total: response.data.totalData
            });
            setLoading(false);
        } catch (error) {
            setError(error.response ? error.response.data.message : 'Error fetching data');
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setPagination({ ...pagination, current: page });
    };

    return (
        <div className="all-courses-container">
            {loading ?
                (<Spin className="loading-spinner" />): courses.length === 0 ? (
                    <Empty className="empty-message" description="No data found" /> 
                ) 
                : (
                    <>
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
        </div>
    );
};

export default MyCourses;
