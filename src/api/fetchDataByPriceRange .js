import { toQueryResult } from '../DTO/queryresult'; // Adjust the path

export const fetchDataByPriceRange = async (minPrice, maxPrice) => {
    try {
        const min = parseInt(minPrice);
        const max = parseInt(maxPrice);
        const response = await fetch(`http://127.0.0.1:8000/api/v1/query_by_price_range?minPrice=${min}&maxPrice=${max}`);
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