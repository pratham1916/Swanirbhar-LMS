import React, { useState } from 'react';
import { Button, Drawer, Form, Input, DatePicker, Select, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { baseUrl } from '../App';

const { Option } = Select;

const Assignment = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onFinish = async (values) => {
    console.log('Form Values:', values);
    const formattedValues = {
      ...values,
      deadline: values.deadline.toISOString(),
    };

    try {
      const response = await axios.post(`${baseUrl}/assignment`, formattedValues, {
        headers: {
            Authorization: `${token}`
        }
      });
      message.success(response.data.message);
    onClose();

    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  return (
    <div style={{ marginTop: '100px' }}>
      <Button size='small' type="primary" onClick={showDrawer}>Create Assignment</Button>
      <Drawer
        title="Create a new assignment"
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" onFinish={onFinish}>
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
            <Select placeholder="Select a course">
              <Option value="course1">Course 1</Option>
              <Option value="course2">Course 2</Option>
              <Option value="course3">Course 3</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="deadline"
            label="Deadline"
            rules={[{ required: true, message: 'Please select the deadline' }]}
          >
            <DatePicker showTime placeholder="Select deadline" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Assignment;
