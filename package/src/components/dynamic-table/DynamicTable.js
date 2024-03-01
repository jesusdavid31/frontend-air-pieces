/* eslint-disable react/no-array-index-key */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Box, Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import noContentImg from '../../assets/images/project/Search Engine_Two Color.svg';

const DynamicTable = ({
    columns,
    currentData = [],
    isLoading = true,
    actualPage = 1,
    handlePageClick,
    totalPages,
}) => {

    return (
        <>

            {isLoading ? (
                <div className='center-loading'>
                    <svg viewBox="25 25 50 50" className='loading-data'>
                        <circle r="20" cy="50" cx="50" />
                    </svg>
                </div>
            ) : (

                <Box sx={{
                    overflow: 'auto'
                }} >

                    <Table
                        aria-label="simple table"
                        sx={{
                            whiteSpace: 'normal'   
                        }} 
                    >
                        
                        <TableHead className="table-thead">
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableCell key={`table-cell-${index}`} align="center">
                                        <Typography>{column.label}</Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
        
                        <TableBody>
                            {currentData?.map((row, index) => (
                                <TableRow key={`table-row-${index}`}>
                                    {columns?.map((column) => (
                                        <TableCell key={`data-table-cell-${column.id}`} align="center">
                                            <Typography variant="subtitle2">{row[column.id]}</Typography>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>

                </Box>
                
            )}

            { ( !isLoading && currentData.length === 0 ) && 
                <Grid item lg={12} md={12} sm={12} sx={{ textAlign: 'center' }} className='without-results'>
                    <img src={noContentImg} alt='No content' className='no-content' />
                    <p>No content</p>
                </Grid>
            }

            { ( !isLoading && currentData.length > 0 ) && 
                <Box 
                sx={{ mt: 3,  display: 'flex', justifyContent: 'flex-end' }}
                >
                    <Stack spacing={2} >
                        <Pagination count={totalPages} color="primary" page={actualPage} siblingCount={0} boundaryCount={2} onChange={handlePageClick}/>
                    </Stack>
                </Box>
            }

        </>
    );
};

export default DynamicTable;