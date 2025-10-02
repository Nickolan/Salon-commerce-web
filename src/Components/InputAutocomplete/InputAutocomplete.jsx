import React, { useEffect, useState } from 'react';
import Autocomplete from 'react-google-autocomplete';
import './InputAutocomplete.css'
import { FiMapPin } from "react-icons/fi";

const InputAutocomplete = ({ placeholder, onPlaceSelected}) => {

  return (
    <div className="autocomplete-container">
      <Autocomplete
        apiKey={import.meta.env.VITE_API_KEY}
        onPlaceSelected={async (place) => {
          
          const details = place;
          const data = {
            description: place?.formatted_address || place?.name,
          }; 
          onPlaceSelected(data, details);
        }} 
        options={{
          componentRestrictions: { country: 'cl' },
        }}
        placeholder={placeholder || ''}
        className="autocomplete-input"
      />
      <FiMapPin />
    </div>
  );
};

export default InputAutocomplete;
