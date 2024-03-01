/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { 
    Grid, 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    IconButton, 
    Button, 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';

import { fetchConToken } from '../../../helpers/fetch';
// import { sweetalert } from '../../../utils/sweetalert';

import moment from 'moment';
import Swal from 'sweetalert2';

import Breadcrumb from '../../../layouts/FullLayout/Breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import noContentImg from '../../../assets/images/project/Search Engine_Two Color.svg';

const Reports = () => {

  const { token } = useSelector( state => state.auth) || {};

  const [charging, setCharging] = useState(false);
  const [reports, setReports] = useState([]);
  // const [tempReports, setTempReports] = useState([]);

  const [total, setTotal] = useState(0);

  const [startDate, setStartDate] = useState(null);
  const [finishDate, setFinishDate] = useState(null);

  const formatPrice = (value = 0) => {
    const data = value.toFixed(2);
    let partsNumber = data.split('.');
    partsNumber[0] = partsNumber[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return partsNumber.join('.');
  }

  const getReports = async( page = 1, resetCurrentPage = false ) => {

    try {

      setCharging(true);
      const resp = await fetchConToken( `sale-statistics?startDate=${startDate}&finishDate=${finishDate}`, token );

      if( resp?.success && resp?.data ){
        setReports(resp.data?.products);
      }

      setCharging(false);
      
    } catch (error) {
      Swal.fire('Error', 'Error al cargar datos, por favor intente nuevamente.', 'error' );
    }

  }

  const clearDates = () => {
    setStartDate(null);
    setFinishDate(null);
  }

  return (
    <PageContainer title="Reports" description="Reports">
      {/* breadcrumb */}
      <Breadcrumb title="Reports" />
      {/* end breadcrumb */}

      <Box>

        <Grid
          container
          sx={{
            paddingLeft: '15px',
            paddingRight: '15px'
          }}
          spacing={0}
        >

          <Grid container spacing={2}>

            <Grid item xs={12} md={3} lg={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="Start date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue.$d)}
                    sx={{ width: '100%' }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={3} lg={3} sx={{ width: '100%' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="Finish date"
                    value={finishDate}
                    onChange={(newValue) => setFinishDate(newValue.$d)}
                    sx={{ width: '100%' }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={3} lg={3} sx={{ width: '100%', paddingTop: '24px !important' }}>
              <Button
                onClick={() => getReports()}
                sx={{
                  width: '100%',
                  bgcolor: '#0066ff',
                  color: '#ffffff',
                  height: '55px',
                  fontSize: '18px',
                  '&:hover': {
                    backgroundColor: '#0066ff',
                    color: '#ffffff'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FeatherIcon icon="search" width="18" />
                  <span style={{ marginLeft: '5px' }}>Search by date</span>
                </Box>
              </Button>
            </Grid>

            <Grid item xs={12} md={3} lg={3} sx={{ width: '100%', paddingTop: '24px !important' }}>
              <Button
                onClick={() => clearDates()}
                sx={{
                  width: '100%',
                  bgcolor: '#E32C6D',
                  color: '#ffffff',
                  height: '55px',
                  fontSize: '18px',
                  '&:hover': {
                    backgroundColor: '#c1064a',
                    color: 'white'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FeatherIcon icon="x-circle" width="18" />
                  <span style={{ marginLeft: '5px' }}>Clear dates</span>
                </Box>
              </Button>
            </Grid>

          </Grid>

          <Grid item xs={12} sm={12} lg={12} sx={{ marginTop: '30px' }}>

            <Card variant="outlined" sx={{ margin: '0px' }}>
              
              <CardContent>
                
                <Box
                  sx={{
                    overflow: {
                      xs: 'auto',
                      sm: 'unset',
                    },
                  }}
                >

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4} lg={4}>
                                
                            <Typography variant="h3" 
                                sx={{
                                mt: 2,
                                mb: 2,
                                color: '#0e86d4'
                                }}
                            >
                                Total items: {total}
                            </Typography>
                                
                        </Grid>
                    </Grid>

                    { charging ? (
                            <div className='center-loading'>
                                <svg viewBox="25 25 50 50" className='loading-data'>
                                    <circle r="20" cy="50" cx="50"></circle>
                                </svg>
                            </div>
                        ) : (
                    
                            <Table
                                aria-label="simple table"
                                sx={{
                                    whiteSpace: 'normal'
                                }} 
                            >
                                <TableHead>
                                  <TableRow>
                                    <TableCell>
                                      <Typography variant="h5">Product Name</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h5">Sale Price</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h5">Quantity Sold</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h5">Total Sales</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h5">First Profit</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h5">Second Profit</Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>

                                <TableBody>
                                    {reports?.map((element) => (
                                        <TableRow key={`report-${element._id}`}>

                                          <TableCell>
                                            <Typography color="textSecondary" variant="h6" fontWeight="400">
                                              {element.nameProduct}
                                            </Typography>
                                          </TableCell>

                                          <TableCell sx={{ minWidth: '150px' }}>
                                            <Typography color="textSecondary" variant="h6" fontWeight="400">
                                              {`USD $ ${formatPrice(element.price)}`}
                                            </Typography>
                                          </TableCell>

                                          <TableCell>
                                            <Typography color="textSecondary" variant="h6" fontWeight="400">
                                              {element.quantity}
                                            </Typography>
                                          </TableCell>

                                          <TableCell>
                                            <Typography color="textSecondary" variant="h6" fontWeight="400">
                                              {`USD $ ${formatPrice(element.priceSale)}`}
                                            </Typography>
                                          </TableCell>

                                          <TableCell>
                                            <Typography color="textSecondary" variant="h6" fontWeight="400">
                                              {`USD $ ${formatPrice(element.firstProfit)}`}
                                            </Typography>
                                          </TableCell>

                                          <TableCell>
                                            <Typography color="textSecondary" variant="h6" fontWeight="400">
                                              {`USD $ ${formatPrice(element.secondProfit)}`}
                                            </Typography>
                                          </TableCell>

                                          <TableCell>
                                          </TableCell>
                                          
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        )
                    }

                    { ( !charging && reports.length === 0 ) && 
                        <Grid item lg={12} md={12} sm={12} sx={{ textAlign: 'center' }} className='without-results'>
                            <img src={noContentImg} alt='No content' className='no-content' />
                            <p>No content</p>
                        </Grid>
                    }

                </Box>

              </CardContent>
              
            </Card>

          </Grid>

        </Grid>

      </Box>
      
    </PageContainer>
  )
}

export default Reports;