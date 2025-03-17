import { useEffect, useState, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import Select from 'react-select';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance';

interface Employee {
    _id: string
    userId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    departmentId: string;
    departmentName: string;
    designation: string;
    location: string;
    status: string;
    roles: string[];
    password: string;
    createdBy: string;
    updatedBy: string;
}


interface Department {
    id: string;
    departmentName: string;
}
interface RoleName {
    _id: string;
    roleName: string;
}



const EmployeeMasterInsert = () => {
    const { id } = useParams<{ id: any }>();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [empName, setEmpName] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [departmentList, setDepartmentList] = useState<Department[]>([]);
    const [roleList, setRoleList] = useState<RoleName[]>([]);
    const [employee, setEmployee] = useState<Employee>({
        _id: '',
        userId: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        departmentId: '',
        departmentName: '',
        designation: '',
        location: '',
        password: '',
        status: 'Active',
        roles: [],
        createdBy: '',
        updatedBy: '',
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
            const response = await axiosInstance.get(`${config.API_URL}/Employee/${id}`);
            console.log(response)
            if (response.data.isSuccess) {
                console.log("hi")
                const fetchedEmployee = response.data.employee;
                console.log(fetchedEmployee)
                setEmployee(fetchedEmployee);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching employee:', error);
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
        fetchData('CommonDropdown/GetRoleList', setRoleList, 'roles');

    }, []);

    const handleChange = (e: ChangeEvent<any> | null, name?: string, value?: any) => {
        if (e) {
          const { name: eventName, value, type } = e.target;
      
          if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setEmployee({
              ...employee,
              [eventName]: checked
            });
          } else {
            setEmployee({
              ...employee,
              [eventName]: value // No parsing, we just take the string directly
            });
          }
        } else if (name) {
          setEmployee({
            ...employee,
            [name]: value
          });
        }
      };


    const validateFields = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!employee.fullName.trim()) errors.fullName = 'Full Name is required';
        if (!employee.email.trim()) errors.email = 'Email is required';
        if (!employee.phoneNumber.trim()) errors.phoneNumber = 'Phone Number is required';
        if (!employee.departmentId.trim()) errors.departmentId = 'Department Name is required';
        if (!employee.designation.trim()) errors.designation = 'Designation is required';
        if (!employee.location.trim()) errors.location = 'Location is required';
        if (!employee.password.trim()) errors.password = 'Password is required';

        // Validate roles (array)
        if (!employee.roles || employee.roles.length === 0) {
            errors.roles = 'At least one role must be selected';
        }

        if (!employee.status.trim()) errors.status = 'Status is required';

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
            updatedBy: editMode ? empName : ''
        };

        try {
            const apiUrl = editMode
                ? `${config.API_URL}/Employee/updateEmployee`
                : `${config.API_URL}/Employee/InsertEmployee`;

            const axiosMethod = editMode ? axiosInstance.put : axiosInstance.post;

            const response = await axiosMethod(apiUrl, payload);

            if (response.status === 200) {
                toast.success(editMode ? 'Employee updated successfully!' : 'Employee added successfully!');
                navigate('/pages/EmployeeMaster', {
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
            toast.error(error.message || 'Error Adding/Updating Employee');
            console.error('Error submitting employee:', error);
        }
    };



    return (
        <div>
            <div className=" bg-white  p-3 mt-3">
                <div className="d-flex profilebar p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <h4 className='text-primary m-0'>
                        <i className="ri-file-list-line me-2"></i>
                        <span className="fw-bold">{editMode ? 'Edit Employee' : 'Add Employee'}</span>
                    </h4>
                </div>
                <div className='bg-white p-2 rounded-3 border'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            {/* Full Name */}
                            <Col lg={6}>
                                <Form.Group controlId="fullName" className="mb-3">
                                    <Form.Label><i className="ri-user-line"></i> Full Name <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fullName"
                                        value={employee.fullName}
                                        onChange={handleChange}
                                        placeholder='Enter Full Name'
                                        className={validationErrors.fullName ? "input-border" : ""}
                                    />
                                    {validationErrors.fullName && <small className="text-danger">{validationErrors.fullName}</small>}
                                </Form.Group>
                            </Col>

                            {/* Email */}
                            <Col lg={6}>
                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label><i className="ri-mail-line"></i> Email <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={employee.email}
                                        onChange={handleChange}
                                        placeholder='Enter Email'
                                        className={validationErrors.email ? "input-border" : ""}
                                    />
                                    {validationErrors.email && <small className="text-danger">{validationErrors.email}</small>}
                                </Form.Group>
                            </Col>

                            {/* Phone Number */}
                            <Col lg={6}>
                                <Form.Group controlId="phoneNumber" className="mb-3">
                                    <Form.Label><i className="ri-phone-line"></i> Phone Number <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phoneNumber"
                                        value={employee.phoneNumber}
                                        onChange={handleChange}
                                        placeholder='Enter Phone Number'
                                        className={validationErrors.phoneNumber ? "input-border" : ""}
                                    />
                                    {validationErrors.phoneNumber && <small className="text-danger">{validationErrors.phoneNumber}</small>}
                                </Form.Group>
                            </Col>

                            {/* Department Name */}
                            <Col lg={6}>
                                <Form.Group controlId="departmentId" className="mb-3">
                                    <Form.Label><i className="ri-building-line"></i> Department Name <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        name="departmentId"
                                        value={departmentList.find((dept) => dept.id === employee.departmentId)}
                                        onChange={(selectedOption) => {
                                            setEmployee({
                                                ...employee,
                                                departmentId: selectedOption?.id || '',
                                                departmentName: selectedOption?.departmentName || '',
                                            });
                                        }}
                                        getOptionLabel={(dept) => dept.departmentName}
                                        getOptionValue={(dept) => String(dept.id)}
                                        options={departmentList}
                                        isSearchable
                                        placeholder="Select Department Name"
                                        className={validationErrors.departmentId ? "input-border" : ""}
                                    />
                                    {validationErrors.departmentId && <small className="text-danger">{validationErrors.departmentId}</small>}
                                </Form.Group>
                            </Col>

                            {/* Designation */}
                            <Col lg={6}>
                                <Form.Group controlId="designation" className="mb-3">
                                    <Form.Label><i className="ri-briefcase-line"></i> Designation <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="designation"
                                        value={employee.designation}
                                        onChange={handleChange}
                                        placeholder='Enter Designation'
                                        className={validationErrors.designation ? "input-border" : ""}
                                    />
                                    {validationErrors.designation && <small className="text-danger">{validationErrors.designation}</small>}
                                </Form.Group>
                            </Col>

                            {/* Location */}
                            <Col lg={6}>
                                <Form.Group controlId="location" className="mb-3">
                                    <Form.Label><i className="ri-map-pin-line"></i> Location <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="location"
                                        value={employee.location}
                                        onChange={handleChange}
                                        placeholder='Enter Location'
                                        className={validationErrors.location ? "input-border" : ""}
                                    />
                                    {validationErrors.location && <small className="text-danger">{validationErrors.location}</small>}
                                </Form.Group>
                            </Col>

                            {/* Password */}
                            <Col lg={6}>
                                <Form.Group controlId="password" className="mb-3">
                                    <Form.Label><i className="ri-lock-line"></i> Password <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="password"
                                        value={employee.password}
                                        onChange={handleChange}
                                        placeholder='Enter Password'
                                        className={validationErrors.password ? "input-border" : ""}
                                    />
                                    {validationErrors.password && <small className="text-danger">{validationErrors.password}</small>}
                                </Form.Group>
                            </Col>

                            {/* Roles (Multi-select) */}
                            <Col lg={6}>
                                <Form.Group controlId="roles" className="mb-3">
                                    <Form.Label><i className="ri-user-settings-line"></i> Roles <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        name="roles"
                                        value={employee.roles.map(role => ({ value: role, label: role }))}
                                        onChange={(selectedOptions) => {
                                            setEmployee({
                                                ...employee,
                                                roles: selectedOptions.map((option) => option.value),
                                            });
                                        }}
                                        options={roleList.map((role) => ({ value: role.roleName, label: role.roleName }))}
                                        isSearchable
                                        isMulti
                                        placeholder="Select Roles"
                                        className={validationErrors.roles ? "input-border" : ""}
                                    />
                                    {validationErrors.roles && <small className="text-danger">{validationErrors.roles}</small>}
                                </Form.Group>
                            </Col>

                            {/* Status (Active / Inactive Radio Buttons) */}
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

                            {/* Action Buttons */}
                            <Col className='align-items-end d-flex justify-content-end mb-3'>
                                <div>
                                    <Link to={'/pages/EmployeeMaster'}>
                                        <Button variant="primary">Back</Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        {editMode ? 'Update Employee' : 'Add Employee'}
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
