/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';

import { Grid, Box, Card, CardContent, Typography, Fab, IconButton, OutlinedInput, Button, InputAdornment } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useSelector } from 'react-redux';
import FeatherIcon from 'feather-icons-react';

import moment from 'moment';
import Swal from 'sweetalert2';

import Modal from '../../../components/modal/Modal';
import SimpleDialog from '../../../components/modal/SimpleDialog';
import Breadcrumb from '../../../layouts/FullLayout/Breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';
import ProductForm from './components/product-form/ProductForm';

import { fetchConToken } from '../../../helpers/fetch';
import { sweetalert } from '../../../utils/sweetalert';
import detectChanges from '../../../utils/detectChanges';

import 'moment/locale/es';
import DynamicTable from '../../../components/dynamic-table/DynamicTable';

import './manage-products.css';

moment.locale('es');

const columns = [
  { id: "img", label: "Product Image" },
  { id: "name", label: "Name" },
  { id: "price", label: "Price" },
  { id: "stock", label: "Stock" },
  { id: "marketplace", label: "Marketplace" },
  { id: "nsn", label: "Nsn" },
  { id: "partNumber", label: "Part Number" },
  { id: "itemNumber", label: "Item Number" },
  { id: "options", label: "Actions" },
];

const ManageProducts = () => {

  const { token } = useSelector( state => state.auth) || {};

  // dialog
  const [open, setOpen] = React.useState(false);
  const [simpleDialogTextColor, setSimpleDialogTextColor] = React.useState('error');

  const [charging, setCharging] = useState(true);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');

  const [actualPage, setActualPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [tempTotal, setTempTotal] = useState(0);
  const [copyOfTheForm, setCopyOfTheForm] = useState({});

  const [createData, setCreateData] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [actionText, setActionText] = useState('Crear afirmación');

  const [modalIcon, setModalIcon] = React.useState('plus-circle');
  const [openModal, setOpenModal] = React.useState(false);

  // Menu de acciones de filtrado
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterStatus, setFilterStatus] = useState(true);
  const openMenu = Boolean(anchorEl);
  const withoutImage = 'https://res.cloudinary.com/dsteu2frb/image/upload/v1706025798/samples/ecommerce/engine-153649_1280_nmko40.webp';

  // Estados de filtros o busquedas
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [invalidSearchTerm, setInvalidSearchTerm] = useState(false);
  const searchField = useState('');

  const mapProducts = (data) => {
    const result = data.map((item) => ({
      ...item,
      img: ( <img src={item?.img ? item?.img : withoutImage} alt="img" width={100} height={100} className='product-image' /> ),
      options: (
        <IconButton onClick={() => handleModalOpen( 'update', item )}>
          <FeatherIcon
            icon="edit"
            width="18"
            height="18"
            sx={{
              color: (theme) => theme.palette.grey.A200,
            }} 
          />
        </IconButton>
      ),
    }));
    setProducts(result);
  }

  const getProducts = async( page = 1 ) => {

    try {

      setCharging(true);
      const resp = await fetchConToken( `product?page=${page}`, token );

      if( resp?.success ){
        mapProducts(resp.data?.products);
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
    getProducts(actualPage);
  }, []);

  const { handleSubmit, values, errors, getFieldProps, touched, setValues, setFieldValue, resetForm } = useFormik({
    initialValues: {
      name: '',
      price: 0,
      stock: 0,
      marketplace: 0,
      nsn: '',
      partNumber: '',
      itemNumber: '',
      // is_active: true
    },
    onSubmit: async() => {
      if(createData){
        saveProduct();
      }else{
        updateProduct();
      }
    },
    validationSchema: Yup.object({
      name: Yup.string()
      .required('This field is required')
      .min(3, 'This field must be a minimum of 3 characters')
      .max(60, 'This field must have a maximum of 60 characters'),
      price: Yup.number()
      .required('This field is required')
      .min(1, 'This field must have a minimum value of 1')
      .max(100000, 'This field must have a maximum value of 1,000,000'),
      stock: Yup.number()
      .required('This field is required')
      .min(1, 'This field must have a minimum value of 1')
      .max(100000, 'This field must have a maximum value of 1,000,000'),
      marketplace: Yup.number()
      .required('This field is required')
      .min(1, 'This field must have a minimum value of 1')
      .max(100000, 'This field must have a maximum value of 1,000,000'),
      nsn: Yup.string()
      .required('This field is required')
      .min(9, 'This field must be a minimum of 9 characters')
      .max(13, 'This field must have a maximum of 13 characters'),
      partNumber: Yup.string()
      .required('This field is required')
      .min(20, 'This field must be a minimum of 20 characters')
      .max(64, 'This field must have a maximum of 64 characters'),
      itemNumber: Yup.string()
      .required('This field is required')
      .min(20, 'This field must be a minimum of 20 characters')
      .max(20, 'This field must have a maximum of 20 characters'),
      // is_active: Yup.boolean()
    })
  });

  const saveProduct = async() => {
    try {

      handleModalClose();
      sweetalert('Saving', 'Please wait a moment...');

      // const { is_active, ...fields } = values;

      const resp = await fetchConToken( `product`, token, values, 'POST' );

      if(resp?.success){
        getProducts(actualPage);
        Swal.fire('Data saved successfully', 'Successfully created product', 'success' );
      }

    } catch (error) {
      Swal.fire('Error', 'An error has occurred', 'error' );
    }
  };

  const updateProduct = async() => {
    try {

      const fields = detectChanges(copyOfTheForm, values);
      let resp = null;

      if( Object.entries(fields).length > 0 ){
        handleModalClose();
        sweetalert('Updating', 'Please wait a moment...');
        resp = await fetchConToken( `product/${ productId }`, token, fields, 'PUT' );
      }else{
        setOpen(true);
      }

      if(resp?.success){
        getProducts(actualPage);
        Swal.fire('Data updated successfully.', resp.message, 'success' );
      }

    } catch (error) {
      Swal.fire('Error', 'An error has occurred', 'error' );
    }
  };

  const handleModalOpen = (modal, data = {}) => {
    switch (modal) {
      case "create":
        setActionText('Create product');
        setCreateData(true);
        setOpenModal(true);
        break;

      case "update":
        if(data){

          const { _id, ...fields } = data;
          setCopyOfTheForm(fields);
          setProductId(_id);
          setValues(fields);
          setModalIcon('edit');
          setActionText('Update product');
          setUpdateData(true);
          setOpenModal(true);
          
        }
        break;

        default:
          Swal.fire('Error', 'Error opening modal', 'error' );
    }
  };

  const handleModalClose = () => {
    setModalIcon('plus-circle');
    resetForm();
    setOpenModal(false);
    setCreateData(false);
    setUpdateData(false);
  };

  const handlePageClick = (event, value) => {
    setActualPage(value);
    getProducts(value);
  };

  const handleCloseSimpleDialog = () => {
    setOpen(false);
  };

  const handleOptionsMenuState = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosedOptionsMenu = () => {
    setAnchorEl(null);
  };

  const handleFilterByState = ( value ) => {
    setAnchorEl(null);
    setFilterStatus(value);
    setActualPage(1);
    getProducts(1);
  };

  const clearSearch = () => {
    setSearching(false);
    setSearchTerm('');
    setTotal(tempTotal);
    // setActualPage(tempCurrentPage);
    setPageCount(Math.ceil(tempTotal / 20));
    setInvalidSearchTerm(false);
    // setEvidences(tempEvidences);
    mapProducts(products);
  }

  const search = async(value = '') => {

    setSearchTerm(value);

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
    const resp = await fetchConToken( `evidence?page=${ actualPage }&description=${ value }&is_active=true`, token );

    if( resp?.ok ){
      setActualPage(1);
      mapProducts(resp?.data);
      setPageCount(Math.ceil(resp?.dataNumber / 20));
      setTotal(resp?.dataNumber);
    }

    setCharging(false);

  };

  const searchByPage = async(term, getFrom) => {

    setCharging(true);
    const resp = await fetchConToken( `evidence?page=${ getFrom }&description=${ term }&is_active=true`, token );
    
    if( resp?.ok ){
      mapProducts(resp?.data);
      setPageCount(Math.ceil(resp?.dataNumber / 20));
      setTotal(resp?.dataNumber);
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
                        <span style={{ marginLeft: '5px' }}>Limpiar búsqueda</span>
                    </Box>
                </Button>
              </Box>

              <Box sx={{ width: '60%' }}>
                <OutlinedInput
                  startAdornment={
                      <InputAdornment position="start">
                          <FeatherIcon icon="search" width="20" />
                      </InputAdornment>
                  }
                  id="search-text" 
                  value={searchTerm}
                  placeholder="Introduzca el término de búsqueda"
                  onChange={e => search(e.target.value)}
                  fullWidth
                  size="small"
                />
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
                        <span style={{ marginLeft: '5px' }}>Limpiar búsqueda</span>
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

                    { !charging && 

                      <Grid item xs={12} md={8} lg={8}>

                        <Box
                          sx={{
                          padding: '0px 0px',
                          }}
                          display="flex"
                          alignItems="center"
                          justifyContent="right"
                        >

                          <Fab
                            variant="extended"
                            aria-label="primary-send" 
                            type="button" 
                            className='manually-add-questions-button'
                            sx={{
                              mt: 2,
                              mr: 1,
                              mb: 2,
                              backgroundColor: '#FFCB59',
                              color: '#ffffff',
                              '&:hover': {
                                  backgroundColor: '#FFCB59',
                                  color: '#2600FF'
                              }
                            }}
                            onClick={() => handleModalOpen( 'create' )}
                          >
                              <FeatherIcon icon="plus" width="20" />
                              <Typography
                                  sx={{
                                      ml: 1,
                                      textAlign: "right"
                                  }}
                              >
                                Publish product
                              </Typography>
                          </Fab>
                        </Box>

                      </Grid>

                    }

                  </Grid>

                  <DynamicTable
                    columns={columns}
                    currentData={products}
                    isLoading={charging}
                    actualPage={actualPage}
                    handlePageClick={handlePageClick}
                    totalPages={pageCount}
                  />

                </Box>

                <Modal 
                  openModal={openModal}
                  handleModalClose={handleModalClose}
                  iconName={modalIcon}
                  title={ actionText }
                >
                  <ProductForm
                    values={values}
                    errors={errors}
                    getFieldProps={getFieldProps} 
                    setFieldValue={setFieldValue}
                    touched={touched}
                    saveForm={handleSubmit}
                    updateData={updateData}
                  />
                </Modal>

                <SimpleDialog text='Error, you must change at least one field of the form to be able to update.' open={open} onClose={handleCloseSimpleDialog} color={simpleDialogTextColor} />

              </CardContent>
              
            </Card>

          </Grid>

        </Grid>

      </Box>
      
    </PageContainer>
  )
};

export default ManageProducts;
