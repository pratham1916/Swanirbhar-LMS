import React, { useState } from 'react';
import { Select, Spin } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import "../styles/ChatBox.css";
import axios from 'axios';
import { baseUrl } from '../App';

const { Option } = Select;

const ChatBox = ({ onClose }) => {
    const [messages, setMessages] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState('General');

    const handleTabChange = async (value) => {
        setSelectedTab(value);
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/course-details`, { query: value });
            console.log(JSON.stringify(response.data.text));
            setMessages(response.data.text);
        } catch (error) {
            console.error('An error occurred while fetching response:', error);
            setMessages('An error occurred while fetching response.');
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="chat-box">
            <div className="chat-header">
                <h3>Ask to AI</h3>
                <CloseCircleOutlined onClick={onClose} className="close-btn" />
            </div>
            <div className="tab-selector">
                <Select style={{ width: "100%" }} defaultValue="" onChange={handleTabChange}>
                    <Option value="" disabled>Please Ask</Option>
                    <Option value="Could you explain the focus areas of the React.js course">Explain the focus areas of the React.js course</Option>
                    <Option value="What projects can I expect to work on in the AIML course">What projects will there in AIML</Option>
                    <Option value="What skills will I gain from completing the Node.js course">Skills I will gain after completing the Node.js course</Option>
                    <Option value="Are there any certifications or credentials awarded upon completion of these courses?">Will get certifications after completion of these courses?</Option>
                    <Option value="Can I access the course materials and resources after completing the program?">Can I access the resources after completing the courses?</Option>
                    <Option value="Are there any opportunities for hands-on practice or real-world projects?">Will get opportunities for real-world projects?</Option>
                    <Option value="What are the career opportunities after completing the coding courses">Career opportunities after completing the courses</Option>
                </Select>
            </div>
            <div className="message-container">
                {loading ? <Spin className="loading-spinner-1" /> : <p>{messages}</p>}
            </div>
        </div>
    );
};

export default ChatBox;
