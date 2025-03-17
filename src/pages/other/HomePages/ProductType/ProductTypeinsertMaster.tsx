import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance';

interface Employee {
    _id: string;
    productTypeName: string;
    description: string;
    status: string;
    createdBy: string;
    updatedBy: string;
}


const EmployeeMasterInsert = () => {
    const { id } = useParams<{ id: any }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [employee, setEmployee] = useState<Employee>({
        _id: '',
        productTypeName: '',
        description: '',
        status: '',
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
            fetchEmployeeById(id);
        } else {
            setEditMode(false);
        }
    }, [id]);

    const fetchEmployeeById = async (id: string) => {
        try {
            const response = await axiosInstance.get(`${config.API_URL}/ProductType/${id}`);
            if (response.data.isSuccess) {
                const fetchedEmployee = response.data.productType;
                setEmployee(fetchedEmployee);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching employee:', error);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEmployee({
            ...employee,
            [name]: value
        });
    };

    const validateFields = (): boolean => {
        const errors: { [key: string]: string } = {};
        if (!employee.productTypeName) errors.productTypeName = 'User Name is required';
        if (!employee.description) errors.description = 'Description is required';
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
            ...employee,
            createdBy: editMode ? employee.createdBy : empName,
            updatedBy: editMode ? empName : '',
        };

        console.log(payload)

        try {
            const apiUrl = editMode
                ? `${config.API_URL}/ProductType/UpdateProductType`
                : `${config.API_URL}/ProductType/InsertProductType`;

            const response = await axiosInstance.post(apiUrl, payload);
            if (response.status === 200) {
                navigate('/pages/ProductTypeMaster', {
                    state: {
                        successMessage: editMode
                            ? `Record updated successfully!`
                            : `Record added successfully!`
                    }
                });
            } else {
                toast.error(response.data.message || 'Failed to process request');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error Adding/Updating');
            console.error('Error submitting employee:', error);
        }
    };

    return (
        <div>
            <div className="container ">
                <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <span><i className="ri-file-list-line me-2"></i><span className='fw-bold'>{editMode ? 'Edit Product Type' : 'Add Product Type'}</span></span>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="productTypeName" className="mb-3">
                                    <Form.Label><i className="ri-user-line"></i> Product Type <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="productTypeName"
                                        value={employee.productTypeName}
                                        onChange={handleChange}
                                        placeholder='Enter Product Type'
                                        className={validationErrors.productTypeName ? "input-border" : ""}
                                    />
                                    {validationErrors.productTypeName && <small className="text-danger">{validationErrors.productTypeName}</small>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="description" className="mb-3">
                                    <Form.Label><i className="ri-user-line"></i> Description <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="description"
                                        value={employee.description}
                                        onChange={handleChange}
                                        placeholder='Enter Product Type'
                                        className={validationErrors.description ? "input-border" : ""}
                                    />
                                    {validationErrors.description && <small className="text-danger">{validationErrors.description}</small>}
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
                                            value="Active"
                                            label="Active"
                                            checked={employee.status === 'Active'}
                                            onChange={handleChange}
                                        />
                                        <Form.Check
                                            inline
                                            type="radio"
                                            id="statusInactive"
                                            name="status"
                                            value="Inactive"
                                            label="Inactive"
                                            checked={employee.status === 'Inactive'}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col className='align-items-end d-flex justify-content-end mb-3'>
                                <div>
                                    <Link to={'/pages/ProductTypeMaster'}>
                                        <Button variant="primary">
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update ' : 'Add '} Product Type
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

export default EmployeeMasterInsert;
