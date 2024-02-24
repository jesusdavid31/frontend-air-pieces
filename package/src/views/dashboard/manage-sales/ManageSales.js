/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Grid, Box, Card, CardContent, Typography, IconButton, OutlinedInput, Button, InputAdornment, MenuItem, TextField } from '@mui/material';
import FeatherIcon from 'feather-icons-react';

import { fetchConToken } from '../../../helpers/fetch';
// import { sweetalert } from '../../../utils/sweetalert';
// import detectChanges from '../../../utils/detectChanges';

import moment from 'moment';
import Swal from 'sweetalert2';

import Breadcrumb from '../../../layouts/FullLayout/Breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';
import DynamicTable from '../../../components/dynamic-table/DynamicTable';
import CustomSelect from '../../../components/FormElements/custom-elements/CustomSelect';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// import 'moment/locale/es';

const columns = [
  { id: "name", label: "Name" },
  { id: "saleDate", label: "Sale Date" },
  { id: "price", label: "Price" },
  { id: "quantity", label: "Quantity" },
  { id: "marketplace", label: "Mark-up%" },
  { id: "options", label: "Actions" },
];

const ManageSales = () => {

  const { token } = useSelector( state => state.auth) || {};

  const [charging, setCharging] = useState(true);
  const [sales, setSales] = useState([]);
  const [tempSales, setTempSales] = useState([]);
  // const [saleId, setSaleId] = useState('');

  const [actualPage, setActualPage] = useState(1);
  const [tempCurrentPage, setTempCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [tempTotal, setTempTotal] = useState(0);
  // const [copyOfTheForm, setCopyOfTheForm] = useState({});

  // Estados de filtros o busquedas
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [invalidSearchTerm, setInvalidSearchTerm] = useState(false);

  const formatPrice = (value = 0) => {
    const data = value.toFixed(2);
    let partsNumber = data.split('.');
    partsNumber[0] = partsNumber[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return partsNumber.join('.');
  }

  const mapSalesRecords = (data) => {
    const result = data.map((item) => ({
      ...item,
      saleDate: moment(item.saleDate).format('LLL'),
      price: `USD $ ${formatPrice(item.price)}`,
      options: (
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <IconButton>
            <FeatherIcon
              icon="edit"
              width="18"
              height="18"
              sx={{
                color: (theme) => theme.palette.grey.A200,
              }} 
            />
          </IconButton>
        </Box>
      ),
    }));
    setSales(result);
  }

  const getSales = async( page = 1 ) => {

    try {

      setCharging(true);
      const resp = await fetchConToken( `sale?page=${page}`, token );

      if( resp?.success ){
        setTempSales(resp.data?.products);
        mapSalesRecords(resp.data?.products);
        setTotal(resp.data?.dataCount);
        setTempTotal(resp.data?.dataCount);
        setPageCount(Math.ceil(resp.data?.dataCount / 20));
      }

      setCharging(false);
      
    } catch (error) {
      Swal.fire('Error', 'Error al cargar datos, por favor intente nuevamente.', 'error' );
    }

  }

  useEffect(() => {
    Swal.close();
    getSales(actualPage);
  }, []);

  const handlePageClick = (event, value) => {
    setActualPage(value);
    if(searchTerm.length > 0){
      searchByPage(searchTerm, value);
    }else{
      setTempCurrentPage(value);
      getSales(value);
    }
  };

  const clearSearch = () => {
    setSearching(false);
    setSearchTerm('');
    setTotal(tempTotal);
    setActualPage(tempCurrentPage);
    setPageCount(Math.ceil(tempTotal / 20));
    setInvalidSearchTerm(false);
    mapSalesRecords(tempSales);
  }

  const search = async(value = '') => {

    setSearchTerm(value);

    if( searchFilter.length === 0 ){
      Swal.fire('Error', 'To search, you must select a search filter', 'error' );
      return;
    }

    if ( value.length === 0 ) {
      clearSearch();
      return;
    }

    if ( value.length < 5 ) {
      setInvalidSearchTerm(true);
      return;
    }

    setInvalidSearchTerm(false);
    setCharging(true);
    const resp = await fetchConToken( `sale?${searchFilter}=${ value }&page=${ actualPage }`, token );

    if( resp?.success && resp?.data ){
      setActualPage(1);
      mapSalesRecords(resp?.data.products);
      setPageCount(Math.ceil(resp?.data.dataCount / 20));
      setTotal(resp?.data.dataCount);
    }else{
      mapSalesRecords([]);
      setTotal(0);
    }

    setCharging(false);

  };

  const searchByPage = async(term, getFrom) => {

    setCharging(true);
    const resp = await fetchConToken( `sale?${searchFilter}=${ term }&page=${ getFrom }`, token );
    
    if( resp?.success && resp?.data ){
      mapSalesRecords(resp?.data.products);
      setPageCount(Math.ceil(resp?.data.dataCount / 20));
      setTotal(resp?.data.dataCount);
    }

    setCharging(false);
      
  };

  return (
    <PageContainer title="Manage Products" description="Manage Products">
      {/* breadcrumb */}
      <Breadcrumb title="Manage Products" />
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

          <Grid item xs={12} sm={12} lg={12}>
            
            <Box sx={{ display: 'flex', marginTop: '10px', marginBottom: '30px', width: '100%', gap: '10px' }}>

              <Box sx={{ width: '20%' }}>
                <CustomSelect
                  labelId="is_active"
                  id="is-active-select"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  size="small"
                  fullWidth
                >
                  <MenuItem value='' disabled>Select an option</MenuItem>
                  <MenuItem value='name'>Search by name</MenuItem>
                  <MenuItem value='nsn'>Search by nsn</MenuItem>
                  <MenuItem value='partNumber'>Search by part number</MenuItem>
                  <MenuItem value='itemNumber'>Search by item number</MenuItem>
                </CustomSelect>
              </Box>

              <Box sx={{ width: '60%' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DateTimePicker
                                  renderInput={(props) => <TextField {...props} />}
                                  label="Cierre del examen"
                                  // value={selectedDate}
                                  // onChange={ (newValue) => handleClosingDateAndTime(newValue) }
                              />
                          </LocalizationProvider>
                <OutlinedInput
                  startAdornment={
                      <InputAdornment position="start">
                          <FeatherIcon icon="search" width="20" />
                      </InputAdornment>
                  }
                  id="search-text" 
                  value={searchTerm}
                  placeholder="Enter a search term"
                  onChange={e => search(e.target.value)}
                  fullWidth
                  size="small"
                />
                { invalidSearchTerm && <span className='invalid-field'>To be able to perform a search you must type at least 5 characters</span> }
              </Box>

              <Box sx={{ width: '20%' }}>
                <Button
                    onClick={() => clearSearch()}
                    sx={{
                        width: '100%',
                        bgcolor: '#E32C6D',
                        color: '#ffffff',
                        height: '40px',
                        '&:hover': {
                          backgroundColor: '#c1064a',
                          color: 'white'
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FeatherIcon icon="x-circle" width="15" />
                        <span style={{ marginLeft: '5px' }}>Clear search</span>
                    </Box>
                </Button>
              </Box>

            </Box>

          </Grid>

          <Grid item xs={12} sm={12} lg={12}>

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

                  <DynamicTable
                    columns={columns}
                    currentData={sales}
                    isLoading={charging}
                    actualPage={actualPage}
                    handlePageClick={handlePageClick}
                    totalPages={pageCount}
                  />

                </Box>

              </CardContent>
              
            </Card>

          </Grid>

        </Grid>

      </Box>
      
    </PageContainer>
  )
}

export default ManageSales;