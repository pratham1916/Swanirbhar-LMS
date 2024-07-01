import React, { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, DatePicker, Select, message, Pagination, Card, Row, Col, Spin, Empty } from 'antd';
import axios from 'axios';
import { baseUrl } from '../App';
import '../styles/Assignment.css';
import { Link } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;

const Assignment = () => {
  const [form] = Form.useForm();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [courseList, setCourseList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [assignmentList, setAssignmentList] = useState([]);
  const token = localStorage.getItem("token");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 12,
    totalItems: 0
  });

  useEffect(() => {
    fetchCourses();
    fetchAssignments(pagination.currentPage, pagination.pageSize);
  }, [pagination.currentPage, pagination.pageSize]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/courses`, {
        headers: {
          Authorization: `${token}`
        }
      });
      setCourseList(response.data.courses);
      setPagination({
        ...pagination,
        totalItems: response.data.totalData
      });
      setIsLoading(false);
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const fetchAssignments = async (page, limit) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/assignment?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `${token}`
        }
      });
      setAssignmentList(response.data.assignments);
      setPagination({
        ...pagination,
        totalItems: response.data.totalData
      });
    } catch (error) {
      message.error(error.response.data.message);
    }
    setIsLoading(false);
  };

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const onFinish = async (values) => {
    const formattedValues = {
      ...values,
      deadline: values.deadline.toISOString(),
    };
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/assignment`, formattedValues, {
        headers: {
          Authorization: `${token}`
        }
      });
      const totalPages = Math.ceil((pagination.totalItems + 1) / pagination.pageSize);
      message.success(response.data.message);
      fetchAssignments(totalPages, pagination.pageSize);
      form.resetFields();
      closeDrawer();
    } catch (error) {
      message.error(error.response.data.message);
    }
    setIsLoading(false);
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  return (
    <div className="assignment-container">
      {isLoading ? <Spin className="loading-spinner" /> : (
        <>
          <Button size='small' type="primary" onClick={showDrawer}>Create Assignment</Button>
          <Drawer
            title="Create a new assignment"
            onClose={closeDrawer}
            visible={isDrawerVisible}
            bodyStyle={{ paddingBottom: 80 }}
          >
            <Form layout="vertical" form={form} onFinish={onFinish}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please enter the title' }]}
              >
                <Input placeholder="Enter the title" />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter the description' }]}
              >
                <Input.TextArea rows={4} placeholder="Enter the description" />
              </Form.Item>
              <Form.Item
                name="courseId"
                label="Course"
                rules={[{ required: true, message: 'Please select a course' }]}
              >
                <Select placeholder="Select a course" loading={isLoading}>
                  {courseList.map(course => (
                    <Option key={course._id} value={course._id}>{course.courseName}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="deadline"
                label="Deadline"
                rules={[{ required: true, message: 'Please select the deadline' }]}
              >
                <DatePicker style={{ width: "100%" }} showTime placeholder="Select deadline" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Drawer>

          <Row gutter={[16, 16]} className="assignment-row">
            {assignmentList.length === 0 ? (
              <Col span={24}>
                <Empty description="No assignments found" />
              </Col>
            ) : (
              assignmentList.map(assignment => (
                <Col key={assignment._id} xs={24} sm={12} md={8} lg={6} className="assignment-col">
                  <Card className="assignment-card"
                    actions={[
                      <Link to={`/singleAssignment/${assignment._id}`} className="view-course-link">View Assignment</Link>
                    ]}
                  >
                    <p>Title: {assignment.title}</p>
                    <p>Course: {assignment.course.courseName}</p>
                    <p>Deadline: {moment(assignment.deadline).format("DD/MM/YYYY HH:mm")}</p>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          <div className="pagination-container">
            <Pagination
              total={pagination.totalItems}
              current={pagination.currentPage}
              pageSize={pagination.pageSize}
              onChange={handlePageChange}
              showTotal={(total) => {
                if (assignmentList.length === 0) {
                  return "No assignments found";
                } else {
                  return `Total ${total} Assignment`;
                }
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Assignment;
