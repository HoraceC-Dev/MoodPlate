// src/components/RightPanel.js
import React, { useState, useEffect, act } from 'react';
import './RightPanel.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const RightPanel = ({ activeJournal }) => {
  const [panelContent, setPanelContent] = useState(''); // 'recommendation' or 'preferences'
  const [recommendation, setRecommendation] = useState(null);
  const [preferences, setPreferences] = useState({
    favoriteFood: '',
    dietaryRestrictions: '',
    cuisineType: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Effect to check recommendation when activeJournal changes
  useEffect(() => {
    const checkRecommendation = async () => {
      if (!activeJournal) return;
      
      try {
        const response = await fetch(`http://localhost:8000/recipe_recommendation/${activeJournal.id}`);

        const data = await response.json();
        if (data.recommendation) {
          setRecommendation(data.recommendation);
          setPanelContent('recommendation');
        } else {
          setRecommendation(null);
          setPanelContent('preferences');
        }
      } catch (err) {
        console.error('Error fetching recommendation:', err);
        setError('');
        setPanelContent('preferences'); // Proceed to collect preferences even on error
      }
    };
    
    checkRecommendation();
  }, [activeJournal]);
  
  // Handle input changes for preferences
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle form submission to generate recommendation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);

    const updatedPreferences = { ...preferences }; // Create a copy of the current preferences
    for (const [key, value] of formData.entries()) {
      updatedPreferences[key] = value === "null" ? null : value; // Update the copied object
    }

    setPreferences(updatedPreferences); // Update the state using setPreferences
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const data = {
        journal: {
          "content": activeJournal.content,
          "name": activeJournal.name,
          "id": activeJournal.id,
          "recommendation": activeJournal.recommendation
        },
        preference: {
          favoriteFood:preferences.favoriteFood, 
          dietaryRestrictions: preferences.dietaryRestrictions,
          cuisineType: preferences.cuisineType,
        }
      };
      
      const response = await fetch("http://localhost:8000/recipe_recommendation", {
        method: "POST", // Use POST to send data in the request body
        headers: {
          "Content-Type": "application/json", // Specify the content type
        },
        body: JSON.stringify(data), // Convert the data object to a JSON string
      });
      const result = await response.json();

      if (result.recommendation) {
        setRecommendation(result.recommendation);
        setPanelContent('recommendation');
      } else {
        setError('Failed to generate recommendation.');
      }
    } catch (err) {
      console.error('Error generating recommendation:', err);
      setError('An error occurred while generating the recommendation.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle regenerating recommendation
  const handleRegenerate = () => {
    setPanelContent('preferences');
    setRecommendation(null);
  };
  
  // Handle panel close (optional)
  // For this implementation, the panel is always visible when a journal is active
  // If you want to add a close button, you can implement it here
  
  if (!activeJournal) {
    return null; // Do not render RightPanel if no journal is active
  }
  
  return (
    <div className="right-panel">
      <h2>{panelContent === 'recommendation' ? 'Your Recommendation' : 'Provide Your Preferences'}</h2>
      
      {panelContent === 'recommendation' ? (
      <div className="markdown-container">
        {/* <ReactMarkdown
          //children={recommendation}
          //remarkPlugins={[remarkGfm]} // Enable GitHub Flavored Markdown
        />{recommendation}<ReactMarkdown/> */}
        <ReactMarkdown>{recommendation}</ReactMarkdown>
        <button onClick={handleRegenerate}>Regenerate Recommendation</button>
      </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Favorite Food */}
          <div className="form-group">
            <label htmlFor="favoriteFood">Favorite Food:</label>
            <select
              id="favoriteFood"
              name="favoriteFood"
              value={preferences.favoriteFood}
              onChange={handleChange}
              required
            >
              <option value="null">Select an option</option>
              <option value="American">American</option>
              <option value="Chinese">Chinese</option>
              <option value="European">European</option>
              <option value="Indian">Indian</option>
              <option value="Italian">Italian</option>
              <option value="Japanese">Japanese</option>
              <option value="Korean">Korean</option>
              <option value="Mexican">Mexican</option>
              <option value="Thai">Thai</option>
              <option value="null">None</option>
            </select>
          </div>
          {/* Dietary Restrictions */}
          <div className="form-group">
            <label htmlFor="dietaryRestrictions">Dietary Restrictions:</label>
            <select
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              value={preferences.dietaryRestrictions}
              onChange={handleChange}
            >
              <option value="null">Select an option</option>
              <option value="Ketogenic">Vegetarian</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Gluten Free">Gluten-Free</option>
              <option value="Keto">Keto</option>
              <option value="Paleo">Paleo</option>
              <option value="null">None</option>
            </select>
          </div>
          {/* Cuisine Type */}
          <div className="form-group">
            <label htmlFor="cuisineType">Cuisine Type:</label>
            <select
              id="cuisineType"
              name="cuisineType"
              value={preferences.cuisineType}
              onChange={handleChange}
              required
            >
              <option value="null">Select an option</option>
              <option value="popularity">Popularity</option>
              <option value="time">Preparation Time</option>
              <option value="healthiness">Healthiness</option>
              <option value="calories">Calories</option>
              <option value="price">Price</option>
              <option value="null">None</option>
            </select>
          </div>
          
          {error && <p className="error">{error}</p>}
          
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  );
};

export default RightPanel;
