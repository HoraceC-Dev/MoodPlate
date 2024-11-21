import React, { useState, useCallback,useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import logo from "./assets/logo.png"
import "./App.css";
import LeftSidebar from "./components/LeftSidebar";
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
  const [isPanelOpen, setIsPanelOpen] = useState(false); // Tracks panel state
  const [questions, setQuestions] = useState([""]);
  const [apiResponse, setApiResponse] = useState(null); // Stores API response
  // Fetch journals from the backend
  const fetchJournals = async () => {
    try {
      const response = await fetch("http://localhost:8000/journals"); // Replace with your FastAPI URL
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
      fetch(`http://localhost:8000/journals/${activeJournal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedJournal),
      }).catch((error) => console.error("Error updating journal:", error));
    }
  };
  const deleteJournal = async (journalId) => {
    try {
      const response = await fetch(`http://localhost:8000/journals/${journalId}`, {
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
  const handlePanelToggle = () => {
    setIsPanelOpen(!isPanelOpen); // Toggle the panel open/close
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = value; // Update the specific question
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, ""]); // Add an empty question field
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/your-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions }), // Send questions array to backend
      });

      const data = await response.json();
      setApiResponse(data); // Save the string and URL returned from the backend
    } catch (error) {
      console.error("Error triggering API:", error);
    }
  };
  const syncJournalContent = useCallback(async () => {
    if (!activeJournal) return;
    try {
      const response = await fetch(`http://localhost:8000/journals/${activeJournal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activeJournal),
      });
      if (!response.ok) {
        throw new Error("Failed to save journal");
      }

      console.log("Journal synced successfully!");
    } catch (error) {
      console.error("Error syncing journal:", error);
    } 
  }, [activeJournal]); // Use activeJournal as a dependency

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        syncJournalContent();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [syncJournalContent]);

  useEffect(() => {
    fetchJournals();
  }, []);

  const createNewJournal = async () => {
    const newJournal = {
      id: Date.now(),
      name: `New Journal ${journals.length + 1}`,
      content: "",
    };

    setJournals((prevJournals) => [...prevJournals, newJournal]);
    setActiveJournal(newJournal);

    try {
      const response = await fetch("http://localhost:8000/journals", {
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
    if (activeJournal) {
      setActiveJournal({ ...activeJournal, content }); // Update content in the active journal
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
        {/* Right Panel */}
        <div className={`right-panel ${isPanelOpen ? "open" : ""}`}>
          <button className="close-button" onClick={handlePanelToggle}>
            Close
          </button>
          <form onSubmit={handleFormSubmit}>
            <h3>Answer Questions</h3>
            {questions.map((question, index) => (
              <label key={index}>
                Question {index + 1}:
                <input
                  type="text"
                  value={question}
                  onChange={(e) =>
                    handleQuestionChange(index, e.target.value)
                  }
                />
              </label>
            ))}
            <button type="button" onClick={handleAddQuestion}>
              Add Question
            </button>
            <button type="submit">Submit</button>
          </form>
          {apiResponse && (
            <div className="api-response">
              <p>Response: {apiResponse.string}</p>
              <a href={apiResponse.url} target="_blank" rel="noopener noreferrer">
                Visit Link
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
