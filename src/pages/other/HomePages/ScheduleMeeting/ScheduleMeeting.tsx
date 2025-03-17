import { useState, ChangeEvent } from 'react';
import { Button, Card, Form, Row, Col } from 'react-bootstrap';

interface NoteDetails {
    noteId: string;
    productName: string;
    productType: string;
    initiatorName: string;
    proposalSummary: string;
}

interface MeetingDetails {
    date: string;
    time: string;
    mode: string;
    vcLink: string;
    attendees: string[];
    agenda: string;
}

interface ActionItem {
    description: string;
    assignedTo: string;
    dueDate: string;
}

const ScheduleMeeting = () => {

    const [noteDetails, setNoteDetails] = useState<NoteDetails>({
        noteId: 'NOTE12345',
        productName: 'Sample Product',
        productType: 'New',
        initiatorName: 'John Doe',
        proposalSummary: ''
    });

    const [meetingDetails, setMeetingDetails] = useState<MeetingDetails>({
        date: '',
        time: '',
        mode: '',
        vcLink: '',
        attendees: [],
        agenda: ''
    });

    const [discussionPoints, setDiscussionPoints] = useState<string>('');
    const [outcome, setOutcome] = useState<string>('Proceed');
    const [actionItems, setActionItems] = useState<ActionItem[]>([]);
    const [attendance, setAttendance] = useState<string[]>([]);

    const attendeesOptions: string[] = [
        'Initiator',
        'Dept Head - Finance',
        'Dept Head - Compliance',
        'Legal Team',
        'IT Team'
    ];

    const handleAddActionItem = () => {
        setActionItems([...actionItems, { description: '', assignedTo: '', dueDate: '' }]);
    };

    const handleActionItemChange = (index: number, field: keyof ActionItem, value: string) => {
        const updatedItems = [...actionItems];
        updatedItems[index][field] = value;
        setActionItems(updatedItems);
    };

    const handleAttendanceChange = (attendee: string) => {
        if (attendance.includes(attendee)) {
            setAttendance(attendance.filter((item) => item !== attendee));
        } else {
            setAttendance([...attendance, attendee]);
        }
    };

    const handleSubmit = () => {
        const payload = {
            noteDetails,
            meetingDetails,
            discussionPoints,
            outcome,
            actionItems,
            attendance
        };

        console.log('Submit Payload:', payload);
        alert('Pre-PPAC Meeting submitted successfully!');
    };

    return (
        <div className="p-3">

            {/* Note Details */}
            <Card className="mb-3">
                <Card.Body>
                    <h5 className="mb-3">Note Details</h5>
                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Label>Note ID</Form.Label>
                            <Form.Control type="text" value={noteDetails.noteId} disabled />
                        </Col>
                        <Col md={6} className="mb-3">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control type="text" value={noteDetails.productName} disabled />
                        </Col>
                        <Col md={6} className="mb-3">
                            <Form.Label>Product Type</Form.Label>
                            <Form.Control type="text" value={noteDetails.productType} disabled />
                        </Col>
                        <Col md={6} className="mb-3">
                            <Form.Label>Initiator Name</Form.Label>
                            <Form.Control type="text" value={noteDetails.initiatorName} disabled />
                        </Col>
                        <Col md={12} className="mb-3">
                            <Form.Label>Proposal Summary</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Proposal Summary"
                                value={noteDetails.proposalSummary}
                                onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                                    setNoteDetails({ ...noteDetails, proposalSummary: e.target.value })}
                            />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Meeting Scheduling */}
            <Card className="mb-3">
                <Card.Body>
                    <h5 className="mb-3">Meeting Scheduling</h5>
                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={meetingDetails.date}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setMeetingDetails({ ...meetingDetails, date: e.target.value })}
                            />
                        </Col>
                        <Col md={6} className="mb-3">
                            <Form.Label>Time</Form.Label>
                            <Form.Control
                                type="time"
                                value={meetingDetails.time}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setMeetingDetails({ ...meetingDetails, time: e.target.value })}
                            />
                        </Col>
                        <Col md={6} className="mb-3">
                            <Form.Label>Mode</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="VC / In-Person / Hybrid"
                                value={meetingDetails.mode}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setMeetingDetails({ ...meetingDetails, mode: e.target.value })}
                            />
                        </Col>
                        <Col md={6} className="mb-3">
                            <Form.Label>VC Link / Location</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="VC Link / Meeting Room"
                                value={meetingDetails.vcLink}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setMeetingDetails({ ...meetingDetails, vcLink: e.target.value })}
                            />
                        </Col>
                        <Col md={12} className="mb-3">
                            <Form.Label>Agenda Items</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Agenda Items"
                                value={meetingDetails.agenda}
                                onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                                    setMeetingDetails({ ...meetingDetails, agenda: e.target.value })}
                            />
                        </Col>
                    </Row>

                    <h6>Attendees</h6>
                    {attendeesOptions.map((attendee) => (
                        <Form.Check
                            key={attendee}
                            type="checkbox"
                            label={attendee}
                            checked={meetingDetails.attendees.includes(attendee)}
                            onChange={() => {
                                const updated = meetingDetails.attendees.includes(attendee)
                                    ? meetingDetails.attendees.filter((a) => a !== attendee)
                                    : [...meetingDetails.attendees, attendee];
                                setMeetingDetails({ ...meetingDetails, attendees: updated });
                            }}
                            className="mb-2"
                        />
                    ))}
                </Card.Body>
            </Card>

            {/* Discussion & MoM */}
            <Card className="mb-3">
                <Card.Body>
                    <h5 className="mb-3">Discussion & MoM</h5>
                    <Form.Group className="mb-3">
                        <Form.Label>Discussion Points</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={discussionPoints}
                            onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                                setDiscussionPoints(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Outcome</Form.Label>
                        <Form.Select
                            value={outcome}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setOutcome(e.target.value)}
                        >
                            <option value="Proceed">Proceed for Note Initiation</option>
                            <option value="ReferBack">Refer Back to Initiator</option>
                        </Form.Select>
                    </Form.Group>

                    <h6>Action Items</h6>
                    {actionItems.map((item, index) => (
                        <Row key={index} className="mb-2">
                            <Col md={4}>
                                <Form.Control
                                    type="text"
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        handleActionItemChange(index, 'description', e.target.value)}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Control
                                    type="text"
                                    placeholder="Assigned To"
                                    value={item.assignedTo}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        handleActionItemChange(index, 'assignedTo', e.target.value)}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Control
                                    type="date"
                                    value={item.dueDate}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        handleActionItemChange(index, 'dueDate', e.target.value)}
                                />
                            </Col>
                        </Row>
                    ))}

                    <Button variant="outline-primary" onClick={handleAddActionItem}>
                        Add Action Item
                    </Button>
                </Card.Body>
            </Card>

            {/* Attendance Capture */}
            <Card className="mb-3">
                <Card.Body>
                    <h5 className="mb-3">Attendance Capture</h5>
                    {attendeesOptions.map((attendee) => (
                        <Form.Check
                            key={attendee}
                            type="checkbox"
                            label={attendee}
                            checked={attendance.includes(attendee)}
                            onChange={() => handleAttendanceChange(attendee)}
                            className="mb-2"
                        />
                    ))}
                </Card.Body>
            </Card>

            <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary">Save as Draft</Button>
                <Button variant="primary" onClick={handleSubmit}>Submit MoM & Proceed</Button>
                <Button variant="danger" onClick={() => alert('Referred Back to Initiator')}>
                    Refer Back to Initiator
                </Button>
            </div>
        </div>
    );
};

export default ScheduleMeeting;
