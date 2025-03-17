import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance';
import { useAuthContext } from '@/common';

interface Manager {
    id: number;
    roleName: string;
    description: string;
    status: number;
    createdBy: string;
    updatedBy: string;
}


const RoleMasterinsert = () => {
    const { user } = useAuthContext();
    const { id } = useParams<{ id: any }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [manager, setManager] = useState<Manager>({
        id: 0,
        roleName: '',
        description: '',
        status: 0,
        createdBy: '',
        updatedBy: ''
    });


    useEffect(() => {
        toast.dismiss();
        if (user?.userId) {
            setEmpName(`${user?.userId}`);
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
            const response = await axiosInstance.get(`${config.API_URL}/RoleMaster/GetRole`, {
                params: { id }
            });
            if (response.data.isSuccess) {
                const fetchedManager = response.data.roleMasterListResponses[0];
                setManager(fetchedManager);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching manager:', error);
        }
    };


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
        if (!manager.roleName) errors.managerName = 'Role Name is required';
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

        console.log(payload)
        try {
            const apiUrl = editMode
                ? `${config.API_URL}/Role/updateRolebyId`
                : `${config.API_URL}/Role/InserUpdateRole`;

            const response = await axiosInstance.post(apiUrl, payload);

            if (response.status === 200 || 201) {
                navigate('/pages/RoleMaster', {
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
            console.error('Error submitting manager:', error);
        }
    };

    return (
        <div>
            <div className=" bg-white  p-3 mt-3">
                <div className="d-flex profilebar p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <h4 className='text-primary m-0'>
                        <i className="ri-file-list-line me-2"></i>
                        <span className="fw-bold">{editMode ? 'Edit ' : 'Add '} Role</span>
                    </h4>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="roleName" className="mb-3">
                                    <Form.Label><i className="ri-user-line"></i> Role Name <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="roleName"
                                        value={manager.roleName}
                                        onChange={handleChange}
                                        placeholder='Enter Role Name'
                                        className={validationErrors.roleName ? "input-border" : ""}
                                    />
                                    {validationErrors.roleName && <small className="text-danger">{validationErrors.roleName}</small>}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="description" className="mb-3">
                                    <Form.Label><i className="ri-user-line"></i> Description <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        rows={1}
                                        value={manager.description}
                                        onChange={handleChange}
                                        placeholder='Enter Description'
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
                                    <Link to={'/pages/RoleMaster'}>
                                        <Button variant="primary">
                                            Back
                                        </Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update ' : 'Add '} Role
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

export default RoleMasterinsert;
