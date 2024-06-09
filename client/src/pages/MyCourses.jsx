import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, Pagination, Card } from 'antd';
import { baseUrl } from '../App';

const { Meta } = Card;

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
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
    <div style={{ marginTop: "100px" }}>
      {loading ? (
        <Spin className="loading-spinner" />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {courses.map(course => (
              <Card
                key={course._id}
                style={{ width: 300, margin: '16px' }}
                cover={<img alt="example" src={course.coverImage} />}
              >
                <Meta
                  title={course.courseName}
                  description={
                    <>
                      <p>Instructor: {course.instructor.fullname}</p>
                      <p>Students Enrolled: {course.students.map(student => student.fullname).join(', ')}</p>
                      <p>Description: {course.description}</p>
                    </>
                  }
                />
              </Card>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MyCourses;
