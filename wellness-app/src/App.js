import logo from "./assets/logo.png";
import React, { useState } from "react";
import "./App.css";


function App() {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  const toggleRightPanel = () => {
    setIsRightPanelOpen(!isRightPanelOpen);
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
        <aside className="left-sidebar">
          <ul>
            <li>Journal 1</li>
            <li>Journal 2</li>
            <li>Journal 3</li>
            <li>+ Create New Journal</li>
          </ul>
        </aside>

        {/* Workstation in the middle */}
        <main className="workstation">
          <textarea placeholder="Write your journal here..." />
        </main>

        {/* Right Expandable Panel */}
        <aside
          className={`right-panel ${isRightPanelOpen ? "open" : "closed"}`}
        >
          <button className="toggle-button" onClick={toggleRightPanel}>
            {isRightPanelOpen ? "Close" : "Open"}
          </button>
          {isRightPanelOpen && <div className="info-content">Additional Information</div>}
        </aside>
      </div>
    </div>
  );
}

export default App;

