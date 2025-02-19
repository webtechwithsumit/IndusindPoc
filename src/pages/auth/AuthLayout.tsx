import React, { ReactNode, useEffect } from 'react'
import axisBank from '@/assets/images/clay.png'


import { Card, Col, Container, Image, Row } from 'react-bootstrap'

interface AccountLayoutProps {
	pageImage?: string
	authTitle?: string
	helpText?: string
	bottomLinks?: ReactNode
	isCombineForm?: boolean
	children?: ReactNode
	hasForm?: boolean
	hasThirdPartyLogin?: boolean
	userImage?: string
	starterClass?: boolean
}

const AuthLayout = ({
	authTitle,
	helpText,
	bottomLinks,
	children,
	userImage,
	starterClass,
}: AccountLayoutProps) => {

	useEffect(() => {
		if (document.body) {
			document.body.classList.add('authentication-bg', 'position-relative')
		}

		return () => {
			if (document.body) {
				document.body.classList.remove('authentication-bg', 'position-relative')
			}
		}
	}, [])

	return (
		<div className="authentication-bg position-relative">

			<div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5 position-relative">
				<span className='position-absolute top-0 end-0 p-3 fs-4 cursor-pointer'>
					<a href='/path/to/instruction-document.pdf' download>
						<i className="ri-arrow-down-circle-line fs-3"></i> Download Instruction Document
					</a>
				</span>
				<Container>
					<Row className="justify-content-center">
						<Col lg={8}>
							<Row className="g-0">
								<Col lg={6} className="d-flex flex-column justify-content-between pr-3 " style={{ display: 'flex', minHeight: '100%' }}>
									<div className="p-3 rounded  mb-3 d-flex align-items-center " style={{ flex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 0px 15px' }}>
										<div>
											<h3 className=''>Information</h3>
											<a href="" className="d-block my-2"><i className="ri-checkbox-blank-circle-fill me-2"></i> Welcome to PPAC Portal</a>
											<a href="" className="d-block my-2"><i className="ri-checkbox-blank-circle-fill me-2" ></i>Please use standard templates only</a>
											<a href="" className="d-flex  my-2"><i className="ri-checkbox-blank-circle-fill me-2"></i>Project flows and process have been shared  in the below section  for viewing and understanding </a>
											<a href="" className="d-block my-2"><i className="ri-checkbox-blank-circle-fill me-2"></i>Please Reach out to Kanhaiya Lal and Anshula Ray</a>
										</div>
									</div>
									<div className="p-3 rounded d-flex  align-items-center  " style={{ flex: 1, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 0px 15px' }}>
										<div>
											<h3 className=''>Templates</h3>
											<a href="" className="d-block my-2"><i className="ri-checkbox-blank-circle-fill me-2"></i> User Manual</a>
											<a href="" className="d-block my-2"><i className="ri-checkbox-blank-circle-fill me-2" ></i>New Note Template</a>
											<a href="" className="d-flex  my-2"><i className="ri-checkbox-blank-circle-fill me-2"></i>Project flows and process have been shared  in the below section  for viewing and understanding </a>
											<a href="" className="d-block my-2"><i className="ri-checkbox-blank-circle-fill me-2"></i>Please Reach out to Kanhaiya Lal and Anshula Ray</a>
										</div>
									</div>
								</Col>
								<Col lg={6} style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 0px 15px' }}>
									<div className="d-flex flex-column h-100" >
										<div className="auth-brand px-4  d-flex justify-content-center">
											<div className='fw-bold fs-50 text-primary'> PPAC Portal </div>
										</div>
										<div
											className={`px-4 pb-3 pt-2 my-auto ${starterClass ? 'text-center' : ''
												}`}
										>
											{userImage ? (
												<div className="text-center w-75 m-auto">
													<Image
														src={userImage}
														height={64}
														alt="user-image"
														className="rounded-circle img-fluid img-thumbnail avatar-xl"
													/>
													<h4 className="text-center mt-3 fw-bold fs-20">
														{authTitle}{' '}
													</h4>
													<p className="text-muted mb-4">{helpText}</p>
												</div>
											) : (
												<React.Fragment>
													<h4 className="fs-20">{authTitle}</h4>
													<p className="text-muted mb-3">{helpText}</p>
												</React.Fragment>
											)}

											{children}
										</div>
									</div>
								</Col>
							</Row>
						</Col>
					</Row>
					{bottomLinks}
				</Container>
			</div>

		</div >
	)
}

export default AuthLayout
