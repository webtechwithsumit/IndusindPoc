import { PageBreadcrumb } from "@/components"
import config from "@/config";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

<title>PPAC Portal</title>

const Dashboard = () => {
	const [project, setProject] = useState();

	const [metrics, setMetrics] = useState({
		notesSignoff: 0,
		notesQueriesUnresolved: 0,
		rejectedNotes: 0,
		pendingObservationNotes: 0,
	});

	useEffect(() => {
		setMetrics({
			notesSignoff: 15,
			notesQueriesUnresolved: 7,
			rejectedNotes: 3,
			pendingObservationNotes: 5,
		});
	}, []);


	useEffect(() => {
		fetchDetailsMain();
	}, []);

	const fetchDetailsMain = async () => {
		try {
			const response = await axiosInstance.get(`${config.API_URL}/DiscussionForm/GetCountofUnresolvedQuery`);
			if (response.data.isSuccess) {
				setProject(response.data.queryCount);
			} else {
				console.error(response.data.message);
			}
		} catch (error) {
			console.error('Error fetching doers:', error);
		}
		
	};

	return (
		<>
			<PageBreadcrumb title="Welcome" />
			<Container className="my-4">
				<Row>
					{/* Card for Pending Observation Notes */}
					<Col md={6}>
						<Card className="mb-3">
							<Card.Header className="fs-20">No. of Notes Pending Approval </Card.Header>
							<Card.Body className="d-flex justify-content-between align-items-center">

								<Card.Title>{metrics.pendingObservationNotes}</Card.Title>
								<Card.Link href="/details/pending-observation-notes">View Details</Card.Link>
							</Card.Body>
						</Card>
					</Col>
					{/* Card for Notes Signoff To Be Given */}
					<Col md={6}>
						<Card className="mb-3">
							<Card.Header className="fs-20">No. of Notes Signoff To Be Given</Card.Header>
							<Card.Body className="d-flex justify-content-between align-items-center">

								<Card.Title>{metrics.notesSignoff}</Card.Title>
								<Card.Link href="/details/notes-signoff">View Details</Card.Link>
							</Card.Body>
						</Card>
					</Col>

					{/* Card for Unresolved Note Queries */}
					<Col md={6}>
						<Card className="mb-3">
							<Card.Header className="fs-20">No. of Notes Queries Unresolved</Card.Header>
							<Card.Body className="d-flex justify-content-between align-items-center">

								<Card.Title>{project}</Card.Title>
								<Card.Link href="/pages/ProductMaster/PendingSignOff">View Details</Card.Link>
							</Card.Body>
						</Card>
					</Col>

					{/* Card for Rejected Notes */}
					<Col md={6}>
						<Card className="mb-3">
							<Card.Header className="fs-20">No. of Notes Rejected </Card.Header>
							<Card.Body className="d-flex justify-content-between align-items-center">
								<Card.Title>{metrics.rejectedNotes}</Card.Title>
								<Card.Link href="/details/rejected-notes">View Details</Card.Link>
							</Card.Body>
						</Card>
					</Col>


				</Row>
			</Container>
		</>
	)
}

export default Dashboard
