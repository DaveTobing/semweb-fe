import { toQueryResult } from '../DTO/queryresult'; // Adjust the path

// export const fetchData = (query) => {
//     return fetch(`http://127.0.0.1:8000/api/v1/query_by_model?query=${query}&page=1`)
//         .then(response => response.json())
//         .then(json => toQueryResult(json))
//         .catch(error => {
//             console.error('Error fetching data:', error);
//             return null;
//         });
// };

// export const fetchData = async (query) => {
//     try {
//         const response = await fetch(`http://127.0.0.1:8000/api/v1/query_by_model?query=${query}`);
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const text = await response.text();
//         console.log(text); // Log the raw text response
//         return toQueryResult(text);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return null;
//     }
// };

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
        case 'priceRange':
            apiUrl += `query_by_price_range?min=${query}&page=1&max=${query}`;
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
        console.log(text); // Log the raw text response
        return toQueryResult(text);
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};

