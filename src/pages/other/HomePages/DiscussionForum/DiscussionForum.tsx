import config from '@/config';
import { useEffect, useState } from 'react';
import { Card, Col, Row, Table, Button, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DateFormatter from '../../Component/DateComponent';
import { useAuthContext } from '@/common';
import axiosInstance from '@/utils/axiosInstance';

interface DiscussionForm {
    id: number;
    productID: number;
    userComment: string;
    adminComment: string;
    status: number;
    createdBy: string;
    asigneeName: string;
    createdDate: string;
    updatedBy: string | null;
    updatedDate: string | null;
}

interface Product {
    id: number;
    productType: string;
    productName: string;
    productDescription: string;
    originator: string;
    authorizedSignatory: string;
    assignee: string;
    mobileNumber: string;
    defaultAssignee: string;
    fileUpload: string;
    isApproved: number;
    startDate: string;
    endDate: number;
    daysLapsed: number;
    signedOffByDepartment: string;
    queries: string;
    departmentName: string;
    createdBy: string;
    asigneeName: string;
    createdDate: string;
    updatedBy: string | null;
    updatedDate: string | null;
    getDiscussionForms: DiscussionForm[];
}

const DiscussionForum = () => {
    const { id, department } = useParams();
    const [discussion, setDiscussion] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentUserComment, setCurrentUserComment] = useState<string>('');
    const [currentAdminComment, setCurrentAdminComment] = useState<string>('');
    const { user } = useAuthContext();

    useEffect(() => {
        if (id) {
            fetchDiscussion(id);
        }
    }, [id]);


    const fetchDiscussion = async (id: any) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${config.API_URL}/Product/GetDiscussionFormSummaryList`, {
                params: {
                    productId: id,
                    departmentName: user?.roleName === 'Convener level 2' ? department : user?.departmentName
                }
            });
            if (response.data.isSuccess) {
                setDiscussion(response.data.getProducts[0]);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching discussion:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleUserCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentUserComment(e.target.value);
    };

    const handleAdminCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentAdminComment(e.target.value);
    };

    const saveComment = async () => {
        const formData = discussion!.getDiscussionForms[0];
        const payload = {
            productID: id,
            adminComment: currentAdminComment || formData.adminComment,
            userComment: currentUserComment,
            createdBy: user?.employeeName,
            departmentName: user?.departmentName,
            // departmentName: department,
            createdDate: new Date().toISOString(),
            updatedBy: null,
            updatedDate: null,
            status: 0,
        };
        console.log(payload)
        try {
            const response = await axiosInstance.post(
                `${config.API_URL}/DiscussionForm/InsertDiscussionForm`,
                payload
            );

            if (response.data.isSuccess) {
                toast.success('User Comment saved successfully');
                setCurrentUserComment('');
                setCurrentAdminComment('');
                fetchDiscussion(id);
            } else {
                toast.error(`Error: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error during comment submission:', error);
            toast.error('Error saving comment');
        }
    };

    const handleMarkAsResolved = async (discussionFormId: any) => {
        try {
            const formData = discussion!.getDiscussionForms[0];

            const payload = {
                productID: discussionFormId,
                adminComment: currentAdminComment || formData.adminComment,
                userComment: currentUserComment,
                createdBy: user?.employeeName,
                createdDate: new Date().toISOString(),
                updatedBy: null,
                updatedDate: null,
                status: 1,
            };
            console.log(payload)

            const response = await axiosInstance.post(
                `${config.API_URL}/DiscussionForm/InsertDiscussionForm`,
                payload
            );

            if (response.data.isSuccess) {
                toast.success('Discussion marked as resolved');
                fetchDiscussion(id);
            } else {
                console.error('Error response:', response.data);
                toast.error('Error marking as resolved');
            }
        } catch (error: any) {
            console.error('Error during status update:', error.response || error.message);
            toast.error('Error marking as resolved');
        }
    };


    return (
        <div className="mt-3">
            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                    <div className="mt-2">Please Wait!</div>
                </div>
            ) : discussion ? (
                <Row>
                    <Col sm={12}>
                        <Card className="shadow-lg border-0 rounded">
                            <Card.Body className="p-4">
                                <Card className="shadow-none ">
                                    <div className="mb-3">
                                        <h4 className="p-2 text-primary border-primary profilebar">Discussion Forum</h4>
                                    </div>
                                    <nav aria-label="breadcrumb">
                                        <ul className="d-flex list-unstyled">
                                            <li className="p-1"><a href="/">Home</a></li>
                                            <li className="p-1"> {'>'}</li>
                                            <li className="p-1"><a href="/manage-product">Manage Product</a></li>
                                            <li className="p-1"> {'>'}</li>
                                            <li className="p-1"><a href="/manage-product">Discussion Board</a></li>
                                            <li className="p-1"> {'>'}</li>
                                            <li className="p-1" aria-current="page">Discussion Forum</li>
                                        </ul>
                                    </nav>

                                    <div className='my-2'>
                                        <Row>
                                            <Col lg={4}>
                                                <span className="text-primary fs-16 fw-bold">Product : </span>
                                                <span className="text-dark">{discussion.productName}</span>
                                            </Col>
                                            <Col lg={4}>
                                                <span className="text-primary fs-16 fw-bold">Product Department : </span>
                                                <span className="text-dark">{discussion.departmentName}</span>
                                            </Col>
                                            <Col lg={4}>
                                                <span className="text-primary fs-16 fw-bold">Start Date : </span>
                                                <span className="text-dark">
                                                    <DateFormatter dateString={discussion.createdDate} />
                                                </span>
                                            </Col>
                                            <Col lg={4}>
                                                <span className="text-primary fs-16 fw-bold">End Date : </span>
                                            </Col>
                                            <Col lg={4}>
                                                <span className="text-primary fs-16 fw-bold">Department Thread : </span>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card>

                                <div className="my-4">
                                    <Table hover className="bg-white custom-table">
                                        <thead className=" text-dark text-center">
                                            <tr>
                                                <th style={{ width: '1%' }}>Sr.no</th>
                                                <th style={{ width: '30%' }}>Query</th>
                                                <th style={{ width: '30%' }}>Response</th>
                                                <th style={{ width: '20%' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>
                                                    {discussion.getDiscussionForms[0]?.adminComment ? (
                                                        <div> <div className="d-flex justify-content-between">
                                                            <strong>{discussion.getDiscussionForms[0].createdBy}</strong>
                                                            <strong>{discussion.getDiscussionForms[0].createdDate}</strong>
                                                        </div>
                                                            <textarea
                                                                rows={4}
                                                                value={discussion.getDiscussionForms[0].adminComment}
                                                                disabled
                                                                className="form-control mb-2"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <strong>Enter Admin Comment: </strong>
                                                            <textarea
                                                                rows={4}
                                                                placeholder="Enter Admin Comment"
                                                                value={currentAdminComment}
                                                                onChange={handleAdminCommentChange}
                                                                className="form-control mb-2"
                                                            />
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <div>
                                                        {discussion.getDiscussionForms.map((discussionForm) => (
                                                            discussionForm.userComment && (
                                                                <div key={discussionForm.id} className='mb-2'>
                                                                    <div className='border-primary border p-2 rounded'>
                                                                        <div className="d-flex justify-content-between">
                                                                            <strong>{discussionForm.createdBy}: </strong>
                                                                            <div className='fs-12 '>{discussionForm.createdDate}</div>
                                                                        </div>
                                                                        <span>{discussionForm.userComment}</span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        ))}
                                                    </div>

                                                    <div className="mt-2">
                                                        <textarea
                                                            rows={4}
                                                            value={currentUserComment}
                                                            onChange={handleUserCommentChange}
                                                            placeholder="Your Comment"
                                                            className="form-control mb-2"
                                                        />
                                                    </div>
                                                </td>
                                                <td className=''>
                                                    <div className="text-center">
                                                        <Button variant="success" onClick={saveComment} className='me-2'>Save Comment</Button>
                                                        {user?.employeeName === discussion.getDiscussionForms[0]?.createdBy ? (
                                                            <Button
                                                                variant="info"
                                                                onClick={() => handleMarkAsResolved(discussion.getDiscussionForms[0].id)}
                                                            >
                                                                Mark as Resolved
                                                            </Button>
                                                        ) : null
                                                        }

                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

            ) : (
                <Alert variant="warning">Product not found!</Alert>
            )}
        </div>
    );
};

export default DiscussionForum;
