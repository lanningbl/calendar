import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { startOfDay } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EventModal = (props) => {
  const [title, setTitle] = useState(!props.editMode ? '' : props.event.title);
  const [location, setLocation] = useState(
    !props.editMode ? '' : props.event.location
  );
  const [startDate, setStartDate] = useState(
    !props.editMode ? Date.parse(props.day) : Date.parse(props.event.startDate)
  );
  const [endDate, setEndDate] = useState(
    !props.editMode ? Date.parse(props.day) : Date.parse(props.event.endDate)
  );
  const [isTimeSet, setIsTimeSet] = useState(
    !props.editMode ? false : props.event.isTimeSet
  );
  const [validated, setValidated] = useState(false);
  const [showVerifyDeleteModal, setShowVerifyDeleteModal] = useState(false);

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleChangeLocation = (e) => {
    setLocation(e.target.value);
  };

  const handleChangeStartDate = (date) => {
    setStartDate(date);
    if (date > endDate) {
      setEndDate(date);
    }
  };

  const handleChangeEndDate = (date) => {
    setEndDate(date);
    if (startDate > date) {
      setStartDate(date);
    }
  };

  const handleShowTime = () => {
    setIsTimeSet(!isTimeSet);
    setStartDate(startOfDay(startDate));
    setEndDate(startOfDay(endDate));
  };

  const handleClose = () => {
    props.toggleModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === true) {
      const event = {
        title,
        location,
        startDate,
        endDate,
        isTimeSet,
      };

      if (!props.editMode) {
        axios
          .post('/events/add', event)
          .then((res) => console.log(res.data))
          .then(props.fetchEvents)
          .then(handleClose());
      } else {
        axios
          .post('/events/update' + props.event._id, event)
          .then((res) => console.log(res.data))
          .then(props.fetchEvents)
          .then(handleClose);
      }
    }
    setValidated(true);
  };

  const toggleVerifyDeleteModal = () => {
    setShowVerifyDeleteModal(!showVerifyDeleteModal);
  };

  const handleDelete = () => {
    axios
      .delete('events/' + props.event._id)
      .then((response) => {
        console.log(response.data);
      })
      .then(props.fetchEvents)
      .then(handleClose);
  };

  return (
    <>
      <Modal show onHide={handleClose} animation={false} centered size='md'>
        <Modal.Header closeButton>
          <Modal.Title>
            {!props.editMode ? 'Create Event' : 'Edit Event'}
          </Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group controlId='formTitle'>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type='title'
                value={title}
                placeholder='Enter title'
                onChange={handleChangeTitle}
                required
                autoFocus
              />
              <Form.Control.Feedback type='invalid'>
                Please provide a title.
              </Form.Control.Feedback>
            </Form.Group>

            <div className='d-flex pb-3 justify-content-center'>
              <Button
                variant={!isTimeSet ? 'outline-dark' : 'dark'}
                onClick={handleShowTime}
              >
                {!isTimeSet ? 'Add time' : 'Remove time'}
              </Button>
            </div>
            <div className='date-picker'>
              <Form.Group controlId='formStartDate'>
                <DatePicker
                  className='btn btn-dark'
                  selected={startDate}
                  onChange={handleChangeStartDate}
                  showTimeSelect={isTimeSet}
                  timeFormat='p'
                  timeIntervals={15}
                  dateFormat={
                    isTimeSet ? 'MMMM d, yyyy - h:mm aa' : 'MMMM d, yyyy'
                  }
                />
              </Form.Group>
              <Form.Group controlId='formEndDate'>
                <DatePicker
                  className='btn btn-dark'
                  selected={endDate}
                  onChange={handleChangeEndDate}
                  showTimeSelect={isTimeSet}
                  timeFormat='p'
                  timeIntervals={15}
                  dateFormat={
                    isTimeSet ? 'MMMM d, yyyy - h:mm aa' : 'MMMM d, yyyy'
                  }
                />
              </Form.Group>
            </div>
            <Form.Group controlId='formLocation'>
              <Form.Label>Location</Form.Label>
              <Form.Control
                type='location'
                value={location}
                placeholder='Enter location'
                onChange={handleChangeLocation}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Close
            </Button>
            {props.editMode && (
              <Button variant='danger' onClick={toggleVerifyDeleteModal}>
                Delete
              </Button>
            )}
            <Button type='submit' variant='primary'>
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={showVerifyDeleteModal}
        onHide={toggleVerifyDeleteModal}
        animation={false}
        centered
        size='sm'
      >
        <Modal.Header>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this event?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={toggleVerifyDeleteModal}>
            No
          </Button>
          <Button variant='danger' onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EventModal;
