import React, { useState } from 'react'
import { InputGroup, Input, InputLeftElement, Select} from '@chakra-ui/react'
import { Search2Icon, CloseIcon } from '@chakra-ui/icons'
import { Card, CardHeader, CardBody, CardFooter, SimpleGrid, Heading, Text, Button } from '@chakra-ui/react'
import { fetchData } from '../api/api';
import { fetchDataByPriceRange } from '../api/fetchDataByPriceRange ';

const Landingpage = () => {
    const [query, setQuery] = useState('');
    const [cardData, setCardData] = useState([]);
    const [cardDescriptionData, setcardDescriptionData] = useState([]);
    const [selectedSearchType, setSelectedSearchType] = useState('model');
    const [minimumPrice, setPriceMin] = useState(0);
    const [maximumPrice, setPriceMax] = useState(0);

    const[showModal, setShowModal] = useState(false)

    const openModal = () => {
      setShowModal(true);
    };
  
    const closeModal = () => {
      setShowModal(false);
    };

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


    const handlePriceSubmit = (event) => {
        event.preventDefault();
        if (minimumPrice && maximumPrice) {
            fetchDataByPriceRange(minimumPrice, maximumPrice).then(data => {
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
        <div className='bg-gray-800 flex justify-center flex-col h-screen pt-16'>
            <div className='text-white flex flex-row justify-center gap-8 pb-8'>
                <h1 className='text-white text-center text-3xl'>Car Price</h1>
            </div>

            {selectedSearchType !== 'priceRange' && (
            <div className= 'mx-32 flex justify-center items-center text-white'>
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
            )}

            {selectedSearchType === 'priceRange' && (
                <div className= 'mx-32 flex justify-center items-center text-white'>
                    <form onSubmit={handlePriceSubmit} className='flex flex-row gap-10'>
                        <div className='flex flex-col items-center'>
                            <h2 className='text-xl pb-4'>Minimum Price</h2>
                            <Input
                                type='number'
                                placeholder='Enter Price Range'
                                value={minimumPrice}
                                onChange={(e) => setPriceMin(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col items-center'>
                            <h2 className='text-xl pb-4'>Maximum Price</h2>
                            <Input
                                type='number'
                                placeholder='Enter Price Range'
                                value={maximumPrice}
                                onChange={(e) => setPriceMax(e.target.value)}
                            />
                        </div>
                    </form>
                </div>
            )}

            <div className='mx-[600px] pt-8'>
                <Select 
                    onChange={(e) => setSelectedSearchType(e.target.value)}
                    color='white'
                    sx={{
                        bg: 'gray.700',
                        '& > option': {
                            bg: 'gray.700',
                        },
                    }}
                >
                    <option value='model'>Search by Model</option>
                    <option value='manufacturer'>Search by Manufacturer</option>
                    <option value='priceRange'>Search by Price Range</option>
                </Select>
            </div>

            <div className='bg-gray-800 flex px-32 pt-10 h-4/6 overflow-y-auto'>
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
                                    <Button onClick={openModal} >Description</Button>
                                </CardFooter>
                            </Card>
                        ))}
                </SimpleGrid>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-[40] text-white bg-black bg-opacity-60">
                    <div className="relative w-[90%] h-[80%] md:w-[800px] md:h-[650px] p-4 rounded-lg bg-gray-800">
                        <CloseIcon onClick={closeModal} className="absolute top-4 right-4" style={{ fontSize: '1rem', color: '#FFF', cursor: 'pointer' }}/>
                        <h2 className='text-2xl text-center pt-3'>Description</h2>
                    </div>
                </div>
            )}
    </div>
    )
    }

export default Landingpage