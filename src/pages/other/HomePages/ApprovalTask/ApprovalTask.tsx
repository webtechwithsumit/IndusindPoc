import { useState, useEffect } from 'react';
import { Button, Table, Container, Row, Col, Alert, Form, ButtonGroup, Collapse, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import PaginationComponent from '../../Component/PaginationComponent';
import ApprovalPopup from './ApprovalPopup';
import { useAuthContext } from '@/common';
import DateFormatter from '../../Component/DateComponent';
import axiosInstance from '@/utils/axiosInstance';


interface Manager {
    id: number;
    managerName: string;
    departmentID: number;
    status: number;
    createdBy: string;
    updatedBy: string;
    productName: string;
    departmentName: string;
    endDate: string;
    createdDate: string;
    getProductChecklistByProductNames: ProductChecklist[];
    downloadDocuments: DocumentProduct[];  // <-- Add this line
}

interface DocumentProduct {
    id: number;
    type: string;
    files: string;
    fileUrls: string[];
}


interface DocumentItem {
    files: string;
    fileUrls: string[];
}

interface ProductChecklist {
    name: string;
    status: number;
}

interface Column {
    id: string;
    label: string;
    visible: boolean;
}



const EmployeeMaster = () => {
    const { user } = useAuthContext();
    const [employee, setEmployee] = useState<Manager[]>([]);
    const [loading, setLoading] = useState(false);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [totalPages, setTotalPages] = useState(1);
    const [show, setShow] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [manageId, setManageID] = useState<number>();
    const [expandedRow, setExpandedRow] = useState<number | null>(null); // For row expansion



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
        { id: 'productName', label: 'Product  Name ', visible: true },
        { id: 'productType', label: 'Product Type ', visible: true },
        { id: 'departmentName', label: 'Department Name ', visible: true },
        { id: 'createdDate', label: 'Start Date ', visible: true },
        // { id: 'status', label: 'Status ', visible: true },   


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
        fetchEmployee();
    }, []);




    const downloadFiles = async (file: string, name: any) => {
        console.log(file)
        console.log(name)
        try {
            const response = await axiosInstance({
                method: 'GET',
                url: `${config.API_URL}/UploadDocument/DownloadFile`,
                params: { filename: file },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
    };




    console.log(employee)
    const fetchEmployee = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${config.API_URL}/Product/GetProductListByAssignee`, {
                params: { Assignee: user?.userName }
            });
            if (response.data.isSuccess) {
                setEmployee(response.data.getProducts);
                // setTotalPages(Math.ceil(response.data.totalCount / 10));
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



    const handleShowReject = () => setShowReject(true);
    const handleReject = (id: any) => {
        handleShowReject();
        setManageID(id)

    };

    const toggleExpandRow = (id: number) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const handleSubmit = async (id: any) => {
        toast.dismiss();
        const payload = {
            productID: id,
            departmentName: user?.departmentName,
            status: 1,
        };
        console.log(payload)

        try {
            const apiUrl = `${config.API_URL}/DiscussionForm/InsertDiscussionForm`;
            const response = await axiosInstance.post(apiUrl, payload);
            if (response.status === 200) {
                toast.success(response.data.message || 'Signed Off Successfully');
            } else {
                toast.error(response.data.message || 'Failed to process request');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error Adding/Updating');
            console.error('Error submitting employee:', error);
        }
    };

    const getFileName = (filePath: string) => {
        return filePath.split(/(\\|\/)/g).pop();
    };


    return (



        <div className='p-3 mt-3 bg-white'>
            <Row className=' mb-2 px-2'>
                <div className="d-flex justify-content-between profilebar p-1">
                    <h4 className='text-primary d-flex align-items-center m-0 p-1'><i className="ri-file-list-line me-2 text-primary "></i>  Pending Approval </h4>
                </div>
            </Row>


            {loading ? (
                <div className='loader-container'>
                    <div className="loader"></div>
                    <div className='mt-2'>Please Wait!</div>
                </div>
            ) : (
                <>

                    <div className="overflow-auto text-nowrap ">
                        {!employee ? (
                            <Container className="mt-5">
                                <Row className="justify-content-center">
                                    <Col xs={12} md={8} lg={6}>
                                        <Alert variant="info" className="text-center">
                                            <h4>No Data Found</h4>
                                            <p>You currently don't have any Data</p>
                                        </Alert>
                                    </Col>
                                </Row>
                            </Container>
                        ) : (
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Table hover className='bg-white '>
                                    <thead>
                                        <Droppable droppableId="columns" direction="horizontal">
                                            {(provided) => (
                                                <tr {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}>
                                                    <th><i className="ri-list-ordered-2"></i>  Sr. No</th>
                                                    {columns.filter(col => col.visible).map((column, index) => (
                                                        <Draggable key={column.id} draggableId={column.id} index={index}>
                                                            {(provided) => (
                                                                <th
                                                                    key={column.id}
                                                                    className={
                                                                        column.id === 'projectName' ? 'text-end' :
                                                                            column.id === 'isCompleted' ? 'text-end' :
                                                                                column.id === 'planDate' ? 'text-end' :
                                                                                    ''
                                                                    }
                                                                >
                                                                    <div ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}>
                                                                        {column.id === 'processName' && (<i className="ri-map-2-line"></i>)}
                                                                        {column.id === 'projectName' && (<i className="ri-building-line"></i>)}
                                                                        {column.id === 'task_Number' && (<i className="ri-health-book-line pl-1-5"></i>)}
                                                                        {column.id === 'isCompleted' && (<i className="ri-flag-line"></i>)}
                                                                        {column.id === 'planDate' && (<i className="ri-hourglass-line"></i>)}
                                                                        {column.id === 'taskName' && (<i className="ri-tools-line"></i>)}
                                                                        &nbsp; {column.label}
                                                                    </div>
                                                                </th>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                    <th className='text-center'>View</th>
                                                </tr>
                                            )}
                                        </Droppable>
                                    </thead>
                                    <tbody>
                                        {employee.length > 0 ? (
                                            employee.slice(0, 10).map((item, index) => (
                                                <>
                                                    <tr key={item.id}>
                                                        <td>{index + 1}</td>
                                                        {columns.filter(col => col.visible).map((col) => (
                                                            <td key={col.id}>
                                                                {Array.isArray(item[col.id as keyof Manager])
                                                                    ? (item[col.id as keyof Manager] as DocumentItem[]).map((doc, index) => (
                                                                        <span key={index}>
                                                                            {doc.files.split('\\').pop()}
                                                                            <br />
                                                                        </span>
                                                                    ))
                                                                    : col.id === 'createdDate' ? (
                                                                        <DateFormatter dateString={item.createdDate} />
                                                                    ) : (item[col.id as keyof Manager] as string | number)
                                                                }
                                                            </td>

                                                        ))}

                                                        <td className='text-center'>
                                                            <Button onClick={() => toggleExpandRow(item.id)}>
                                                                {expandedRow === item.id ? <i className=" fs-16 ri-arrow-up-s-line"></i> : <i className=" fs-16 ri-arrow-down-s-line"></i>}
                                                            </Button>
                                                        </td>
                                                    </tr>

                                                    {expandedRow && expandedRow === item.id ?
                                                        <tr>
                                                            <td colSpan={12}>
                                                                <Collapse in={expandedRow === item.id}>
                                                                    <div className='p-2'>

                                                                        <div className='my-3'>
                                                                            <Row className='mb-2'>
                                                                                <Col lg={4}> <span className='text-primary fs-16 fw-bold'> Product : </span> <span className='text-dark'>{item?.productName}</span></Col>
                                                                                <Col lg={4}> <span className='text-primary  fs-16 fw-bold'> Product Department : </span> <span className='text-dark'>{item?.departmentName}</span></Col>
                                                                                <Col lg={4}> <span className='text-primary fs-16 fw-bold'> Start Date : </span> <span className='text-dark'> <DateFormatter dateString={item.createdDate} /></span></Col>
                                                                            </Row>
                                                                            <Row>
                                                                                <Col lg={4}> <span className='text-primary fs-16 fw-bold'> End Date : </span> <span className='text-dark'> {item?.endDate}</span></Col>
                                                                            </Row>
                                                                        </div>


                                                                        <Row>
                                                                            <Col lg={6}>
                                                                                <div className="d-flex justify-content-between bg-light p-1 profilebar">
                                                                                    <h4 className='text-primary d-flex align-items-center m-0 py-1'><i className="ri-file-list-line me-2 text-primary "></i> CheckList </h4>
                                                                                </div>
                                                                                <Table hover className="bg-white custom-table">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th>Name</th>
                                                                                            <th className='w-100px text-center'>Status</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {item.getProductChecklistByProductNames.map((list) => (
                                                                                            <tr key={list.name}>
                                                                                                <td>{list.name}</td>
                                                                                                <td className='text-center'>
                                                                                                    <input
                                                                                                        type="checkbox"
                                                                                                        checked={list.status === 1}
                                                                                                    />
                                                                                                </td>
                                                                                            </tr>
                                                                                        ))}
                                                                                    </tbody>
                                                                                </Table>
                                                                            </Col>
                                                                            <Col lg={6}>
                                                                                <div className="d-flex justify-content-between bg-light p-1 profilebar">
                                                                                    <h4 className='text-primary d-flex align-items-center m-0 py-1'><i className="ri-file-list-line me-2 text-primary "></i> Document </h4>
                                                                                </div>
                                                                                <Table hover className="bg-white custom-table">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th>File Name</th>
                                                                                            <th className='text-center'>Download</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className='my-3'>
                                                                                                    <h5>Product Note</h5>
                                                                                                    {item.downloadDocuments?.filter(doc => doc.type === "Product Note").map((doc) => (
                                                                                                        <div key={doc.id}>
                                                                                                            {doc.fileUrls.map((fileUrl, index) => (
                                                                                                                <div key={index}>
                                                                                                                    <Button className='p-0'
                                                                                                                        variant="link"
                                                                                                                        onClick={() => downloadFiles(fileUrl, doc.files.split('\\').pop())}
                                                                                                                    >
                                                                                                                        <i className="ri-download-2-fill me-2"></i>
                                                                                                                        {getFileName(doc.files)}
                                                                                                                    </Button>
                                                                                                                </div>
                                                                                                            ))}
                                                                                                        </div>
                                                                                                    ))}
                                                                                                    <hr />

                                                                                                    <h5>Internal Financial Control IFC</h5>
                                                                                                    {item.downloadDocuments?.filter(doc => doc.type === "Internal Financial Control IFC").map((doc) => (
                                                                                                        <div key={doc.id}>
                                                                                                            {doc.fileUrls.map((fileUrl, index) => (
                                                                                                                <div key={index}>
                                                                                                                    <Button className='p-0'
                                                                                                                        variant="link"
                                                                                                                        onClick={() => downloadFiles(fileUrl, doc.files.split('\\').pop())}
                                                                                                                    >
                                                                                                                        <i className="ri-download-2-fill me-2"></i>
                                                                                                                        {getFileName(doc.files)}
                                                                                                                    </Button>
                                                                                                                </div>
                                                                                                            ))}
                                                                                                        </div>
                                                                                                    ))}
                                                                                                    <hr />
                                                                                                    <h5>Final Signed Note</h5>
                                                                                                    {item.downloadDocuments?.filter(doc => doc.type === "Final Signed Note").map((doc) => (
                                                                                                        <div key={doc.id}>
                                                                                                            {doc.fileUrls.map((fileUrl, index) => (
                                                                                                                <div key={index}>
                                                                                                                    <Button className='p-0'
                                                                                                                        variant="link"
                                                                                                                        onClick={() => downloadFiles(fileUrl, doc.files.split('\\').pop())}
                                                                                                                    >
                                                                                                                        <i className="ri-download-2-fill me-2"></i>
                                                                                                                        {getFileName(doc.files)}
                                                                                                                    </Button>
                                                                                                                </div>
                                                                                                            ))}
                                                                                                        </div>
                                                                                                    ))}
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>



                                                                                </Table>
                                                                            </Col>
                                                                        </Row>
                                                                        <Col className="d-flex justify-content-end">
                                                                            <ButtonGroup>
                                                                                <Button className='me-1' onClick={handleReject}>Reject</Button>
                                                                                <Link to={`/pages/DiscussionForum/${item.id}/${item.departmentName}`}>
                                                                                    <Button className='me-1'>Discussion Board</Button>
                                                                                </Link>
                                                                                <Button onClick={() => handleSubmit(item.id)}>Sign Off</Button>
                                                                            </ButtonGroup>
                                                                        </Col>
                                                                    </div>
                                                                </Collapse>
                                                            </td>
                                                        </tr>
                                                        : ''
                                                    }
                                                </>

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
                        )}
                    </div>
                </>

            )}

            <Modal show={showReject} onHide={() => setShowReject(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Rejection Reason</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="rejectionReason">
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary">Submit</Button>
                </Modal.Footer>
            </Modal>

            {/* <PaginationComponent currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} /> */}
            <ApprovalPopup show={show} setShow={setShow} manageId={manageId} />
        </div>


    );
};

export default EmployeeMaster;