/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { 
    Grid, 
    Box, 
    Card, 
    CardContent, 
    Typography,  
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

import Swal from 'sweetalert2';

import Breadcrumb from '../../../layouts/FullLayout/Breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import moment from 'moment';

import noContentImg from '../../../assets/images/project/Search Engine_Two Color.svg';

import './reports.css';

const Reports = () => {

  const { token } = useSelector( state => state.auth) || {};

  const [charging, setCharging] = useState(false);
  const [reports, setReports] = useState([]);
  const [profits, setProfits] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [finishDate, setFinishDate] = useState(null);

  const formatPrice = (value = 0) => {
    const data = value.toFixed(2);
    let partsNumber = data.split('.');
    partsNumber[0] = partsNumber[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return partsNumber.join('.');
  }

  const getReports = async() => {

    try {

      if( !startDate || !finishDate ){
        Swal.fire('Error', 'To filter results by date you must select a value for each of the two date fields.', 'error' );
        return
      }

      setCharging(true);
      const resp = await fetchConToken( `sale-statistics?startDate=${moment(startDate).format('YYYY-MM-DD')}&finishDate=${moment(finishDate).format('YYYY-MM-DD')}`, token );

      if( resp?.success ){
        setReports(resp.data?.products ?? []);
        setProfits(resp.data?.totals ?? []);
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

  const generateTableCells = () => {
    return (
      <>
        <TableCell/>
        <TableCell/>
        <TableCell/>
        <TableCell/>
      </>
    );
  }

  return (
    <PageContainer title="Reports" description="Reports">
      {/* breadcrumb */}
      <Breadcrumb title="Reports" />
      {/* end breadcrumb */}

      <Box className='reports'>

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
                    overflow: 'auto'
                  }}
                >

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
                              <Typography variant="h4">Product Name</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h4">Sale Price</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h4">Quantity Sold</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h4">Total Sales</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h4">First Profit</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h4">Second Profit</Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {reports?.map((element) => (
                              <TableRow key={`report-${element.idProduct}`}>

                                <TableCell sx={{ minWidth: '170px', maxWidth: '180px' }}>
                                  <Typography color="textSecondary" variant="h6" fontWeight="400">
                                    {element.nameProduct}
                                  </Typography>
                                </TableCell>

                                <TableCell className='report-cell'>
                                  <Typography color="textSecondary" variant="h6" fontWeight="400">
                                    {`USD $ ${formatPrice(element.price)}`}
                                  </Typography>
                                </TableCell>

                                <TableCell className='report-cell'>
                                  <Typography color="textSecondary" variant="h6" fontWeight="400">
                                    {element.quantity}
                                  </Typography>
                                </TableCell>

                                <TableCell className='report-cell'>
                                  <Typography color="textSecondary" variant="h6" fontWeight="400">
                                    {`USD $ ${formatPrice(element.priceSale)}`}
                                  </Typography>
                                </TableCell>

                                <TableCell className='report-cell'>
                                  <Typography color="textSecondary" variant="h6" fontWeight="400">
                                    {`USD $ ${formatPrice(element.firstProfit)}`}
                                  </Typography>
                                </TableCell>

                                <TableCell className='report-cell'>
                                  <Typography color="textSecondary" variant="h6" fontWeight="400">
                                    {`USD $ ${formatPrice(element.secondProfit)}`}
                                  </Typography>
                                </TableCell>

                                <TableCell>
                                </TableCell>
                                
                              </TableRow>
                          ))}

                          { reports.length > 0 && 
                            <>
                              <TableRow>
                                {generateTableCells()}
                                <TableCell>
                                  <Typography color="textSecondary" variant="h3" fontWeight="500">
                                    Total Sales
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography color="textSecondary" variant="h4" fontWeight="400">
                                    {`USD $ ${formatPrice(profits.priceSale)}`}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                {generateTableCells()}
                                <TableCell>
                                  <Typography color="textSecondary" variant="h3" fontWeight="500">
                                    First Profit
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography color="textSecondary" variant="h4" fontWeight="400">
                                    {`USD $ ${formatPrice(profits.firstProfit)}`}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                {generateTableCells()}
                                <TableCell>
                                  <Typography color="textSecondary" variant="h3" fontWeight="500">
                                  Second Profit
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography color="textSecondary" variant="h4" fontWeight="400">
                                    {`USD $ ${formatPrice(profits.secondProfit)}`}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </>
                          }

                        </TableBody>
                    </Table>

                  )}

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