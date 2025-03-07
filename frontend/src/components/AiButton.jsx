import React, { useState } from 'react';
import axios from 'axios';

const AiButton = ({ onSuggestions, formData, setFormData }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/ai/suggest-titles', {
        input: formData.title
      });
      const suggestions = response.data.suggestions;
      onSuggestions(suggestions);

      // Auto-populate form fields based on selected suggestion
      if (suggestions.length > 0) {
        const bestMatch = suggestions[0];
        setFormData({
          ...formData,
          title: bestMatch.title,
          description: bestMatch.description,
          tags: bestMatch.tags
        });
      }
    } catch (error) {
      console.error('AI suggestion error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? '...' : 'AI'}
    </button>
  );
};

export default AiButton;