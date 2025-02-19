import { useState, useEffect } from 'react';
import { Button, Table, Container, Row, Col, Alert, Card, Popover, OverlayTrigger } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PaginationComponent from '../../Component/PaginationComponent';
import axiosInstance from '@/utils/axiosInstance';


interface Manager {
    id: number;
    departmentID: string;
    departmentName: string;
    departmentStatus: string;
    unresolvedQueries: string;
    productName: string;
    startDate: string;
    productID: string;
}


interface Column {
    id: string;
    label: string;
    visible: boolean;
}

const DiscussionList = () => {
    const { id } = useParams();
    const [discussionlist, setDiscussionlist] = useState<Manager[]>([]);
    const [headerName, setHeaderName] = useState<Manager | null>(null);
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
        { id: 'departmentCode', label: 'Department Code  ', visible: true },
        { id: 'departmentName', label: 'Department Name ', visible: true },
        { id: 'departmentStatus', label: 'Department Status ', visible: true },
        { id: 'SignedoffDAte', label: 'Signed off Date ', visible: true },
        { id: 'unresolvedQueries', label: 'Unresolved Queries ', visible: true },


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

    }, [currentPage]);

    console.log(headerName)


    const fetchEmployee = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${config.API_URL}/DiscussionForm/GetDiscussionFormList`, {
                params: { PageIndex: currentPage, ProductID: id }
            });

            if (response.data.isSuccess) {
                const fetchedData = response.data.list;
                console.log(fetchedData)
                if (fetchedData.length > 0 && fetchedData[0].getProducts.length > 0) {
                    setHeaderName(fetchedData[0].getProducts[0]);
                }
                let departmentMap = new Map(); // Track unique departments

                fetchedData.forEach((item: any) => {
                    const listDepartmentName = item.departmentName;
                    const status = item.status; // Extract status from the list

                    item.getProducts.forEach((product: any) => {
                        product.departmentList.forEach((department: any) => {
                            const departmentKey = department.departmentID; // Unique key for departments

                            let departmentStatus = department.departmentName === listDepartmentName
                                ? (status === 1 ? "Signed Off" : "Not Signed Off")
                                : "Not Signed Off"; // Default to "Not Signed Off"

                            let signOffDate = departmentStatus === "Signed Off" ? department.startDate : "-"; // Show date only if Signed Off

                            // Ensure only one record per department, prioritize "Signed Off"
                            if (!departmentMap.has(departmentKey)) {
                                departmentMap.set(departmentKey, {
                                    id: department.departmentID,
                                    // departmentCode: department.departmentID,
                                    departmentName: department.departmentName,
                                    SignedoffDAte: signOffDate,
                                    departmentStatus: departmentStatus,
                                    unresolvedQueries: "0",
                                });
                            } else {
                                // Prioritize "Signed Off" over "Not Signed Off" and update date accordingly
                                let existingRecord = departmentMap.get(departmentKey);
                                if (existingRecord.departmentStatus === "Not Signed Off" && departmentStatus === "Signed Off") {
                                    departmentMap.set(departmentKey, {
                                        ...existingRecord,
                                        departmentStatus: "Signed Off",
                                        SignedoffDAte: signOffDate, // Keep signed off date only for signed off
                                    });
                                }
                            }
                        });
                    });
                });

                setDiscussionlist(Array.from(departmentMap.values())); // Convert Map back to array
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const ActionMenu: React.FC<{ item: Manager }> = ({ item }) => {
        const popover = (
            <Popover id={`popover-action-${item.id}`} className="shadow">
                <Popover.Body className="p-2">
                    <Button variant="link" as={Link as any} to={`/pages/discussionForum/${headerName?.productID}/${item.departmentName}`} className="d-block text-start">
                        <i className="ri-file-list-line me-2"></i> Discussion Board
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

    return (

        <div className='p-3 mt-3 bg-white'>
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
                        <li className="p-1" aria-current="page">Discussion Board</li>
                    </ul>
                </nav>

                <div className='my-2'>
                    <Row>
                        <Col lg={5}> <span className='text-primary fs-16 fw-bold'> Product : </span> <span className='text-dark'>{headerName?.productName}</span></Col>
                        <Col lg={4}> <span className='text-primary  fs-16 fw-bold'> Product Department : </span> <span className='text-dark'>{headerName?.departmentName}</span></Col>
                        <Col lg={3}> <span className='text-primary fs-16 fw-bold'> Start Date : </span> <span className='text-dark'>{headerName?.startDate}</span></Col>
                        <Col lg={5}> <span className='text-primary fs-16 fw-bold'> End Date : </span> <span className='text-dark'> -</span></Col>
                    </Row>
                </div>
            </Card>


            {loading ? (
                <div className='loader-container'>
                    <div className="loader"></div>
                    <div className='mt-2'>Please Wait!</div>
                </div>
            ) : (
                <>

                    <div className="overflow-auto text-nowrap ">
                        {!discussionlist ? (
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
                                                                    <div ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}>
                                                                        {column.id === 'managerName' && (<i className="ri-user-line"></i>)}
                                                                        {column.id === 'departmentName' && (<i className="ri-briefcase-line"></i>)}
                                                                        {column.id === 'status' && (<i className="ri-flag-line"></i>)}
                                                                        &nbsp; {column.label}
                                                                    </div>
                                                                </th>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    <th className='text-center'>Action</th>
                                                </tr>
                                            )}
                                        </Droppable>
                                    </thead>
                                    <tbody>
                                        {discussionlist.length > 0 ? (
                                            discussionlist.slice(0, 10).map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                    {columns.filter(col => col.visible).map((col) => (
                                                        <td key={col.id}
                                                            className={
                                                                (col.id === 'departmentStatus' && item[col.id] === "Signed Off") ? 'task1' :
                                                                    (col.id === 'departmentStatus' && item[col.id] === "Not Signed Off") ? 'task4' :
                                                                        ''
                                                            }
                                                        >
                                                            <div>{item[col.id as keyof Manager]}</div>
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
                                                                    <h4>No Data  Found</h4>
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
                        )}
                    </div>
                </>

            )}

            <PaginationComponent currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </div>
    );
};

export default DiscussionList;