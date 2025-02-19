import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance';

interface Manager {
    id: number;
    managerName: string;
    departmentID: number;
    status: number;
    createdBy: string;
    updatedBy: string;
}

interface Department {
    id: number;
    departmentName: string;
}

const ManagerMasterInsert = () => {
    const { id } = useParams<{ id: any }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [departmentList, setDepartmentList] = useState<Department[]>([]);
    const [manager, setManager] = useState<Manager>({
        id: 0,
        managerName: '',
        departmentID: 0,
        status: 0,
        createdBy: '',
        updatedBy: ''
    });

    useEffect(() => {
        toast.dismiss();
        const storedEmpName = localStorage.getItem('EmpName');
        const storedEmpID = localStorage.getItem('EmpId');
        if (storedEmpName && storedEmpID) {
            setEmpName(`${storedEmpName} - ${storedEmpID}`);
        } else {
            setEmpName('Unknown');
        }
    }, []);

    useEffect(() => {
        if (id) {
            setEditMode(true);
            fetchManagerById(id);
        } else {
            setEditMode(false);
        }
    }, [id]);

    const fetchManagerById = async (id: string) => {
        try {
            const response = await axiosInstance.get(`${config.API_URL}/Manager/GetManagerList?Flag=2`, {
                params: { id }
            });
            if (response.data.isSuccess) {
                const fetchedManager = response.data.managerList[0];
                setManager(fetchedManager);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching manager:', error);
        }
    };

    useEffect(() => {
        const fetchData = async (endpoint: string, setter: Function, listName: string) => {
            try {
                const response = await axiosInstance.get(`${config.API_URL}/${endpoint}`);
                if (response.data.isSuccess) {
                    setter(response.data[listName] as Department[]);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error);
            }
        };

        fetchData('CommonDropdown/GetDepartmentList?Flag=2', setDepartmentList, 'getDepartmentLists');
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'radio' ? parseInt(value, 10) : value;
        setManager({
            ...manager,
            [name]: parsedValue
        });
    };

    const validateFields = (): boolean => {
        const errors: { [key: string]: string } = {};
        if (!manager.managerName) errors.managerName = 'Manager Name is required';
        if (!manager.departmentID) errors.departmentID = 'Department Name is required';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.dismiss();

        if (!validateFields()) {
            toast.error('Please fill in all required fields.');
            return;
        }

        const payload = {
            ...manager,
            createdBy: editMode ? manager.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };

        try {
            const apiUrl = `${config.API_URL}/Manager/InsertUpdateManager`;
            const response = await axiosInstance.post(apiUrl, payload);
            if (response.status === 200) {
                navigate('/pages/managerMaster', {
                    state: {
                        successMessage: editMode
                            ? `Record updated successfully!`
                            : `Record    added successfully!`
                    }
                });
            } else {
                toast.error(response.data.message || 'Failed to process request');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error Adding/Updating');
            console.error('Error submitting manager:', error);
        }
    };

    return (
        <div>
            <div className=" bg-white  p-3 mt-3">
                <div className="d-flex profilebar p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <h4 className='text-primary m-0'>
                        <i className="ri-file-list-line me-2"></i>
                        <span className="fw-bold">{editMode ? 'Edit Manager' : 'Add Manager'}</span>
                    </h4>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="departmentID" className="mb-3">
                                    <Form.Label> <i className="ri-building-line"></i> Department Name <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        name="departmentID"
                                        value={departmentList.find((emp) => emp.id === manager.departmentID)}
                                        onChange={(selectedOption) => {
                                            setManager({
                                                ...manager,
                                                departmentID: selectedOption?.id || 0,
                                            });
                                        }}
                                        getOptionLabel={(emp) => emp.departmentName}
                                        getOptionValue={(emp) => String(emp.id)}
                                        options={departmentList}
                                        isSearchable={true}
                                        placeholder="Select Department Name"
                                        className={validationErrors.departmentID ? "input-border" : ""}
                                    />
                                    {validationErrors.departmentID && <small className="text-danger">{validationErrors.departmentID}</small>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="managerName" className="mb-3">
                                    <Form.Label><i className="ri-user-line"></i> Manager Name <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="managerName"
                                        value={manager.managerName}
                                        onChange={handleChange}
                                        placeholder='Enter Manager Name'
                                        className={validationErrors.managerName ? "input-border" : ""}
                                    />
                                    {validationErrors.managerName && <small className="text-danger">{validationErrors.managerName}</small>}
                                </Form.Group>
                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="status" className="mb-3">
                                    <Form.Label><i className="ri-flag-line"></i> Status</Form.Label>
                                    <div className="d-flex mt-1">
                                        <Form.Check
                                            inline
                                            type="radio"
                                            id="statusActive"
                                            name="status"
                                            value={1}
                                            label="Active"
                                            checked={manager.status === 1}
                                            onChange={handleChange}
                                        />
                                        <Form.Check
                                            inline
                                            type="radio"
                                            id="statusInactive"
                                            name="status"
                                            value={0}
                                            label="Inactive"
                                            checked={manager.status === 0}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {validationErrors.status && <small className="text-danger">{validationErrors.status}</small>}
                                </Form.Group>
                            </Col>

                            <Col className='align-items-end d-flex justify-content-end mb-3'>
                                <div>
                                    <Link to={'/pages/managerMaster'}>
                                        <Button variant="primary">
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Manager' : 'Add Manager'}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ManagerMasterInsert;
