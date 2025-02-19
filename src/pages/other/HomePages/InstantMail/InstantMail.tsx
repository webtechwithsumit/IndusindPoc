
import { useState, useEffect } from 'react';
import { Button, Table, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PaginationComponent from '../../Component/PaginationComponent';
import axios from 'axios';



interface Mail {
    id: number
    sentDate: string;
    subject: string;
}


interface Column {
    id: string;
    label: string;
    visible: boolean;
}

const dummyMails: Mail[] = [
    { id: 1, sentDate: '2024-01-01', subject: 'Project Kickoff Meeting' },
    { id: 2, sentDate: '2024-01-02', subject: 'Monthly Report Submission' },
    { id: 3, sentDate: '2024-01-03', subject: 'HR Policy Update' },
    { id: 4, sentDate: '2024-01-04', subject: 'Team Outing Plan' },
    { id: 5, sentDate: '2024-01-05', subject: 'System Maintenance Notification' },
    { id: 6, sentDate: '2024-01-06', subject: 'New Employee Orientation' },
    { id: 7, sentDate: '2024-01-07', subject: 'Security Awareness Training' },
    { id: 8, sentDate: '2024-01-08', subject: 'Quarterly Financial Results' },
    { id: 9, sentDate: '2024-01-09', subject: 'Annual Performance Review' },
    { id: 10, sentDate: '2024-01-10', subject: 'IT Helpdesk Update' },
    { id: 11, sentDate: '2024-01-11', subject: 'Holiday Announcement' },
    { id: 12, sentDate: '2024-01-12', subject: 'Work From Home Guidelines' },
    { id: 13, sentDate: '2024-01-13', subject: 'Expense Reimbursement Policy' },
    { id: 14, sentDate: '2024-01-14', subject: 'New Product Launch' },
    { id: 15, sentDate: '2024-01-15', subject: 'Customer Feedback Summary' }
];


const DesignationMaster = () => {
    const [mails, setMails] = useState<Mail[]>(dummyMails);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (location.state?.successMessage) {
            toast.dismiss()
            toast.success(location.state.successMessage);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate]);


    // both are required to make dragable column of table 
    const [columns, setColumns] = useState<Column[]>([
        { id: 'sentDate', label: ' Sent Date', visible: true },
        { id: 'subject', label: 'Mail Subject', visible: true },
    ]);
    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };
    // ==============================================================

    useEffect(() => {
        fetchData();
    }, [currentPage]);


    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_URL}/Mail/GetMail`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setMails(response.data.mailList);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching doers:', error);
        }
        finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [currentPage]);




    return (
        <div className='p-3 mt-3 bg-white'>
            <Row className=' mb-2 px-2'>
                <div className="d-flex justify-content-between profilebar p-1">
                    <h4 className='text-primary d-flex align-items-center m-0'><i className="ri-file-list-line me-2 text-primary "></i>Manage Mail</h4>
                    <div className="d-flex justify-content-end bg-light w-50 profilebar">

                        <Link to='/pages/ComposeMail'>
                            <Button variant="primary" className="">
                                Compose Mail
                            </Button>
                        </Link>
                    </div>
                </div>
            </Row>

            {loading ? (
                <div className='loader-container'>
                    <div className="loader"></div>
                    <div className='mt-2'>Please Wait!</div>
                </div>
            ) : (

                <>
                    <div className="overflow-auto text-nowrap">
                        {!mails ? (
                            <Container className="mt-5">
                                <Row className="justify-content-center">
                                    <Col xs={12} md={8} lg={6}>
                                        <Alert variant="info" className="text-center">
                                            <h4>No Task Found</h4>
                                            <p>You currently don't have Completed tasks</p>
                                        </Alert>
                                    </Col>
                                </Row>
                            </Container>
                        ) : (
                            <>
                                <DragDropContext onDragEnd={handleOnDragEnd}>
                                    <Table hover className="bg-white custom-table">
                                        <thead>
                                            <Droppable droppableId="columns" direction="horizontal">
                                                {(provided) => (
                                                    <tr {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}>
                                                        <th>
                                                            <i className="ri-list-ordered-2"></i> Sr. No
                                                        </th>
                                                        {columns.filter((col) => col.visible).map((column, index) => (
                                                            <Draggable key={column.id} draggableId={column.id} index={index}>
                                                                {(provided) => (
                                                                    <th>
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                        >
                                                                            {column.id === 'departmentName' && <i className="ri-group-fill"></i>}
                                                                            {column.id === 'status' && <i className="ri-file-list-fill"></i>}
                                                                            &nbsp; {column.label}
                                                                        </div>
                                                                    </th>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                        <th className="text-center">Action</th>
                                                    </tr>
                                                )}
                                            </Droppable>
                                        </thead>
                                        <tbody>
                                            {mails.length > 0 ? (
                                                mails.slice(0, 10).map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                        {columns.filter((col) => col.visible).map((col) => (
                                                            <td
                                                                key={col.id}
                                                                className={
                                                                    col.id === 'departmentName' ? 'fw-bold text-dark' : ''
                                                                }
                                                            >
                                                                <div>{item[col.id as keyof Mail]}</div>
                                                            </td>
                                                        ))}
                                                        <td className="text-center">
                                                            <Link to={`/pages/ComposeMail/${item.id}`}>
                                                                <Button variant="primary" className="p-0 text-white me-3">
                                                                    <i className="btn ri-edit-line text-white"></i>
                                                                </Button>
                                                            </Link>
                                                            <Button variant="primary" className="p-0 text-white">
                                                                <i className="btn ri-delete-bin-6-line text-white"></i>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={12}>
                                                        <Container className="mt-5">
                                                            <Row className="justify-content-center">
                                                                <Col xs={12} md={8} lg={6}>
                                                                    <Alert variant="info" className="text-center">
                                                                        <h4>No Data Found</h4>
                                                                        <p>You currently don't have Data</p>
                                                                    </Alert>
                                                                </Col>
                                                            </Row>
                                                        </Container>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </DragDropContext>
                            </>
                        )}
                    </div>
                </>
            )
            }

            <PaginationComponent currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />


        </div >
    );
};

export default DesignationMaster;