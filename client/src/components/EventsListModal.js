import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import { format, isWithinInterval, isSameDay } from 'date-fns';
import { MdEdit, MdDelete } from 'react-icons/md';

import EventModal from './EventModal';

const EventsListModal = (props) => {
  const [events, setEvents] = useState(props.events);
  const [eventToEdit, setEventToEdit] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showVerifyDeleteModal, setShowVerifyDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState();

  useEffect(() => {
    setEvents(props.events);
  }, [props.events]);

  const eventModal = (e, type) => {
    if (type === 'create') {
      setEventToEdit({});
      setEditMode(false);
    } else if (type === 'edit') {
      setEventToEdit(e);
      setEditMode(true);
    }
    setShowEventModal(true);
  };

  const toggleEventModal = () => {
    setShowEventModal(!showEventModal);
  };

  const toggleVerifyDeleteModal = (id) => {
    setShowVerifyDeleteModal(true);
    setIdToDelete(id);
  };

  const handleDelete = (id) => {
    axios
      .delete('/events' + id)
      .then((response) => {
        console.log(response.data);
      })
      .then(props.fetchEvents);

    setEvents(events.filter((el) => el._id !== id));
    setShowVerifyDeleteModal(false);
  };

  return (
    <>
      {!props.eventModal && (
        <Modal
          show
          onHide={props.toggleModal}
          centered
          size='lg'
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Events for {format(Date.parse(props.day), 'MMMM d, yyyy')}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table bordered hover>
              <colgroup>
                <col style={{ width: '25%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '27%' }} />
                <col style={{ width: '27%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <thead className='thead-light'>
                <tr>
                  <th>Event</th>
                  <th>Location</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {events
                  .filter(
                    (event) =>
                      isWithinInterval(props.day, {
                        start: new Date(event.startDate),
                        end: new Date(event.endDate),
                      }) || isSameDay(props.day, new Date(event.startDate))
                  )
                  .sort((x, y) => (x.startDate > y.startDate ? 1 : -1))
                  .map((event) => (
                    <tr key={event._id}>
                      <td>{event.title}</td>
                      <td>{event.location}</td>
                      <td>
                        {format(
                          Date.parse(event.startDate),
                          'MMMM d, yyyy h:mm aa'
                        )}
                      </td>
                      <td>
                        {format(
                          Date.parse(event.endDate),
                          'MMMM d, yyyy h:mm aa'
                        )}
                      </td>
                      <td>
                        <MdEdit
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            eventModal(event, 'edit');
                          }}
                        />{' '}
                        |{' '}
                        <MdDelete
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            toggleVerifyDeleteModal(event._id);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={props.toggleModal}>
              Close
            </Button>
            <Button
              variant='primary'
              onClick={() => {
                eventModal(props.day, 'create');
              }}
            >
              Create Event
            </Button>
          </Modal.Footer>
        </Modal>
      )}
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
          <Button
            variant='danger'
            onClick={() => {
              handleDelete(idToDelete);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      {showEventModal && (
        <EventModal
          toggleModal={toggleEventModal}
          event={eventToEdit}
          day={props.day}
          editMode={editMode}
          fetchEvents={props.fetchEvents}
        />
      )}
    </>
  );
};

export default EventsListModal;
