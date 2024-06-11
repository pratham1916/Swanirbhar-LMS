import React, { useState, useEffect } from 'react';
import { Table, Pagination, Spin, message } from 'antd';
import axios from 'axios';
import { baseUrl } from '../App';
import '../styles/MySubmission.css';

const MySubmission = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 7,
        totalItems: 0
    });
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchSubmissions(pagination.currentPage, pagination.pageSize);
    }, [pagination.currentPage, pagination.pageSize]);

    const fetchSubmissions = async (page, limit) => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/submission/mySubmission`, {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    page: page,
                    limit: limit
                }
            });
            const data = response.data;
            setSubmissions(data.submissions);
            setPagination({
                ...pagination,
                totalItems: data.totalData
            });
        } catch (error) {
            message.error(error.response?.data?.message || "Error fetching submissions");
        }
        setLoading(false);
    };

    const columns = [
        {
            title: 'Assignment Title',
            dataIndex: ['assignment', 'title'],
            key: 'title',
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
        }
    ];

    const handlePageChange = (page) => {
        setPagination({ ...pagination, currentPage: page });
    };

    return (
        <div className="my-submission-container">
            {loading ? <Spin className="loading-spinner" /> : (
                <>
                    <Table 
                        columns={columns} 
                        dataSource={submissions} 
                        rowKey="_id" 
                        pagination={false}
                    />
                    <div className="pagination-container">
                        <Pagination 
                            current={pagination.currentPage} 
                            total={pagination.totalItems} 
                            pageSize={pagination.pageSize} 
                            onChange={handlePageChange} 
                            showTotal={(total) => `Total ${total} submissions`}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default MySubmission;
