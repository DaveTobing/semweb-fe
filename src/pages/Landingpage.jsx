import React, { useState } from 'react'
import { InputGroup, Input, InputLeftElement, Select} from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import { Card, CardHeader, CardBody, CardFooter, SimpleGrid, Heading, Text, Button } from '@chakra-ui/react'
import { fetchData } from '../api/api';

const Landingpage = () => {
    const [query, setQuery] = useState('');
    const [cardData, setCardData] = useState([]);

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (query) {
            fetchData(query).then(data => {
                if (data) {
                    setCardData(data.results.bindings);
                }
            });
        }
    };

    const extractIdFromUrl = (url) => {
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    return (
        <div className='bg-gray-800 flex justify-center flex-col h-screen'>
            <div className='text-white flex flex-row justify-center gap-8 '>
                <h1 className='text-white text-center text-3xl pb-6'>Car Price</h1>
            </div>
            <div className='mx-32 flex justify-center items-center text-white'>
                <form onSubmit={handleSearchSubmit} className='w-full'>
                    <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <Search2Icon color='gray.300' />
                        </InputLeftElement>
                        <Input 
                            placeholder='Search' 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </InputGroup>
                </form>
            </div>
            <div className='mx-[600px] pt-8'>
                <Select 
                    color='white'
                    sx={{
                        // Style for the select input itself
                        bg: 'gray.700',
                        // Style for the dropdown list (options)
                        '& > option': {
                            bg: 'gray.700', // Change this color as needed
                        },
                    }}
                >
                    <option value='model'>Search by Model</option>
                    <option value='manufacturer'>Search by Manufacturer</option>
                    <option value='priceRange'>Search by Price Range</option>
                </Select>
            </div>

            <div className='bg-gray-800 flex px-32 pt-10 h-4/6 overflow-y-auto'>
                {query && (
                    <SimpleGrid columns={4} spacing={10}>
                        {cardData.map((card) => (
                            <Card key={extractIdFromUrl(card.CarID.value)} >
                                <CardHeader>
                                    <Heading size='md'>Id: {extractIdFromUrl(card.CarID.value)}</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Text>Price: {card.currency.value} {card.price.value}</Text>
                                </CardBody>
                                <CardFooter>
                                    <Button>Description</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </SimpleGrid>
                )}
            </div>
        </div>
    )
    }

export default Landingpage