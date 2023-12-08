import React, { useState, useEffect } from 'react'
import { InputGroup, Input, InputLeftElement, Select, Spinner} from '@chakra-ui/react'
import { Search2Icon, CloseIcon } from '@chakra-ui/icons'
import { Card, CardHeader, CardBody, CardFooter, SimpleGrid, Heading, Text, Button } from '@chakra-ui/react'
import { fetchData } from '../api/api';
import { fetchDataByPriceRange } from '../api/fetchDataByPriceRange ';
import { fetchDataById } from '../api/fetchDescription';
import { useSearchParams  } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react'

const Landingpage = () => {
    const [query, setQuery] = useState('');
    const [cardData, setCardData] = useState([]);
    const [cardDescriptionData, setcardDescriptionData] = useState([]);
    const [selectedSearchType, setSelectedSearchType] = useState('model');

    const [minimumPrice, setPriceMin] = useState(0);
    const [maximumPrice, setPriceMax] = useState(0);

    const[showModal, setShowModal] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams(); // Create the navigate instance
    const [currentPage, setCurrentPage] = useState(1);

    const [isLoading, setIsLoading] = useState(false);


    const closeModal = () => {
        setSearchParams({ search: query })  
        setShowModal(false);
    };

    useEffect(() => {
        setPriceMin(0);
        setPriceMax(0);
        setQuery('');
        setCardData([]);
        setSearchParams();
        setCurrentPage(1);
    }, [selectedSearchType]);


    useEffect(() => {
        fetchPageData();
    }, [currentPage]);


    const handleDescriptionClick = (id) => {
        setShowModal(true);
        setSearchParams({ description: id });
        setIsLoading(true); 

        setcardDescriptionData([])
        fetchDataById(id).then(data => {
            if (data) {
                setcardDescriptionData(data.results.bindings);
            }
        }).finally(() => {
            setIsLoading(false); // Hide loader once data is fetched
        });
    };
  

    const fetchPageData = () => {
        if (selectedSearchType === 'priceRange' && minimumPrice && maximumPrice) {
            fetchDataByPriceRange(minimumPrice, maximumPrice, currentPage).then(data => {
                if (data) {
                    setCardData(data.results.bindings);
                }
            })
            .finally(() => {
                setIsLoading(false); // Hide loader in any case
            });
            
        } 
        else if (query) {
            fetchData(query, selectedSearchType, currentPage).then(data => {
                if (data) {
                    setCardData(data.results.bindings);
                }
            })
            .finally(() => {
                setIsLoading(false); // Hide loader in any case
            });
            
        }
    };
    
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true)
        if (selectedSearchType !== 'priceRange'){
            if (query) {
                fetchData(query, selectedSearchType, 1).then(data => {
                    if (data && data.results.bindings.length > 0) {
                        setCardData(data.results.bindings);
                        setSearchParams({ search: query });
                        setCurrentPage(1);
                    } else {
                        setCardData([]);
                    }
                })
                .finally(() => { // Clear the timer
                    setIsLoading(false); // Hide loader in any case
                });
            }

        }

        else if (selectedSearchType === 'priceRange'){
            if (minimumPrice && maximumPrice) {
                fetchDataByPriceRange(minimumPrice, maximumPrice, 1).then(data => {
                    if (data && data.results.bindings.length > 0) {
                        setCardData(data.results.bindings);
                        setSearchParams({ min: minimumPrice, max: maximumPrice });
                        setCurrentPage(1);
                    } else {
                        setCardData([]); // Clear results if no data
                    }
                })
                .finally(() => {
                    setIsLoading(false); // Hide loader in any case
                });
            }
        }
    };

    const handleNextPage = () => {
        if (cardData.length > 0 && query) {
            setIsLoading(true); // Start loading
            setCurrentPage(currentPage + 1);
        }
    };
    
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setIsLoading(true); // Start loading
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const extractIdFromUrl = (url) => {
        const parts = url.split('#');
        return parts[parts.length - 1];
    };


    return (
        <div className='bg-gray-800 flex justify-center flex-col h-screen pt-16'>
            <div className='text-white flex flex-row justify-center gap-8 pb-8'>
                <h1 className='text-white text-center text-3xl font-bold'>Car Price</h1>
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
                    <form onSubmit={handleSearchSubmit} className='flex flex-row gap-10'>
                        <div className='flex flex-col items-center'>
                            <h2 className='text-xl pb-4'>Minimum Price</h2>
                            <Input
                                type='number'
                                placeholder='Enter Price Range'
                                value={minimumPrice}
                                onChange={(e) => setPriceMin(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                            />
                        </div>
                        <div className='flex flex-col items-center'>
                            <h2 className='text-xl pb-4'>Maximum Price</h2>
                            <Input
                                type='number'
                                placeholder='Enter Price Range'
                                value={maximumPrice}
                                onChange={(e) => setPriceMax(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                            />
                        </div>
                    </form>
                </div>
            )}

            <div className='mx-[300px] pt-8 flex flex-row gap-8'>
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
                    <option value='Category'>Search by Category</option>
                </Select>
            </div>

            <div className='flex flex-row items-center justify-center pt-8 gap-8'>
                <Button onClick={handlePreviousPage} disabled={currentPage === 1}> Previous </Button>
                    <span className='text-white text-xl'>Page {currentPage}</span>
                <Button onClick={handleNextPage}>Next</Button>
            </div>

            {isLoading && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-[90]"></div>
                    <div className="fixed inset-0 flex items-center justify-center  z-[90]">
                        <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
                    </div>
                </>
            )}

            <div className='bg-gray-800 flex px-32 mt-10 h-4/6 overflow-y-auto'>
                <SimpleGrid columns={4} spacing={10}>
                        {cardData.map((card) => (
                            <Card key={extractIdFromUrl(card.CarID.value)} height='200px' width='350px'>
                                <CardHeader>
                                    <Heading size='md'>Id: {extractIdFromUrl(card.CarID.value)}</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Text fontSize='lg'>Price: <a className='text-[#9EC8B9]' href={card.currency.value}>$</a> {card.price.value}</Text>
                                </CardBody>
                                <CardFooter>
                                    <Button onClick={() => handleDescriptionClick(extractIdFromUrl(card.CarID.value))}>Description</Button>
                                </CardFooter>
                            </Card>
                        ))}
                </SimpleGrid>
            </div>
        

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-[80] text-white bg-black bg-opacity-80">
                    <div className="relative w-[90%] h-[80%] md:w-[800px] md:h-[650px] p-4 rounded-lg bg-gray-800 overflow-hidden">
                        <CloseIcon onClick={closeModal} className="absolute top-4 right-4" style={{ fontSize: '1rem', color: '#FFF', cursor: 'pointer' }}/>
                        <h2 className='text-xl text-center pt-1 font-bold'>Car Details</h2>
                        <div className='overflow-y-auto h-full pb-5 '>
                            <TableContainer>
                                <Table variant='simple'>
                                    <TableCaption>Car Details</TableCaption>
                                    <Thead>
                                        <Tr>
                                            <Th color='white' fontSize='lg'>Property</Th>
                                            <Th color='white' fontSize='l'>Value</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {cardDescriptionData.map((card, index) => (
                                            <React.Fragment key={index}>
                                                <Tr><Td>Id</Td><Td>{card.CarID.value}</Td></Tr>
                                                <Tr><Td>Car Price</Td><Td><a href={card.currency.value} className='text-[#9EC8B9]'> $ </a> <span> {card.price.value} </span></Td></Tr>
                                                <Tr><Td>Total Cylinders</Td><Td>{card.Cylinders.value}</Td></Tr>
                                                <Tr>
                                                    <Td>Total Doors</Td>
                                                    <Td>{card.Doors.value}</Td>
                                                </Tr>
                                                <Tr>
                                                    <Td>Engine Volume</Td>
                                                    <Td>{card.engineVolumeAmount.value} <a href={card.engineUnit.value} className='text-[#9EC8B9]'> Litre</a> 
                                                    {card.isEngineTurbo.value? <span> Turbo </span>: null }</Td>
                                                </Tr>
                                                <Tr><Td>Leather Interior?</Td><Td>{card.isLeatherInterior.value}</Td></Tr>
                                                {card.levyAmount?.value && <Tr><Td>Levy</Td><Td> <a href={card.levyCurrency.value} className='text-[#9EC8B9]'> $ </a> {card.levyAmount?.value}</Td></Tr>}
                                                <Tr><Td>Total Mileage</Td><Td>{card.mileageAmount.value} <a href={card.mileageUnit.value} className='text-[#9EC8B9]'> KM </a></Td></Tr>
                                                <Tr><Td>Production Year</Td><Td>{card.prodYear.value}</Td></Tr>
                                                <Tr><Td>Total Airbags</Td><Td>{card.airbagsAmount.value}</Td></Tr>
                                                <Tr><Td>Car Color</Td><Td>{extractIdFromUrl(card.color.value)}</Td></Tr>
                                                <Tr><Td>Drive Systems</Td><Td>{extractIdFromUrl(card.driveWheels.value)}</Td></Tr>
                                                <Tr><Td>Fuel Type</Td><Td>{extractIdFromUrl(card.fuelType.value)}</Td></Tr>
                                                <Tr><Td>Gearbox Type</Td><Td>{extractIdFromUrl(card.gearBoxType.value)}</Td></Tr>
                                                <Tr><Td>Car Category</Td><Td>{extractIdFromUrl(card.carCategory.value)}</Td></Tr>
                                                <Tr><Td>Car Manufacturer</Td><Td><a href={card.carManufacturer.value} className='text-[#9EC8B9]'>{card.manufacturerLabel.value}</a></Td></Tr>
                                                <Tr><Td>Car Model</Td><Td>{extractIdFromUrl(card.carModel.value)}</Td></Tr>
                                                <Tr><Td>Steering Wheel</Td><Td>{extractIdFromUrl(card.wheel.value)}</Td></Tr>
                                            </React.Fragment>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>
            )}
    </div>
    )
    }

export default Landingpage


            {/* {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-[40] text-white bg-black bg-opacity-60">
                    <div className="relative w-[90%] h-[80%] md:w-[800px] md:h-[700px] p-4 rounded-lg bg-gray-800">
                        <CloseIcon onClick={closeModal} className="absolute top-4 right-4" style={{ fontSize: '1rem', color: '#FFF', cursor: 'pointer' }}/>
                        <h2 className='text-2xl text-center pt-1'>Description</h2>
                        <div className='overflow-y-auto h-full'>
                                {cardDescriptionData.map((card, index) => (
                                    <div key={index} className='p-4 border-b border-gray-600'>
                                        <h3 className='text-lg font-bold'> Id: {card.CarID.value}</h3>
                                        <p className='text-lg'>Car Pirce: {card.price.value}</p>
                                        <p className='text-lg'>Car value: {extractIdFromUrl(card.currency.value)}</p>
                                        <p className='text-lg'>Total Cylinders: {card.Cylinders.value}</p>
                                        <p className='text-lg'>Total Doors: {card.Doors.value}</p>
                                        <p className='text-lg'>Engine Volume{card.engineVolumeAmount.value}</p>
                                        <p className='text-lg'>Used Turbo ? {card.isEngineTurbo.value}</p>
                                        <p className='text-lg'>Engine Unit {extractIdFromUrl(card.engineUnit.value)}</p>
                                        <p className='text-lg'>Using Leather Interior ? {card.isLeatherInterior.value}</p>
                                        {card.levyAmount?.value && <p>Levy Amount: {card.levyAmount.value}</p>}
                                        {card.levyCurrency?.value && <p>Levy Currency: {card.levyCurrency.value}</p>}
                                        <p className='text-lg'>Total Milage: {extractIdFromUrl(card.mileageAmount.value)}</p>
                                        <p className='text-lg'>Milage Unit: {extractIdFromUrl(card.mileageUnit.value)}</p>
                                        <p className='text-lg'>Production Year: {card.prodYear.value}</p>
                                        <p className='text-lg'>Total Airbags: {card.airbagsAmount.value}</p>
                                        <p className='text-lg'>Car Color: {extractIdFromUrl(card.color.value)}</p>
                                        <p className='text-lg'>{extractIdFromUrl(card.driveWheels.value)}</p>
                                        <p className='text-lg'>Fuel Type: {extractIdFromUrl(card.fuelType.value)}</p>
                                        <p className='text-lg'>Gearbox Type: {extractIdFromUrl(card.gearBoxType.value)}</p>
                                        <p className='text-lg'>Car Category: {extractIdFromUrl(card.carCategory.value)}</p>
                                        <p className='text-lg'>Car Manufacturer: {extractIdFromUrl(card.carManufacturer.value)}</p>
                                        <p className='text-lg'>Car Model: {extractIdFromUrl(card.carModel.value)}</p>
                                        <p className='text-lg'>{extractIdFromUrl(card.wheel.value)}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )} */}