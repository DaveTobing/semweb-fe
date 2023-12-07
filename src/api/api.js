import { toQueryResult } from '../DTO/queryresult'; // Adjust the path
// api.js

export const fetchData = async (query, selectedOption, page) => {
    let apiUrl = `http://127.0.0.1:8000/api/v1/`;
    
    switch (selectedOption) {
        case 'model':
            apiUrl += `query_by_model?query=${query}&page=${page}`;
            break;
        case 'manufacturer':
            apiUrl += `query_by_manufacturer?query=${query}&page=${page}`;
            break;
        case 'cateogry':
            apiUrl += `query_by_manufacturer?query=${query}&page=${page}`
        default:
            apiUrl += `query_by_category?query=${query}&page=${page}`;
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

