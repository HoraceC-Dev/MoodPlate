import React from "react";
import "./LeftSidebar.css";

const LeftSidebar = ({
  journals,
  setActiveJournal,
  activeJournalId,
  createNewJournal,
  deleteJournal,
}) => {
  return (
    <aside className="left-sidebar">
      {/* Button to Create a New Journal */}
      <button onClick={createNewJournal} className="create-button">
        + Create New Journal
      </button>
      {/* List of Journals */}
      {journals.length > 0 ? (
        <ul className="journal-list">
          {journals.map((journal) => (
            <li
              key={journal.id}
              className={`journal-item ${
                journal.id === activeJournalId ? "active-journal" : ""
              }`}
            >
              <button
                onClick={() => setActiveJournal(journal)}
                className="journal-button"
              >
                {journal.name}
              </button>
              <button
                onClick={() => deleteJournal(journal.id)}
                className="delete-button"
                title="Delete Journal"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-journals">No journals found.</p>
      )}
    </aside>
  );
};

export default LeftSidebar;

