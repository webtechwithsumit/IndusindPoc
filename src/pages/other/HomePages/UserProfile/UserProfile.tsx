import { Button, Card, Col, Nav, Row, Tab, Table, Container, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'


import { FormInput } from '@/components'

const ProfilePages = () => {

    const [empName, setEmpName] = useState<string | null>('Admin')
    const [empID, setEmpID] = useState<string | null>('Admin')

    // Fetch employee name from localStorage when component mounts
    useEffect(() => {
        const storedEmpName = localStorage.getItem('EmpName')
        const storedEmpID = localStorage.getItem('EmpId')
        if (storedEmpName || storedEmpID) {
            setEmpName(storedEmpName)
            setEmpID(storedEmpID)
        }
    }, [])

    console.log(empID)

    return (
        <>
            <div>
                <Row>
                    <Col sm={12}>
                        <div className="profile-user-box my-1">
                            <Row>
                                <Col>
                                    <h4 className='text-primary fw-bold'>Welcome </h4>
                                    <h5 className=" text-dark">{empName}</h5>
                                </Col>
                                <Col>
                                    <h4 className='text-primary fw-bold'>Department </h4>
                                    <h5 className=" text-dark">IT</h5>
                                </Col>
                                <Col>
                                    <h4 className='text-primary fw-bold'>Operate as </h4>
                                    <h5 className=" text-dark">Department Level 1 | Convener Level 1</h5>
                                </Col>
                                <Col className='d-flex justify-content-end align-items-center '>
                                    <span><Button className=' fw-bold'>
                                        <Link to="/auth/logout" className='text-white'>
                                            Logout
                                        </Link>
                                    </Button></span>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>


                <Row>
                    <Col sm={12}>
                        <Card className="p-0">
                            <Card.Body className="p-0">
                                <div className="profile-content">
                                    <Tab.Container defaultActiveKey="About" >
                                        <div className='d-flex'>
                                            <div>
                                                <div>
                                                    <div className='px-3 pt-4'>
                                                        <h4 className='p-2 text-primary border-primary profilebar'> Master	</h4>
                                                    </div>
                                                    <Nav as="ul" className="px-4  flex-column">
                                                        <Nav.Item as="li">
                                                            <Nav.Link
                                                                as={Link}
                                                                to="#"
                                                                eventKey="About"
                                                                type="button"
                                                            >
                                                                <i className="ri-home-4-line fs-20"></i> Home
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link
                                                                eventKey="Activities"
                                                                to="#"
                                                                as={Link}
                                                                type="button"
                                                            >
                                                                <i className="ri-global-line fs-20"></i> Manage Product
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link
                                                                as={Link}
                                                                type="button"
                                                                to="#"
                                                                eventKey="Settings"
                                                            >
                                                                <i className="ri-mail-send-line fs-20"></i> Instant Mail
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    </Nav>
                                                </div>
                                                <div>
                                                    <div className='px-3 pt-4'>
                                                        <h4 className='p-2 text-primary border-primary profilebar'> Reports	</h4>
                                                    </div>
                                                    <Nav as="ul" className="px-4 pb-4 flex-column">
                                                        <Nav.Item as="li">
                                                            <Nav.Link
                                                                as={Link}
                                                                to="#"
                                                                eventKey="MemberReport"
                                                                type="button"
                                                            >
                                                                <i className="ri-loader-4-fill fs-20"></i> Member Report
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    </Nav>
                                                </div>
                                                <div>
                                                    <div className='px-3 '>
                                                        <h4 className='p-2 text-primary border-primary profilebar'> User Setting	</h4>
                                                    </div>
                                                    <Nav as="ul" className="px-4  flex-column">
                                                        <Nav.Item as="li">
                                                            <Nav.Link
                                                                as={Link}
                                                                to="#"
                                                                eventKey="UpdateProfile"
                                                                type="button"
                                                            >
                                                                <i className="ri-user-line fs-20"></i>	Update Profile
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    </Nav>
                                                    <Nav as="ul" className="px-4 pb-4 flex-column">
                                                        <Nav.Item as="li">
                                                            <Nav.Link
                                                                as={Link}
                                                                to="#"
                                                                eventKey="Password"
                                                                type="button"
                                                            >
                                                                <i className="ri-loader-4-fill fs-20"></i>	Change Password
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    </Nav>
                                                </div>
                                            </div>
                                            <div className='w-100'>
                                                <Tab.Content className="m-0 p-4">
                                                    <Tab.Pane eventKey="About" id="aboutme" tabIndex={0}>
                                                        <div className=' mb-3 fw-bold w-100'>
                                                            <h4 className='p-2 text-primary border-primary profilebar'> Home	</h4>
                                                        </div>
                                                        <Tab.Container defaultActiveKey="ProductsOrignatedbyMyDepartment" >
                                                            <div className='right-tab'>
                                                                <Nav as="ul">
                                                                    <Nav.Item as="li">
                                                                        <Nav.Link
                                                                            as={Link}
                                                                            to="#"
                                                                            eventKey="ProductsOrignatedbyMyDepartment"
                                                                            type="button"
                                                                        >
                                                                            Products Orignated by My Department
                                                                        </Nav.Link>
                                                                    </Nav.Item>
                                                                    <Nav.Item>
                                                                        <Nav.Link
                                                                            eventKey="ProductsOrignatedOtherDepartment"
                                                                            to="#"
                                                                            as={Link}
                                                                            type="button"
                                                                        >
                                                                            Products Orignated by Other Department
                                                                        </Nav.Link>
                                                                    </Nav.Item>
                                                                </Nav>



                                                                <div>
                                                                    <Tab.Content className="my-2">
                                                                        <Tab.Pane eventKey="ProductsOrignatedbyMyDepartment" id="aboutme" tabIndex={0}>

                                                                            <div className="profile-desk mt-3" >
                                                                                <Table hover className='bg-white '>
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th>Product</th>
                                                                                            <th>Product Type</th>
                                                                                            <th>Originator</th>
                                                                                            <th>Moile No</th>
                                                                                            <th>Originator's Department</th>
                                                                                            <th>Start Date</th>
                                                                                            <th>Reply Pending For</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
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
                                                                                    </tbody>
                                                                                </Table>
                                                                            </div>

                                                                        </Tab.Pane>
                                                                        <Tab.Pane eventKey="ProductsOrignatedOtherDepartment" id="user-activities">
                                                                            <div className="profile-desk mt-3" >
                                                                                <Table hover className='bg-white '>
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th>Product</th>
                                                                                            <th>Product Type</th>
                                                                                            <th>Originator</th>
                                                                                            <th>Moile No</th>
                                                                                            <th>Originator's Department</th>
                                                                                            <th>Start Date</th>
                                                                                            <th>Reply Pending For</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
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
                                                                                    </tbody>
                                                                                </Table>
                                                                            </div>

                                                                        </Tab.Pane>

                                                                        <Tab.Pane eventKey="Settings" id="edit-profile">
                                                                            <div className=' fw-bold w-100'>
                                                                                <h4 className='p-2 text-primary border-primary profilebar'> 	Instant Mail	</h4>
                                                                            </div>
                                                                            <div className="user-profile-content">
                                                                                <form>
                                                                                    <Row className="row-cols-sm-2 row-cols-1">
                                                                                        <FormInput
                                                                                            name="fullName"
                                                                                            label="Full Name"
                                                                                            type="text"
                                                                                            containerClass="mb-2"
                                                                                            defaultValue="John Doe"
                                                                                        />
                                                                                        <FormInput
                                                                                            name="email"
                                                                                            label="Email"
                                                                                            type="text"
                                                                                            containerClass="mb-3"
                                                                                            defaultValue="first.last@example.com"
                                                                                        />
                                                                                        <FormInput
                                                                                            name="WebUrl"
                                                                                            label="Website"
                                                                                            type="text"
                                                                                            containerClass="mb-3"
                                                                                            defaultValue="Enter website url"
                                                                                        />
                                                                                        <FormInput
                                                                                            name="UserName"
                                                                                            label="Username"
                                                                                            type="text"
                                                                                            containerClass="mb-3"
                                                                                            defaultValue="john"
                                                                                        />
                                                                                        <FormInput
                                                                                            name="Password"
                                                                                            label="Password"
                                                                                            type="password"
                                                                                            containerClass="mb-3"
                                                                                            placeholder="6 - 15 Characters"
                                                                                        />
                                                                                        <FormInput
                                                                                            name="Password2"
                                                                                            label="Re-Password"
                                                                                            type="password"
                                                                                            containerClass="mb-3"
                                                                                            placeholder="6 - 15 Characters"
                                                                                        />
                                                                                        <FormInput
                                                                                            style={{ height: 125 }}
                                                                                            name="About"
                                                                                            label="About Me"
                                                                                            type="textarea"
                                                                                            containerClass="col-sm-12 mb-3"
                                                                                            defaultValue={
                                                                                                'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.'
                                                                                            }
                                                                                        />
                                                                                    </Row>
                                                                                    <Button variant="primary" type="submit">
                                                                                        <i className="ri-save-line me-1 fs-16 lh-1" />{' '}
                                                                                        Save
                                                                                    </Button>
                                                                                </form>
                                                                            </div>
                                                                        </Tab.Pane>
                                                                        <Tab.Pane eventKey="Projects" id="projects">
                                                                            <div className=' fw-bold w-100'>
                                                                                <h4 className='p-2 text-primary border-primary profilebar'> 	Instant Mail	</h4>
                                                                            </div>
                                                                            <Row className="m-t-10">
                                                                                <Col lg={12}>
                                                                                    <div className="table-responsive">
                                                                                        <table className="table table-bordered mb-0">
                                                                                            <thead>
                                                                                                <tr>
                                                                                                    <th>#</th>
                                                                                                    <th>Project Name</th>
                                                                                                    <th>Start Date</th>
                                                                                                    <th>Due Date</th>
                                                                                                    <th>Status</th>
                                                                                                    <th>Assign</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td>1</td>
                                                                                                    <td>Velonic Admin</td>
                                                                                                    <td>01/01/2015</td>
                                                                                                    <td>07/05/2015</td>
                                                                                                    <td>
                                                                                                        <span className="badge bg-info">
                                                                                                            Work in Progress
                                                                                                        </span>
                                                                                                    </td>
                                                                                                    <td>Techzaa</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td>2</td>
                                                                                                    <td>Velonic Frontend</td>
                                                                                                    <td>01/01/2015</td>
                                                                                                    <td>07/05/2015</td>
                                                                                                    <td>
                                                                                                        <span className="badge bg-success">
                                                                                                            Pending
                                                                                                        </span>
                                                                                                    </td>
                                                                                                    <td>Techzaa</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td>3</td>
                                                                                                    <td>Velonic Admin</td>
                                                                                                    <td>01/01/2015</td>
                                                                                                    <td>07/05/2015</td>
                                                                                                    <td>
                                                                                                        <span className="badge bg-pink">
                                                                                                            Done
                                                                                                        </span>
                                                                                                    </td>
                                                                                                    <td>Techzaa</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td>4</td>
                                                                                                    <td>Velonic Frontend</td>
                                                                                                    <td>01/01/2015</td>
                                                                                                    <td>07/05/2015</td>
                                                                                                    <td>
                                                                                                        <span className="badge bg-purple">
                                                                                                            Work in Progress
                                                                                                        </span>
                                                                                                    </td>
                                                                                                    <td>Techzaa</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td>5</td>
                                                                                                    <td>Velonic Admin</td>
                                                                                                    <td>01/01/2015</td>
                                                                                                    <td>07/05/2015</td>
                                                                                                    <td>
                                                                                                        <span className="badge bg-warning">
                                                                                                            Coming soon
                                                                                                        </span>
                                                                                                    </td>
                                                                                                    <td>Techzaa</td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </Tab.Pane>
                                                                    </Tab.Content>
                                                                </div>
                                                            </div>
                                                        </Tab.Container>
                                                    </Tab.Pane>


                                                    <Tab.Pane eventKey="Activities" id="user-activities">
                                                        <div className=' fw-bold w-100'>
                                                            <h4 className='p-2 text-primary border-primary profilebar'> 	Manage Product	</h4>
                                                        </div>
                                                        <div className="profile-desk">
                                                            <h5 className="text-uppercase fs-17 text-dark">
                                                                Johnathan Deo
                                                            </h5>
                                                            <div className="designation mb-4">
                                                                PRODUCT DESIGNER (UX / UI / Visual Interaction)
                                                            </div>
                                                            <p className="text-muted fs-16">
                                                                I have 10 years of experience designing for the web,
                                                                and specialize in the areas of user interface
                                                                design, interaction design, visual design and
                                                                prototyping. I’ve worked with notable startups
                                                                including Pearl Street Software.
                                                            </p>
                                                            <h5 className="mt-4 fs-17 text-dark">
                                                                Contact Information
                                                            </h5>

                                                        </div>
                                                    </Tab.Pane>

                                                    <Tab.Pane eventKey="Settings" id="edit-profile">
                                                        <div className=' fw-bold w-100'>
                                                            <h4 className='p-2 text-primary border-primary profilebar'> 	Instant Mail	</h4>
                                                        </div>
                                                        <div className="user-profile-content">
                                                            <form>
                                                                <Row className="row-cols-sm-2 row-cols-1">
                                                                    <FormInput
                                                                        name="fullName"
                                                                        label="Full Name"
                                                                        type="text"
                                                                        containerClass="mb-2"
                                                                        defaultValue="John Doe"
                                                                    />
                                                                    <FormInput
                                                                        name="email"
                                                                        label="Email"
                                                                        type="text"
                                                                        containerClass="mb-3"
                                                                        defaultValue="first.last@example.com"
                                                                    />
                                                                    <FormInput
                                                                        name="WebUrl"
                                                                        label="Website"
                                                                        type="text"
                                                                        containerClass="mb-3"
                                                                        defaultValue="Enter website url"
                                                                    />
                                                                    <FormInput
                                                                        name="UserName"
                                                                        label="Username"
                                                                        type="text"
                                                                        containerClass="mb-3"
                                                                        defaultValue="john"
                                                                    />
                                                                    <FormInput
                                                                        name="Password"
                                                                        label="Password"
                                                                        type="password"
                                                                        containerClass="mb-3"
                                                                        placeholder="6 - 15 Characters"
                                                                    />
                                                                    <FormInput
                                                                        name="Password2"
                                                                        label="Re-Password"
                                                                        type="password"
                                                                        containerClass="mb-3"
                                                                        placeholder="6 - 15 Characters"
                                                                    />
                                                                    <FormInput
                                                                        style={{ height: 125 }}
                                                                        name="About"
                                                                        label="About Me"
                                                                        type="textarea"
                                                                        containerClass="col-sm-12 mb-3"
                                                                        defaultValue={
                                                                            'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.'
                                                                        }
                                                                    />
                                                                </Row>
                                                                <Button variant="primary" type="submit">
                                                                    <i className="ri-save-line me-1 fs-16 lh-1" />{' '}
                                                                    Save
                                                                </Button>
                                                            </form>
                                                        </div>
                                                    </Tab.Pane>

                                                </Tab.Content>
                                            </div>
                                        </div>



                                    </Tab.Container>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default ProfilePages
