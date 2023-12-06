import { toQueryResult } from '../DTO/description'; // Adjust the path

export const fetchDataById = async (Id) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/detail/${Id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text();
        return toQueryResult(text);
    } 
    catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};