import { toQueryResult } from '../DTO/queryresult'; // Adjust the path
// api.js

export const fetchData = async (query, selectedOption) => {
    let apiUrl = `http://127.0.0.1:8000/api/v1/`;
    
    switch (selectedOption) {
        case 'model':
            apiUrl += `query_by_model?query=${query}`;
            break;
        case 'manufacturer':
            apiUrl += `query_by_manufacturer?query=${query}`;
            break;
        default:
            apiUrl += `query_by_model?query=${query}`;
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text();
        return toQueryResult(text);
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};

