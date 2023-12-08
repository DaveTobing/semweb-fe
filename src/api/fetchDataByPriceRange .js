import { toQueryResult } from '../DTO/queryresult'; // Adjust the path

export const fetchDataByPriceRange = async (minPrice, maxPrice, page) => {
    try {
        const min = parseInt(minPrice);
        const max = parseInt(maxPrice);
        const response = await fetch(`https://saya-mau-datang-dev-tbkd.2.sg-1.fl0.io/api/v1/query_by_price_range?min=${min}&page=${page}&max=${max}`);
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