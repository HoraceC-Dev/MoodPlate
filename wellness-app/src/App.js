import React, { useState,useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import logo from "./assets/logo.png"
import "./App.css";
import LeftSidebar from "./components/LeftSidebar";
import RightPanel from './components/RightPanel';
import "./FontFormat.css";
import "./quillSizes.css";

const quillModules = {
  toolbar: [
    [{ font: [] }], // Default font options
    [{ size: [] }], // Default size options
    [{ header: [1, 2, 3, false] }], // Headers
    ["bold", "italic", "underline", "strike"], // Text formatting
    [{ color: [] }, { background: [] }], // Colors
    [{ list: "ordered" }, { list: "bullet" }], // Lists
    [{ align: [] }], // Text alignment
    ["blockquote", "code-block"], // Block elements
    ["link", "image", "video"], // Media
    ["clean"], // Remove formatting
  ],
};


function App() {
  const [journals, setJournals] = useState([]); // Manage the list of journals
  const [activeJournal, setActiveJournal] = useState(null); // Manage the currently active journal
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { v4: uuidv4 } = require('uuid');

  const togglePanel = () => {
    if (!activeJournal) {
      alert('Please select a journal first.');
      return;
    }
    setIsPanelOpen((prev) => !prev);
  };

  const fetchJournals = async () => {
    try {
      const response = await fetch("https://moodplate.onrender.com/journals"); // Replace with your FastAPI URL
      if (!response.ok) {
        throw new Error("Failed to fetch journals");
      }
      const data = await response.json();
      setJournals(data);
    } catch (error) {
      console.error("Error fetching journals:", error);
    }
  };

  const updateJournalTitle = (newTitle) => {
    if (activeJournal) {
      const updatedJournal = { ...activeJournal, name: newTitle };
      setActiveJournal(updatedJournal);

      // Update the state and backend
      const updatedJournals = journals.map((journal) =>
        journal.id === activeJournal.id ? updatedJournal : journal
      );
      setJournals(updatedJournals);

      // Optional: Update the backend
      fetch(`https://moodplate.onrender.com/journals/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedJournal),
      }).catch((error) => console.error("Error updating journal:", error));
    }
  };
  
  const deleteJournal = async (journalId) => {
    try {
      const response = await fetch(`https://moodplate.onrender.com/journals/${journalId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete journal");
      }
      setJournals((prevJournals) => prevJournals.filter((j) => j.id !== journalId));
      if (activeJournal?.id === journalId) {
        setActiveJournal(null);
      }
    } catch (error) {
      console.error("Error deleting journal:", error);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  const createNewJournal = async () => {
    const newJournal = {
      id: String(uuidv4()),
      name: `New Journal ${journals.length + 1}`,
      content: "",
      recommendation: null
    };

    setJournals((prevJournals) => [...prevJournals, newJournal]);
    setActiveJournal(newJournal);

    try {
      const response = await fetch("https://moodplate.onrender.com/journals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newJournal), // Send the new journal as JSON
      });
  
      if (!response.ok) {
        throw new Error("Failed to save the journal to the database");
      }
  
      const result = await response.json();
      console.log("Journal saved to the database:", result);
    } catch (error) {
      console.error("Error saving journal:", error);
    }
  };

  const handleContentChange = (content) => {
    if (content === '<p><br></p>') {
      // Do nothing if content is exactly '<br>'
      return;
    }
    if (activeJournal) {
      const updatedJournal = { ...activeJournal, content: content };
      setActiveJournal(updatedJournal);

      // Update the state and backend
      const updatedJournals = journals.map((journal) =>
        journal.id === activeJournal.id ? updatedJournal : journal
      );
      setJournals(updatedJournals);

      // Optional: Update the backend
      fetch(`https://moodplate.onrender.com/journals/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedJournal),
      }).catch((error) => console.error("Error updating journal:", error));
    }
  };

  return (
    <div className="app">
      {/* Top Header Bar */}
      <header className="header">
        <div className="logo">
          <img src={logo} alt="Website Logo" />
        </div>
        <nav className="menu-bar">
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </nav>
      </header>
      {/* Main Layout */}
      <div className="main-content">
        {/* Left Sidebar */}
        <LeftSidebar
          journals={journals}
          setActiveJournal={setActiveJournal}
          activeJournalId={activeJournal?.id}
          createNewJournal={createNewJournal}
          deleteJournal={deleteJournal}
        />
        <main className="workstation">
          {activeJournal ? (
            <div>
              {/* Editable Title */}
              <input
                type="text"
                className="title-input"
                value={activeJournal.name}
                onChange={(e) => updateJournalTitle(e.target.value)}
              />
              {/* Editor for Journal Content */}
              <ReactQuill
                value={activeJournal.content}
                onChange={handleContentChange}
                modules={quillModules}
                formats={[
                  "font",
                  "size",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "color",
                  "background",
                  "list",
                  "bullet",
                  "align",
                ]}
              />
            </div>
          ) : (
            <p>Select or create a journal to start writing.</p>
          )}
        </main>
          <div className="toggle-button-container">
            <button onClick={togglePanel} className="toggle-button">
              {isPanelOpen ? 'Close Recommendation Panel' : 'Open Recommendation Panel'}
            </button>
          </div>
          
          {/* RightPanel Component */}
          {isPanelOpen && (
            <RightPanel
              activeJournal={activeJournal}
              onClose={() => setIsPanelOpen(false)}
            />
          )}
          
      </div>
    </div>
  );
}

export default App;
