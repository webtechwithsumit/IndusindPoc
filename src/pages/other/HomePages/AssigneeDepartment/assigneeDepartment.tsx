import { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '@/config';
import { toast } from 'react-toastify';
import Select, { MultiValue } from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import axiosInstance from '@/utils/axiosInstance';

interface AdditionalMember {
    id: string;
    name: string;
}

interface DepartmentDetails {
    departmentID: string;
    departmentName: string;
    startDate: string;
    escalationDate: string;
    authorizedSignatory: string;
    assignee: string;
    additionalMember: AdditionalMember[];
}


interface Department {
    id: number;
    productID: number;
    productType: string;
    productName: string;
    departmentName: string;
    departmentList: DepartmentDetails[];
    assigneeID: string;
    assigneeName: string;
    startDate: string;
    escalationDate: string;
    createdBy: string;
    updatedBy: string;
}

interface EmployeeList {
    id: number
    userName: string
    employeeName: string
    assigneeName: string
}

interface DepartmentList {
    id: number
    isDefault: number
    departmentName: string
}
interface ProductDetails {
    id: number;
    productType: string
    productName: string
    departmentName: string
}

const AssigneeDepartment = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [empName, setEmpName] = useState<string | null>(null);
    const [employeeList, setEmployeeList] = useState<EmployeeList[]>([]);
    const [departmentList, setDepartmentList] = useState<DepartmentList[]>([]);
    const [selectDefaultDepartments, setSelectDefaultDepartments] = useState(false);
    const [isAllDepartments, setIsAllDepartments] = useState(false);
    const [productDetails, setProductDetails] = useState<ProductDetails>({
        id: 0,
        productType: '',
        productName: '',
        departmentName: '',
    });
    const [departments, setDepartments] = useState<Department>({
        id: 0,
        productID: 0,
        productType: '',
        productName: '',
        departmentName: '',
        departmentList: [
            {
                departmentID: '',
                departmentName: '',
                startDate: '',
                escalationDate: '',
                authorizedSignatory: '',
                assignee: '',
                additionalMember: [
                    {
                        id: '',
                        name: ''
                    }
                ]
            }
        ],
        assigneeID: '',
        assigneeName: '',
        startDate: '',
        escalationDate: '',
        createdBy: '',
        updatedBy: ''
    });

    console.log(empName)

    useEffect(() => {
        toast.dismiss();
        const storedEmpName = localStorage.getItem('EmpName');
        const storedEmpID = localStorage.getItem('EmpId');
        if (storedEmpName || storedEmpID) {
            setEmpName(`${storedEmpName} - ${storedEmpID}`);
        }
    }, []);


    useEffect(() => {
        if (id) {
            fetchDepartmentById(id);
            fetchProductById(id);
        }
    }, [id]);

    const fetchProductById = async (id: string) => {
        try {
            const response = await axiosInstance.get(`${config.API_URL}/Product/GetProductAssign`, { params: { ProductID: id } });
            if (response.data.isSuccess) {
                const fetchedDepartment = response.data.getProducts[0] || {};
                setDepartments({
                    ...departments,
                    ...fetchedDepartment,
                    departmentList: fetchedDepartment.departmentList || [] // Ensure it's an array
                });
            } else {
                toast.error(response.data.message || 'Failed to fetch department data');
            }
        } catch (error) {
            console.error('Error fetching department:', error);
            toast.error('Error fetching department data');
        }
    };

    const fetchDepartmentById = async (id: string) => {
        try {
            const response = await axiosInstance.get(`${config.API_URL}/Product/GetProduct`, { params: { id } });
            if (response.data.isSuccess) {
                const fetchedDepartment = response.data.getProducts[0];
                setProductDetails(fetchedDepartment);
                setDepartments((prev) => ({
                    ...prev,
                    productID: fetchedDepartment.id,
                    productType: fetchedDepartment.productType,
                    productName: fetchedDepartment.productName,
                    departmentName: fetchedDepartment.departmentName,
                }));
            } else {
                toast.error(response.data.message || 'Failed to fetch department data');
            }
        } catch (error) {
            console.error('Error fetching department:', error);
            toast.error('Error fetching department data');
        }
    };

    const fetchEmployeesByDepartment = async (departmentName: string) => {
        try {
            const response = await axiosInstance.get(
                `${config.API_URL}/CommonDropdown/EmployeeList?Flag=3&DepartmentName=${departmentName}`
            );

            if (response.data.isSuccess) {
                return response.data.employees;
            } else {
                console.error('Failed to fetch employees for department:', departmentName);
                return [];
            }
        } catch (error) {
            console.error(`Error fetching employees for ${departmentName}:`, error);
            return [];
        }
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

        fetchData('CommonDropdown/EmployeeList?Flag=1', setEmployeeList, 'employees');
        fetchData('CommonDropdown/GetDepartmentList?Flag=1', setDepartmentList, 'getDepartmentLists');

    }, []);

    const getTodayDate = (): string => {
        return new Date().toISOString().split('T')[0];
    };

    const handleMultiSelectChange = async (selectedDepartments: MultiValue<DepartmentList>) => {
        try {
            const departmentPromises = selectedDepartments.map(async (department) => {
                const response = await axiosInstance.get(
                    `${config.API_URL}/CommonDropdown/EmployeeList?Flag=4&DepartmentName=${department.departmentName}`
                );

                if (response.data.isSuccess) {
                    const employeeData = response.data.employees[0] || {};
                    return {
                        departmentID: department.id.toString(),
                        departmentName: department.departmentName,
                        startDate: getTodayDate(),
                        escalationDate: '',
                        authorizedSignatory: employeeData.defaultAuthorisedSignatoryID || '',
                        assignee: employeeData.defaultAssigneeID || '',
                        additionalMember: [],
                    } as DepartmentDetails;
                }

                return null;
            });

            const fetchedDepartments = await Promise.all(departmentPromises);
            const updatedDepartments = fetchedDepartments.filter((dept): dept is DepartmentDetails => dept !== null);

            console.log(updatedDepartments)
            setDepartments((prev) => ({
                ...prev,
                startDate: getTodayDate(),
                departmentList: updatedDepartments,
            }));
        } catch (error) {
            console.error('Error fetching department details:', error);
        }
    };

    const handleFieldChange = (index: number, field: keyof DepartmentDetails, value: any) => {
        const updatedList = [...departments.departmentList];
        updatedList[index] = { ...updatedList[index], [field]: value };

        setDepartments((prev) => ({ ...prev, departmentList: updatedList }));
    };

    const handleAdditionalMemberChange = (index: number, selectedOptions: MultiValue<EmployeeList | null>) => {
        const updatedList = [...departments.departmentList];

        updatedList[index] = {
            ...updatedList[index],
            additionalMember: selectedOptions
                .filter((opt): opt is EmployeeList => opt !== null)
                .map((opt) => ({
                    id: opt.userName ?? '',
                    name: opt.employeeName ?? '',
                })),
        };

        setDepartments((prev) => ({ ...prev, departmentList: updatedList }));
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...departments,
            productID: productDetails.id,
            productType: productDetails.productType,
            productName: productDetails.productName,
            departmentName: productDetails.departmentName,


        };


        console.log(payload)
        try {
            const apiUrl = `${config.API_URL}/Product/InsertUpdateProductAssign`;
            const response = await axiosInstance.post(apiUrl, payload);
            if (response.status === 200) {
                const payload1 = {
                    id: id,
                    isApproved: 1,
                    circulatedStatus: 1
                }
                console.log(payload1)
                const apiUrl1 = `${config.API_URL}/Product/ApproveRejectProduct`;
                const response1 = await axiosInstance.post(apiUrl1, payload1);
                if (response1.status === 200) {

                    const payload2 = {
                        productID: id,
                        status: 0,
                    }
                    console.log(payload2)
                    const apiUrl2 = `${config.API_URL}/DiscussionForm/InsertDiscussionForm`;
                    const response2 = await axiosInstance.post(apiUrl2, payload2);
                    if (response2.status === 200) {
                        navigate('/pages/ProductMaster/PendingSignOff', {
                            state: {
                                successMessage: `Record added successfully!`
                            }
                        });


                    }




                }
            } else {
                toast.error(response.data.message || 'Failed to process request');
            }
        } catch (error: any) {
            toast.dismiss();
            toast.error(error.response?.data?.message || 'An error occurred while submitting the form.');
            console.error('Error submitting department:', error);
        }
    };

    const handleCheckboxChange = () => {
        setSelectDefaultDepartments((prev) => !prev);

        if (!selectDefaultDepartments) {
            const defaultDepartments = departmentList.filter((dept) => dept.isDefault === 1);
            handleMultiSelectChange(defaultDepartments as MultiValue<DepartmentList>);
        } else {
            setDepartments((prev) => ({
                ...prev,
                departmentList: [],
            }));
        }
    };

    const handleAllDepartmentsClick = () => {
        setIsAllDepartments(true); // Enable editing for startDate and escalationDate
    };

    return (
        <div>
            <div className=" bg-white  p-3 mt-3">
                <div className="d-flex profilebar p-2 my-2 justify-content-between align-items-center fs-20 rounded-3 border">
                    <h4 className='text-primary m-0'>
                        <i className="ri-file-list-line me-2"></i>
                        <span className="fw-bold">Assign Department </span>
                    </h4>
                </div>
                <div className='my-3'>
                    <Row className='mb-2'>
                        <Col lg={4}> <span className='text-primary fs-16 fw-bold'> Product : </span> <span className='text-dark'>{departments.productName}</span></Col>
                        <Col lg={4}> <span className='text-primary  fs-16 fw-bold'> Product Department : </span> <span className='text-dark'>{departments.departmentName}</span></Col>
                        <Col lg={4}> <span className='text-primary fs-16 fw-bold'> Start Date : </span> <span className='text-dark'>{departments.startDate}</span></Col>
                    </Row>

                </div>


                <div className="bg-white p-2 rounded-3 border mt-4">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={8}>
                                <Form.Group controlId="departmentList" className="mb-3">
                                    <Form.Label>
                                        <i className="ri-building-line"></i> Select Department
                                    </Form.Label>
                                    <Select
                                        name="departmentList"
                                        value={departmentList.filter((dept) =>
                                            departments.departmentList.some((selectedDept) => selectedDept.departmentID === dept.id.toString() || "")
                                        )}
                                        onChange={handleMultiSelectChange}
                                        getOptionLabel={(dept) => dept.departmentName}
                                        getOptionValue={(dept) => dept.id.toString()}
                                        options={departmentList}
                                        isSearchable
                                        placeholder="Select Departments"
                                        isMulti
                                    />
                                </Form.Group>
                            </Col>


                            <Col lg={4} className="d-flex align-items-center justify-content-center">
                                <Form.Group controlId="defaultDepartmentCheckbox">
                                    <Form.Check
                                        type="checkbox"
                                        label="Select Default Departments"
                                        checked={selectDefaultDepartments}
                                        onChange={handleCheckboxChange}
                                    />
                                </Form.Group>
                            </Col>


                            <Col lg={3}>
                                <Form.Group controlId="dateOfBirth" className="mb-3">
                                    <Form.Label> Start Date  </Form.Label>
                                    <Flatpickr
                                        value={departments.startDate || ''}
                                        onChange={([date]) => {
                                            if (date) {
                                                const formattedDate = date.toLocaleDateString('en-CA');
                                                setDepartments({
                                                    ...departments,
                                                    startDate: formattedDate,
                                                });
                                            }
                                        }}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder="Start Date "
                                        className={" form-control "}
                                    />

                                </Form.Group>
                            </Col>
                            <Col lg={3}>
                                <Form.Group controlId="dateOfBirth" className="mb-3">
                                    <Form.Label> Esclation Date  </Form.Label>
                                    <Flatpickr
                                        value={departments.escalationDate}
                                        onChange={([date]) => {
                                            if (date) {
                                                const formattedDate = date.toLocaleDateString('en-CA');
                                                setDepartments({
                                                    ...departments,
                                                    escalationDate: formattedDate,
                                                });
                                            }
                                        }}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "Y-m-d",
                                            time_24hr: false,
                                        }}
                                        placeholder="Esclation Date "
                                        className={" form-control "}
                                    />

                                </Form.Group>
                            </Col>
                            <Col className="d-flex justify-content-end  align-items-center" lg={6}>
                                <div className='me-3'>
                                    Populate Date
                                </div>
                                <div>
                                    <Button variant="primary" onClick={handleAllDepartmentsClick}>
                                        All Departments
                                    </Button>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        New Department
                                    </Button>
                                </div>
                            </Col>

                        </Row>


                        <Row>
                            <Table hover className="bg-white custom-table">
                                <thead>
                                    <tr>
                                        <th>Start Date</th>
                                        <th>Escalation Date</th>
                                        <th>Authorized Signatory</th>
                                        <th>Assignee</th>
                                        <th>Additional Member</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departments.departmentList.map((department, index) => (
                                        <tr key={index}>
                                            <td>
                                                <h5 className='text-primary'>{department.departmentName || <span>&nbsp;</span>}</h5>
                                                <Col lg={12}>
                                                    <Form.Group controlId={`startDate-${index}`} className="">
                                                        <Flatpickr
                                                            value={department.startDate || ''}
                                                            onChange={([date]) =>
                                                                handleFieldChange(index, 'startDate', date.toISOString().split('T')[0])
                                                            }
                                                            options={{
                                                                enableTime: false,
                                                                dateFormat: 'Y-m-d',
                                                                time_24hr: false,
                                                            }}
                                                            placeholder="Start Date"
                                                            className="form-control"
                                                            disabled={!isAllDepartments}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </td>
                                            <td>
                                                <h5>&nbsp;</h5>
                                                <Col lg={12}>
                                                    <Form.Group controlId={`escalationDate-${index}`} className="">
                                                        <Flatpickr
                                                            value={department.escalationDate || ''}
                                                            onChange={([date]) =>
                                                                handleFieldChange(index, 'escalationDate', date.toISOString().split('T')[0])
                                                            }
                                                            options={{
                                                                enableTime: false,
                                                                dateFormat: 'Y-m-d',
                                                                time_24hr: false,
                                                            }}
                                                            placeholder="Escalation Date"
                                                            className="form-control"
                                                            disabled={!isAllDepartments}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </td>
                                            <td>
                                                <h5>&nbsp;</h5>
                                                <Col lg={12}>
                                                    <Form.Group controlId={`authorizedSignatory-${index}`}>
                                                        <Select
                                                            name={`authorizedSignatory-${index}`}
                                                            value={employeeList.find((emp) => emp.userName === department.authorizedSignatory)}
                                                            onFocus={async () => {
                                                                const departmentEmployees = await fetchEmployeesByDepartment(department.departmentName);
                                                                setEmployeeList(departmentEmployees);
                                                            }}
                                                            onChange={(selectedOption) =>
                                                                handleFieldChange(index, 'authorizedSignatory', selectedOption?.userName || '')
                                                            }
                                                            getOptionLabel={(emp) => emp.employeeName}
                                                            getOptionValue={(emp) => emp.userName}
                                                            options={employeeList}
                                                            isSearchable
                                                            placeholder="Select Authorized Signatory"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </td>
                                            <td>
                                                <h5>&nbsp;</h5>
                                                <Col lg={12}>
                                                    <Form.Group controlId={`assignee-${index}`}>
                                                        <Select
                                                            name={`assignee-${index}`}
                                                            value={employeeList.find((emp) => emp.userName === department.assignee)}
                                                            onFocus={async () => {
                                                                const departmentEmployees = await fetchEmployeesByDepartment(department.departmentName);
                                                                setEmployeeList(departmentEmployees);
                                                            }}
                                                            onChange={(selectedOption) =>
                                                                handleFieldChange(index, 'assignee', selectedOption?.userName || '')
                                                            }
                                                            getOptionLabel={(emp) => emp.employeeName}
                                                            getOptionValue={(emp) => emp.userName}
                                                            options={employeeList}
                                                            isSearchable
                                                            placeholder="Select Assignee"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </td>
                                            <td>
                                                <h5>&nbsp;</h5>
                                                <Col lg={12}>
                                                    <Form.Group controlId={`additionalMember-${index}`}>
                                                        <Select
                                                            name={`additionalMember-${index}`}
                                                            value={department.additionalMember
                                                                .map((member) => employeeList.find((emp) => emp.userName === member.id) || null)
                                                                .filter((emp): emp is EmployeeList => emp !== null)}
                                                            onFocus={async () => {
                                                                const departmentEmployees = await fetchEmployeesByDepartment(department.departmentName);
                                                                setEmployeeList(departmentEmployees);
                                                            }}
                                                            onChange={(selectedOptions) => handleAdditionalMemberChange(index, selectedOptions)}
                                                            getOptionLabel={(emp) => emp.employeeName}
                                                            getOptionValue={(emp) => emp.userName}
                                                            options={employeeList}
                                                            isSearchable
                                                            placeholder="Select Additional Members"
                                                            isMulti
                                                        />
                                                    </Form.Group>


                                                </Col>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                        </Row>

                        <Row>
                            <Col className="d-flex justify-content-end mb-3">
                                <div>
                                    <Link to="/pages/DepartmentMaster">
                                        <Button variant="primary">Cancel</Button>
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" type="submit">
                                        Publish
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

export default AssigneeDepartment;
