import { useState, useEffect } from 'react';
import { Button, Table, Container, Row, Col, Alert, Card, Popover, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PaginationComponent from '@/pages/other/Component/PaginationComponent';
import axiosInstance from '@/utils/axiosInstance';
import RejectPopup from '../ProductMaster/ConvenerLevel2/RejectPopup';
import TabNavigation from '../../Component/TabNavigation';


interface Product {
    id: number;
    productType: string;
    productName: string;
    productDescription: string;
    originator: string;
    authorizedSignatory: string;
    assignee: string;
    mobileNumber: string;
    isApproved: number;
    fileUpload: string;
    createdBy: string;
    updatedBy: string;
}


interface Column {
    id: string;
    label: string;
    visible: boolean;
}


const NewProductPendingCirculation = () => {
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [project, setProject] = useState<Product[]>([]);
    const [manageId, setManageID] = useState<number>();
    const [show, setShow] = useState(false);


    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (location.state?.successMessage) {
            toast.dismiss()
            toast.success(location.state.successMessage);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate]);



    const [columns, setColumns] = useState<Column[]>([
        { id: 'productName', label: 'Product Name ', visible: true },
        { id: 'productType', label: 'Product Type', visible: true },
        { id: 'originator', label: 'Originator', visible: true },
        { id: 'mobileNumber', label: 'Mobile Number', visible: true },
        { id: 'startDate', label: 'Start Date', visible: true },
        { id: 'dayslappesd', label: 'Day Laps', visible: true },
        { id: 'uploadedOn', label: 'SignOff By Department', visible: true },
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
        fetchDetailsMain();
    }, [currentPage]);

    const fetchDetailsMain = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${config.API_URL}/Product/GetProduct`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setProject(response.data.getProducts);
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
    console.log(project)

    const ActionMenu: React.FC<{ item: Product }> = ({ item }) => {
        const popover = (
            <Popover id={`popover-action-${item.id}`} className="shadow">
                <Popover.Body className="p-2">
                    <Button variant="link" as={Link as any} to={`/AddProduct/${item.id}`} className="d-block text-start">
                        <i className="ri-file-list-line me-2"></i> View Document
                    </Button>
                    <Button variant="link" onClick={() => handleEdit(item)} className="d-block text-start text-danger" disabled={item.isApproved === 2} >
                        <i className="ri-close-line me-2"></i> Reject
                    </Button>
                    <Button variant="link" onClick={() => handleRework(item.id)} className="d-block text-start text-warning" disabled={item.isApproved === 2} >
                        <i className="ri-reply-line me-2"></i> Send for Rework
                    </Button>

                    <Button variant="link" onClick={() => handleSubmit(item.id)} className="d-block text-start text-success" disabled={item.isApproved === 2}>
                        <i className="ri-checkbox-circle-line me-2"></i>{item.isApproved === 2 ? 'Approved' : 'Approve'}
                    </Button>
                    <Button variant="link" as={Link as any} to={`/pages/AssigneeDepartment/${item.id}`} className="d-block text-start text-primary">
                        <i className="ri-share-forward-line me-2"></i> Circulate
                    </Button>
                </Popover.Body>
            </Popover>
        );

        return (
            <OverlayTrigger trigger="click" rootClose placement="left" overlay={popover}>
                <span style={{ cursor: "pointer", padding: "5px" }}>
                    <i className="ri-more-2-line fs-20 fw-bold"></i>
                </span>
            </OverlayTrigger>
        );
    };

    const handleRework = async (id: any) => {

        toast.dismiss();
        const payload = {
            id: id,
            isRejected: 1,
        };
        console.log(payload)

        try {
            const apiUrl = `${config.API_URL}/Product/ApproveRejectProduct`;
            const response = await axiosInstance.post(apiUrl, payload);
            if (response.status === 200) {
                window.location.reload();
                toast.success(response.data.message || 'Approved Successfully');
            } else {
                toast.error(response.data.message || 'Failed to process request');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error Adding/Updating');
            console.error('Error submitting employee:', error);
        }
    };
    const handleSubmit = async (id: any) => {

        toast.dismiss();
        const payload = {
            id: id,
            isApproved: 2,
        };
        console.log(payload)

        try {
            const apiUrl = `${config.API_URL}/Product/ApproveRejectProduct`;
            const response = await axiosInstance.post(apiUrl, payload);
            if (response.status === 200) {
                navigate(`/pages/AssigneeDepartment/${id}`)
                toast.success(response.data.message || 'Approved Successfully');
            } else {
                toast.error(response.data.message || 'Failed to process request');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error Adding/Updating');
            console.error('Error submitting employee:', error);
        }
    };



    const handleShow = () => setShow(true);
    const handleEdit = (item: any) => {
        handleShow();
        setManageID(item)
    };



    return (
        <>
            <div className="mt-3">
                <TabNavigation />
                <Row>
                    <Col sm={12} >
                        <Card className="p-0">
                            <Card.Body >

                                <div className='bg-white p-2 pb-2'>
                                    <Row className=''>
                                        <div className="d-flex justify-content-between profilebar p-1">
                                            <h4 className='text-primary d-flex align-items-center m-0'><i className="ri-file-list-line me-2 text-primary "></i>Product Pending Circulation </h4>
                                            <div className="d-flex justify-content-end bg-light w-50 profilebar">
                                                <div className="input-group w-50 me-4">
                                                    <input
                                                        type="text"
                                                        id="example-input1-group2"
                                                        name="example-input1-group2"
                                                        className="form-control"
                                                        placeholder="Search"
                                                    />
                                                    <span className="input-group-append">
                                                        <Button> <i className="ri-search-line fs-16"></i></Button>
                                                    </span>
                                                </div>

                                                <Button variant="primary" className="">
                                                    Download CSV
                                                </Button>
                                            </div>
                                        </div>
                                    </Row>
                                </div>

                                {loading ? (
                                    <div className='loader-container'>
                                        <div className="loader"></div>
                                        <div className='mt-2'>Please Wait!</div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="overflow-auto text-nowrap ">
                                            {!project ? (
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
                                                <>
                                                    <DragDropContext onDragEnd={handleOnDragEnd}>
                                                        <Table hover className='bg-white custom-table'>
                                                            <thead>
                                                                <Droppable droppableId="columns" direction="horizontal">
                                                                    {(provided) => (
                                                                        <tr {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}>
                                                                            <th><i className="ri-list-ordered-2"></i>  Sr. No</th>
                                                                            {columns.filter(col => col.visible).map((column, index) => (
                                                                                <Draggable key={column.id} draggableId={column.id} index={index}>
                                                                                    {(provided) => (
                                                                                        <th>
                                                                                            <div
                                                                                                ref={provided.innerRef}
                                                                                                {...provided.draggableProps}
                                                                                                {...provided.dragHandleProps}>
                                                                                                {column.id === 'productType' && (<i className="ri-macbook-line"></i>)}
                                                                                                {column.id === 'productName' && (<i className="ri-flag-line"></i>)}
                                                                                                {column.id === 'originator' && (<i className="ri-user-line"></i>)}
                                                                                                {column.id === 'mobileNumber' && (<i className="ri-phone-line"></i>)}
                                                                                                {column.id === 'createdDate' && (<i className="ri-refresh-line"></i>)}
                                                                                                &nbsp; {column.label}
                                                                                            </div>
                                                                                        </th>

                                                                                    )}
                                                                                </Draggable>
                                                                            ))}
                                                                            <th className='text-center'><i className="ri-pencil-line"></i> Action</th>
                                                                        </tr>
                                                                    )}
                                                                </Droppable>
                                                            </thead>
                                                            <tbody>
                                                                {project.length > 0 ? (
                                                                    project.slice(0, 10).map((item, index) => (
                                                                        <tr key={item.id}>
                                                                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                                            {columns.filter(col => col.visible).map((col) => (
                                                                                <td key={col.id}>
                                                                                    <div>{item[col.id as keyof Product]}</div>
                                                                                </td>
                                                                            ))}
                                                                            <td className='text-center'>

                                                                                <ActionMenu item={item} />
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
                                                                                            <p>You currently don't have any Data</p>
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
                                                    <PaginationComponent currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
                                                </>

                                            )}
                                        </div>
                                    </>

                                )}

                            </Card.Body>
                        </Card>
                    </Col>
                    <RejectPopup show={show} setShow={setShow} dataItem={manageId} />
                </Row>
            </div>

        </>
    );
};

export default NewProductPendingCirculation;