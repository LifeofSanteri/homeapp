import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
  const [homeName, setHomeName] = useState('');
  const [innerDivs, setInnerDivs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalInput, setModalInput] = useState('');
  const [homeId, setHomeId] = useState(localStorage.getItem('homeId') || null);
  const [showTehtävälista, setShowTehtävälista] = useState(true);
  const [showMuistilista, setShowMuistilista] = useState(false);
  const [muistiinpanotInput, setMuistiinpanotInput] = useState('');
  const [muistiinpanot, setMuistiinpanot] = useState([]);
  

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    const fetchData = async () => {
      try {
        const response = await axios.post('https://backend-7hf8.onrender.com/fetch-home', { userId });
        const { status, homeName, homeId } = response.data;

        if (status === 'Success') {
          setHomeName(homeName);
          setHomeId(homeId);

          const todosResponse = await axios.post('https://backend-7hf8.onrender.com/fetch-todos', { homeId });
          const todos = todosResponse.data.todos;

          const todoDivs = todos.map((todo) => createInnerDiv(todo.id, todo.task));

          setInnerDivs(todoDivs);

          const notesResponse = await axios.post('https://backend-7hf8.onrender.com/fetch-notes', { homeId });
          const notes = notesResponse.data.notes;

          setMuistiinpanot(notes);
        } else {
          console.error('Error fetching home data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [homeId]);

  const createInnerDiv = (id, task) => (
    <div key={id} className='border border-1 border-dark rounded col-5 m-3 d-flex flex-column' style={{ height: '125px', position: 'relative' }}>
      <span>{task}</span>
      <div
        className="circle-checkbox"
        onClick={() => handleCheckboxChange(id)}
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor: 'grey',
          position: 'absolute',
          bottom: '5px',
          right: '5px',
          cursor: 'pointer'
        }}
      />
    </div>
  );

  const handleCheckboxChange = async (todoId) => {
    try {
      const response = await axios.post('http://localhost:3307/delete-todo', {
        todoId,
      });

      const { status } = response.data;

      if (status === 'TodoDeleted') {
        const todosResponse = await axios.post('http://localhost:3307/fetch-todos', { homeId });
        const todos = todosResponse.data.todos;

        const todoDivs = todos.map((todo) => createInnerDiv(todo.id, todo.task));

        setInnerDivs(todoDivs);
      } else {
        console.error('Error deleting todo:', response.data);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const addInnerDiv = (content) => {
    const uniqueId = Date.now();
    const newInnerDiv = createInnerDiv(uniqueId, content);

    setInnerDivs((prevInnerDivs) => [...prevInnerDivs, newInnerDiv]);
  };

  const openModal = () => setShowModal(true);

  const closeModal = () => setShowModal(false);

  const handleModalInputChange = (e) => setModalInput(e.target.value);

  const handleModalSubmit = async () => {
    try {
      addInnerDiv(modalInput);
      setModalInput('');
      closeModal();

      const userId = localStorage.getItem('userId');

      const response = await axios.post('http://localhost:3307/add-todo', {
        userId,
        homeId,
        task: modalInput,
      });

      const { status, homeId: returnedHomeId } = response.data;

      if (status === 'TodoAdded' && returnedHomeId !== null) {
        setHomeId(returnedHomeId);
      } else {
        console.error('Errors adding todo:', response.data);
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleTehtävälistaClick = () => {
    setShowTehtävälista(true);
    setShowMuistilista(false);
  };

  const handleMuistilistaClick = () => {
    setShowTehtävälista(false);
    setShowMuistilista(true);
  };

  const handleMuistiinpanotInputChange = (e) => setMuistiinpanotInput(e.target.value);

  const handleMuistiinpanotInputSubmit = async (e) => {
    if (e.key === 'Enter') {
      try {
        const newNote = { text: muistiinpanotInput, checked: false };

        const response = await axios.post('http://localhost:3307/add-note', {
          homeId,
          note: newNote.text,
        });

        const { status, noteId } = response.data;

        if (status === 'NoteAdded' && noteId !== null) {
          setMuistiinpanot((prevMuistiinpanot) => [...prevMuistiinpanot, { id: noteId, ...newNote }]);
          setMuistiinpanotInput('');
        } else {
          console.error('Error adding note:', response.data);
        }
      } catch (error) {
        console.error('Error adding note:', error);
      }
    }
  };
  const handleClearMuistilista = async () => {
    try {
      // Make a request to clear all notes for the current home_id
      const response = await axios.post('http://localhost:3307/clear-notes', { homeId });
  
      const { status } = response.data;
  
      if (status === 'NotesCleared') {
        // Update the muistiinpanot state to an empty array
        setMuistiinpanot([]);
      } else {
        console.error('Error clearing notes:', response.data);
      }
    } catch (error) {
      console.error('Error clearing notes:', error);
    }
  };

  const handleMuistiinpanotCheckboxChange = async (index) => {
    try {
      const updatedMuistiinpanot = muistiinpanot.map((item, i) => (
        i === index ? { ...item, checked: !item.checked } : item
      ));

      setMuistiinpanot(updatedMuistiinpanot);
      updateNoteCheckedState(muistiinpanot[index].id, !muistiinpanot[index].checked);
    } catch (error) {
      console.error('Error updating checkbox:', error);
    }
  };

  const updateNoteCheckedState = async (noteId, checked) => {
    try {
      await axios.post('http://localhost:3307/update-note-checked-state', {
        noteId,
        checked,
      });
    } catch (error) {
      console.error('Error updating note checked state:', error);
    }
  };

  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/'); // Use useNavigate directly in the component
    console.log(localStorage);
  };

  return (
<div className="d-flex justify-content-center align-items-center vh-100 bg-black">
  <div title={homeName} className="border w-25 rounded d-flex flex-column pt-5 h-75 bg-white position-relative">
    <h1 className="text-center">{homeName || 'Home'}</h1>

    <div className="d-flex justify-content-between align-items-center">
          <Link to="/join" className="text-end mx-3 btn btn-light text-dark p-0 w-auto">
            Liity kotiin
          </Link>
          <Link to="/" className="text-end mx-3 btn btn-light text-dark p-0 w-auto" onClick={handleSignOut}>
            Kirjaudu ulos
          </Link>
        </div>

        <div className="text-wrapper d-flex flex-row justify-content-evenly mt-5 mx-2">

          <button className={`btn btn-light w-50 p-3 border rounded border-1 border-dark m-0 ${showTehtävälista ? 'active' : ''}`} onClick={handleTehtävälistaClick}>
            Tehtävälista
          </button>
          <button className={`btn btn-light w-50 p-3 border rounded border-1 border-dark m-0 ${showMuistilista ? 'active' : ''}`} onClick={handleMuistilistaClick}>
            Muistilista
          </button>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <div className={`bg-white w-100 mx-2 mb-5 pb-5 ${showTehtävälista ? 'tehtävälista-bg' : 'd-none'}`}>
            <div
              className="border border-1 border-dark rounded d-flex flex-column bg-white"
              style={{ height: '400px', overflow: 'auto' }}
            >
              <div className="row justify-content-between mx-auto w-100">
                {innerDivs.map((innerDiv) => (
                  <React.Fragment key={innerDiv.key}>{innerDiv}</React.Fragment>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-dark m-3 position-absolute"
                style={{ bottom: '10px', right: '10px', width: '60px', height: '60px', fontSize: '16px' }}
                onClick={openModal}
              >
                +
              </button>
            </div>
          </div>
  
          <div className={`border border-1 border-dark rounded bg-white w-100 mx-2 mb-5 pb-5 ${showMuistilista ? 'muistilista-bg' : 'd-none'}`} style={{ height: '400px', overflow: 'auto' }}>
            <input
              type="text"
              value={muistiinpanotInput}
              onChange={handleMuistiinpanotInputChange}
              onKeyPress={handleMuistiinpanotInputSubmit}
              placeholder="Lisää muistiinpano..."
              className="form-control m-3 border-0 w-75"
            />
            {muistiinpanot.sort((a, b) => a.checked - b.checked).map((item, index) => (
              <div key={`${index}-${item.text}`} className={`m-2 d-flex align-items-center ${item.checked ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleMuistiinpanotCheckboxChange(index)}
                  className="form-check-input me-2 rounded-circle text-dark"
                />
                <span style={{ textDecoration: item.checked ? 'line-through' : 'none' }}>{item.text}</span>
              </div>
            ))}
            {showMuistilista && (
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-dark m-3 position-absolute"
                  style={{ bottom: '10px', right: '10px', width: 'auto', height: '60px', fontSize: '16px' }}
                  onClick={handleClearMuistilista}
                >
                  Tyhjennä
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
  
      <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content" style={{ backgroundColor: '#CCCCCC' }}>
            <div className="modal-header">
              <h5 className="modal-title" style={{ textAlign: 'center', width: '100%' }}>
                Uusi tehtävä
              </h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                value={modalInput}
                onChange={handleModalInputChange}
                className="form-control"
                placeholder="Kirjoita tähän"
              />
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-dark" onClick={handleModalSubmit}>
                Lisää tehtävä
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
