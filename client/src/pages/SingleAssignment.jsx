import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { message, Spin } from 'antd';
import { baseUrl } from '../App';
import moment from 'moment';
import '../styles/SingleAssignment.css';

const SingleAssignment = () => {
    const { assignmentId } = useParams();
    const [assignmentData, setAssignmentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
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

        fetchAssignment();
    }, [assignmentId, token]);

    if (loading) {
        return (
            <div className="single-assignment-container">
                <Spin size="large" />
            </div>
        );
    }

    if (!assignmentData) {
        return (
            <div className="single-assignment-container">
                <h2>Assignment not found</h2>
            </div>
        );
    }

    return (
        <div className="single-assignment-container">
            <div className="single-assignment-card">
                <h2 className="single-assignment-title">{assignmentData.title}</h2>
                <p className="single-assignment-description">Description: {assignmentData.description}</p>
                <p className="single-assignment-course">Course: {assignmentData.course.courseName}</p>
                <p className="single-assignment-deadline">Deadline: {moment(assignmentData.deadline).format("DD/MM/YYYY HH:mm")}</p>
            </div>
        </div>
    );
};

export default SingleAssignment;
