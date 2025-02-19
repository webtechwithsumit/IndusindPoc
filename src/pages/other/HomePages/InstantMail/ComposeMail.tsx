import { useState, useRef, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link } from 'react-router-dom';

interface MailData {
    template: string;
    to: string;
    subject: string;
    body: string;
}

const AddMailScreen: React.FC = () => {
    const [mailData, setMailData] = useState<MailData>({
        template: '',
        to: '',
        subject: '',
        body: ''
    });
    const quillRef = useRef<ReactQuill | null>(null);

    useEffect(() => {
        if (quillRef.current) {
            quillRef.current.getEditor().enable(true);
        }
    }, []);

    const templateOptions = [
        { value: 'template1', label: 'Template 1' },
        { value: 'template2', label: 'Template 2' }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMailData({ ...mailData, [name]: value });
    };

    const handleTemplateChange = (selectedOption: { value: string; label: string } | null) => {
        if (selectedOption) {
            setMailData({ ...mailData, template: selectedOption.value });
        }
    };

    const handleBodyChange = (content: string) => {
        setMailData({ ...mailData, body: content });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Mail Data:', mailData);
        // Here you can send the mailData to your API
    };

    const modules = {
        toolbar: [
            [{ font: [] }, { size: [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ script: 'super' }, { script: 'sub' }],
            [{ header: [false, 1, 2, 3, 4, 5, 6] }, 'blockquote', 'code-block'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['direction', { align: [] }],
            ['link', 'image', 'video'],
            ['clean'],
        ],
    };

    return (
        <div className="bg-white p-3 mt-3 border rounded-3">
            <Row className=' mb-2 px-2'>
                <div className="d-flex justify-content-between profilebar p-2">
                    <h4 className='text-primary d-flex align-items-center m-0'><i className="ri-file-list-line me-2 text-primary "></i>Manage Mail</h4>
                    <div className="d-flex justify-content-end bg-light w-50 profilebar">

                    </div>
                </div>
            </Row>


            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col lg={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Template</Form.Label>
                            <Select
                                options={templateOptions}
                                onChange={handleTemplateChange}
                                placeholder="Select a template"
                            />
                        </Form.Group>
                    </Col>
                    <Col lg={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>To</Form.Label>
                            <Form.Control
                                type="text"
                                name="to"
                                value={mailData.to}
                                onChange={handleChange}
                                placeholder="Recipient email (e.g., abc@xyz.com)"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control
                                type="text"
                                name="subject"
                                value={mailData.subject}
                                onChange={handleChange}
                                placeholder="Enter mail subject"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Body</Form.Label>
                            <ReactQuill
                                ref={quillRef}
                                modules={modules}
                                value={mailData.body}
                                onChange={handleBodyChange}
                                theme="snow"
                                style={{ height: 340 }}
                                className="pb-4"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex justify-content-end">
                        <Link to='/pages/InstantMail'>
                            <Button variant="secondary" className="me-2">Cancel</Button>
                        </Link>
                        <Button variant="primary" type="submit">Send Mail</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default AddMailScreen;