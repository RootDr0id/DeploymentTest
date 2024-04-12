/*const App = ({notes}) => {
  //const { notes } = props;
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
    </div>
  );
};
*/
import Note from "./components/Note";
import { useState, useEffect } from "react";
import axios, { Axios } from "axios";
import noteService from "./services/notes";
import Notification from "./components/Notification";

const App = () => {
  const [notes, setNotes] = useState([]);
  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      //  id: notes.length + 1, // let the server generate the id
    };
    noteService.create(noteObject).then((response) => {
      console.log(response);
      setNotes(notes.concat(response.data));
      setNewNote("");
    });

    // setNotes(notes.concat(noteObject));
    // setNewNote("");
  };
  const [newNote, setNewNote] = useState("a new note...");

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };
  const [showAll, setShowAll] = useState(true);

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  useEffect(() => {
    console.log("effect");
    noteService.getAll().then((response) => {
      console.log("promise fulfilled");
      setNotes(response.data);
    });
  }, []);

  console.log("render", notes.length, "notes");

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`;
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((response) => {
        setNotes(notes.map((note) => (note.id !== id ? note : response.data)));
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter((n) => n.id !== id));
      });
  };
  const [errorMessage, setErrorMessage] = useState(null);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      < Footer />
    </div>
  );
};
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2024</em>
    </div>
  )
}
export default App;
