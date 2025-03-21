
import { useState, useEffect } from 'react';
import { Button, Table, Container, Row, Col, Alert, Form, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PaginationComponent from '../../Component/PaginationComponent';
import axiosInstance from '@/utils/axiosInstance';



interface CheckList {
    id: number;
    departmentName: string;
    status: number;
    [key: string]: any; // For dynamic properties like column data
}


interface Column {
    id: string;
    label: string;
    visible: boolean;
}


interface DepartmentList {
    id: number;
    departmentName: string;
}

const DesignationMaster = () => {
    const [checkLists, setCheckLists] = useState<CheckList[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [departmentList, setDepartmentList] = useState<DepartmentList[]>([]);
    const [searchDept, setSearchDept] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [searchTriggered, setSearchTriggered] = useState(false);



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
        { id: 'name', label: 'Checklist Name', visible: true },
        { id: 'productType', label: 'Product Type', visible: true },
        { id: 'status', label: 'Status', visible: true },
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
            const response = await axiosInstance.get(`${config.API_URL}/CheckList/GetCheckList/GetCheckList`, {
                params: { PageIndex: currentPage }
            });
            if (response.data.isSuccess) {
                setCheckLists(response.data.checkListLists);
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
        if (searchDept || searchStatus) {
            handleSearch();
        } else {
            fetchData();
        }
    }, [currentPage, searchDept, searchStatus, searchTriggered]);




    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        let query = `?`;
        if (searchDept) query += `DepartmentName=${searchDept}&`;
        if (searchStatus) query += `Status=${searchStatus}&`;
        query += `PageIndex=${currentPage}`;

        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const apiUrl = `${config.API_URL}/DepartmentMaster/SearchDepartment${query}`;
        axiosInstance.get(apiUrl, { headers: { 'accept': '*/*' } })
            .then((response) => {
                console.log("search response ", response.data.departments);
                setCheckLists(response.data.departments)
                setTotalPages(Math.ceil(response.data.totalCount / 10));
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };



    useEffect(() => {
        const fetchData = async (endpoint: string, setter: Function, listName: string) => {
            try {
                const response = await axiosInstance.get(`${config.API_URL}/${endpoint}`);
                if (response.data.isSuccess) {
                    setter(response.data[listName]);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error);
            }
        };
        fetchData('CommonDropdown/GetDepartment', setDepartmentList, 'getDepartments');
    }, []);

    const handleClear = async () => {
        setCurrentPage(1);
        setSearchDept('');
        setSearchStatus('')
        await new Promise(resolve => setTimeout(resolve, 200));
        await fetchData();
    };


    const convertToCSV = (data: CheckList[]) => {
        const csvRows = [
            [
                'ID',
                'Checklist Name',
                'Product Type',
                'Status',
                'Created By',
                'Updated By'
            ],
            ...data.map(checkList => [
                checkList.id,
                checkList.name,
                checkList.productType,
                checkList.status === 1 ? 'Active' : 'Inactive', // Converting status to readable format
                checkList.createdBy,
                checkList.updatedBy
            ])
        ];
        return csvRows.map(row => row.join(',')).join('\n');
    };



    const downloadCSV = () => {
        const csvData = convertToCSV(checkLists);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'Department Master.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };


    const optionsEmpStatus = [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
    ];


    return (
        <div className='p-3 mt-3 bg-white'>
            <Row className=' mb-2 px-2'>
                <div className="d-flex justify-content-between profilebar p-1">
                    <h4 className='text-primary d-flex align-items-center m-0'><i className="ri-file-list-line me-2 text-primary "></i> Manage CheckList  </h4>
                    <div className="d-flex justify-content-end bg-light w-50 profilebar">
                        <Button variant="primary" onClick={downloadCSV} className="me-2">
                            Download CSV
                        </Button>
                        <Link to='/pages/CheckListMasterinsert'>
                            <Button variant="primary" className="">
                                Add CheckList
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
                    <div className='bg-white p-2 pb-2'>
                        <Form onSubmit={async (e) => {
                            e.preventDefault();
                            setCurrentPage(1);
                            setSearchTriggered(true);
                        }}
                        >
                            <Row>
                                <Col lg={4}>
                                    <Form.Group controlId="searchDept">
                                        <Form.Label>Product Type</Form.Label>
                                        <Select
                                            name="searchDept"
                                            value={departmentList.find(item => item.departmentName === searchDept) || null}
                                            onChange={(selectedOption) => setSearchDept(selectedOption ? selectedOption.departmentName : '')}
                                            options={departmentList}
                                            getOptionLabel={(item) => item.departmentName}
                                            getOptionValue={(item) => item.departmentName}
                                            isSearchable={true}
                                            placeholder="Select Product Type"
                                            className="h45"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col lg={4}>
                                    <Form.Group controlId="searchDept">
                                        <Form.Label>CheckList Name</Form.Label>
                                        <Select
                                            name="searchDept"
                                            value={departmentList.find(item => item.departmentName === searchDept) || null}
                                            onChange={(selectedOption) => setSearchDept(selectedOption ? selectedOption.departmentName : '')}
                                            options={departmentList}
                                            getOptionLabel={(item) => item.departmentName}
                                            getOptionValue={(item) => item.departmentName}
                                            isSearchable={true}
                                            placeholder="Select CheckList Name"
                                            className="h45"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col lg={4} className="">
                                    <Form.Group controlId="searchStatus">
                                        <Form.Label>Status</Form.Label>
                                        <Select
                                            name="searchStatus"
                                            options={optionsEmpStatus}
                                            value={optionsEmpStatus.find(option => option.value === searchStatus) || null}
                                            onChange={(selectedOption) => setSearchStatus(selectedOption?.value || '')}
                                            placeholder="Select Status"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col></Col>
                                <Col lg={4} className="align-items-end d-flex justify-content-end mt-3">
                                    <ButtonGroup aria-label="Basic example" className="w-100">
                                        <Button type="button" variant="primary" onClick={handleClear}>
                                            <i className="ri-loop-left-line"></i>
                                        </Button>
                                        &nbsp;
                                        <Button type="submit" variant="primary"

                                        >
                                            Search
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </Form>



                        <Row className='mt-3'>
                            <div className="d-flex justify-content-end bg-light p-1">
                                <div className="app-search d-none d-lg-block me-4">
                                </div>

                            </div>
                        </Row>
                    </div>

                    <div className="overflow-auto text-nowrap">
                        {!checkLists ? (
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
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Table hover className="bg-white custom-table">
                                    <thead>
                                        <Droppable droppableId="columns" direction="horizontal">
                                            {(provided) => (
                                                <tr {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}>
                                                    <th><i className="ri-list-ordered-2"></i> Sr. No</th>
                                                    {columns.filter(col => col.visible).map((column, index) => (
                                                        <Draggable key={column.id} draggableId={column.id} index={index}>
                                                            {(provided) => (
                                                                <th>
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        {column.id === 'departmentName' && (<i className="ri-group-fill"></i>)}
                                                                        {column.id === 'status' && (<i className="ri-file-list-fill"></i>)}
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
                                        {checkLists.length > 0 ? (
                                            checkLists.slice(0, 10).map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                    {columns.filter(col => col.visible).map((col) => (
                                                        <td key={col.id} className={col.id === 'departmentName' ? 'fw-bold text-dark' : ''}>
                                                            {col.id === 'status' ? (item.status === 1 ? 'Active' : 'Inactive') : (
                                                                <div>{item[col.id as keyof CheckList]}</div>
                                                            )}
                                                        </td>
                                                    ))}
                                                    {/* <td className="text-center">
                                                        <Link to={`/pages/CheckListMasterinsert/${item.id}`}>
                                                            <Button variant="primary" className="p-0 text-white">
                                                                <i className="btn ri-edit-line text-white"></i>
                                                            </Button>
                                                        </Link>
                                                    </td> */}
                                                    <td className='text-center'>
                                                        <Link to={`/pages/CheckListMasterinsert/${item.id}`}>
                                                            <Button variant='primary' className='p-0 text-white me-3'>
                                                                <i className='btn ri-edit-line text-white' ></i>
                                                            </Button>

                                                        </Link>
                                                        <Button variant='primary' className='p-0 text-white'>
                                                            <i className=" btn ri-delete-bin-6-line text-white"></i>
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
                        )}
                    </div>
                </>
            )}

            <PaginationComponent currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />


        </div>
    );
};

export default DesignationMaster;