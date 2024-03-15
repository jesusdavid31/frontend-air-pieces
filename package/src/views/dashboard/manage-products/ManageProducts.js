/* eslint-disable react-hooks/exhaustive-deps */
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

import { Grid, Box, Card, CardContent, Typography, IconButton, OutlinedInput, Button, InputAdornment, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useSelector } from 'react-redux';
import FeatherIcon from 'feather-icons-react';
import Swal from 'sweetalert2';

import Modal from '../../../components/modal/Modal';
import SimpleDialog from '../../../components/modal/SimpleDialog';
import Breadcrumb from '../../../layouts/FullLayout/Breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';
import ProductForm from './components/product-form/ProductForm';
import HandleSales from './components/handle-sales/HandleSales';
import UploadExcelProducts from './components/upload-excel-products/UploadExcelProducts';

import { fetchConToken, fetchWithTokenAndFormData } from '../../../helpers/fetch';
import { sweetalert } from '../../../utils/sweetalert';
import detectChanges from '../../../utils/detectChanges';

import DynamicTable from '../../../components/dynamic-table/DynamicTable';
import CustomSelect from '../../../components/FormElements/custom-elements/CustomSelect';

import './manage-products.css';

const columns = [
  { id: "img", label: "Product Image" },
  { id: "name", label: "Name" },
  { id: "partNumber", label: "Part Number" },
  { id: "itemNumber", label: "Item Number" },
  { id: "nsn", label: "Nsn" },
  { id: "stock", label: "Stock" },
  { id: "price", label: "Price" },
  { id: "marketplace", label: "Mark-up%" },
  { id: "options", label: "Actions" },
];

const ManageProducts = () => {

  const { token } = useSelector( state => state.auth) || {};

  // dialog
  const [open, setOpen] = React.useState(false);
  // Fin dialog

  const [charging, setCharging] = useState(true);
  const [products, setProducts] = useState([]);
  const [tempProducts, setTempProducts] = useState([]);
  const [productId, setProductId] = useState('');

  const [actualPage, setActualPage] = useState(1);
  const [tempCurrentPage, setTempCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [tempTotal, setTempTotal] = useState(0);
  const [copyOfTheForm, setCopyOfTheForm] = useState({});

  const [createData, setCreateData] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [actionText, setActionText] = useState('');

  const [modalIcon, setModalIcon] = React.useState('plus-circle');
  const [openModal, setOpenModal] = React.useState(false);
  const [openSalesModal, setOpenSalesModal] = React.useState(false);
  const [openExcelModal, setOpenExcelModal] = React.useState(false);

  const withoutImage = 'https://res.cloudinary.com/dsteu2frb/image/upload/v1706025798/samples/ecommerce/engine-153649_1280_nmko40.webp';

  // Estados de filtros o busquedas
  // const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [invalidSearchTerm, setInvalidSearchTerm] = useState(false);

  // Product image
  const [imageFile, setImageFile] = useState(null);
  const [allowedImageExtension, setAllowedImageExtension] = useState(true);
  const [allowedImageSize, setAllowedImageSize] = useState(true);

  const formatPrice = (value = 0) => {
    const data = value.toFixed(2);
    let partsNumber = data.split('.');
    partsNumber[0] = partsNumber[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return partsNumber.join('.');
  }

  const mapProducts = (data) => {
    const result = data.map((item) => ({
      ...item,
      price: `USD $ ${formatPrice(item.price)}`,
      marketplace: `${item.marketplace}%`,
      img: ( <img src={item?.img ? item?.img?.url : withoutImage} alt="img" width={100} height={100} className='product-image' /> ),
      options: (
        <Box sx={{ display: 'flex', gap: '10px' }}>
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
          <IconButton onClick={() => handleOpenSalesModal( item._id )}>
            <FeatherIcon
              icon="dollar-sign"
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
    setProducts(result);
  }

  const getProducts = async( page = 1 ) => {

    try {

      setCharging(true);
      const resp = await fetchConToken( `product?page=${page}`, token );

      if( resp?.success && resp?.data ){
        setTempProducts(resp.data?.products);
        mapProducts(resp.data?.products);
        setTotal(resp.data?.dataCount);
        setTempTotal(resp.data?.dataCount);
        setPageCount(Math.ceil(resp.data?.dataCount / 20));
      }else{
        setTempProducts([]);
        mapProducts([]);
        setTotal(0);
        setTempTotal(0);
        setPageCount(0);
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

  const { handleSubmit, values, errors, getFieldProps, touched, setValues, resetForm } = useFormik({
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
      .max(1000000000, 'This field must have a maximum value of 1,000,000,000'),
      stock: Yup.number()
      .required('This field is required')
      .min(1, 'This field must have a minimum value of 1')
      .max(1000000000, 'This field must have a maximum value of 1,000,000,000'),
      marketplace: Yup.number()
      .required('This field is required')
      .min(1, 'This field must have a minimum value of 1')
      .max(300, 'This field must have a maximum value of 300'),
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
      .min(4, 'This field must be a minimum of 4 characters')
      .max(64, 'This field must have a maximum of 64 characters'),
      // is_active: Yup.boolean()
    })
  });

  const resetImage = () => {
    setAllowedImageExtension(true);
    setAllowedImageSize(true);
    setImageFile(null);
  }

  const saveProduct = async() => {
    try {

      if( !allowedImageExtension || !allowedImageSize ){
        return;
      }

      handleModalClose();
      sweetalert('Saving', 'Please wait a moment...');

      const formData = new FormData();
      Object.entries(values).forEach(element => {
        formData.append(element[0], element[1]);
      });

      if( imageFile ){
        formData.append('img', imageFile);
      }

      // const { is_active, ...fields } = values;

      const resp = await fetchWithTokenAndFormData( `product`, token, formData, 'POST' );

      resetImage();

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

      if( !allowedImageExtension || !allowedImageSize ){
        return;
      }

      const fields = detectChanges(copyOfTheForm, values);
      let resp = null;

      if( Object.entries(fields).length > 0 || imageFile ){

        handleModalClose();
        sweetalert('Updating', 'Please wait a moment...');

        const formData = new FormData();
        Object.entries(fields).forEach(element => {
          formData.append(element[0], element[1]);
        });
  
        if( imageFile ){
          formData.append('img', imageFile);
        }
        
        resp = await fetchWithTokenAndFormData( `product/${ productId }`, token, formData, 'PUT' );

        resetImage();
        
      }else{
        setOpen(true);
      }

      if(resp?.success){
        if(searchTerm.length > 0){
          searchByPage(searchTerm, actualPage);
        }else{
          setTempCurrentPage(actualPage);
          getProducts(actualPage);
        }
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

  const handleOpenSalesModal = ( productId ) => {
    setActionText('Register sale');
    setProductId(productId);
    setOpenSalesModal(true);
  };

  const handleClosedSalesModal = () => {
    setOpenSalesModal(false);
  };

  const handleOpenExcelModal = () => {
    setModalIcon('upload');
    setActionText('Upload excel file');
    setOpenExcelModal(true);
  };

  const handleExcelClosedModal = () => {
    setModalIcon('plus-circle');
    setOpenExcelModal(false);
  };

  const handlePageClick = (event, value) => {
    setActualPage(value);
    if(searchTerm.length > 0){
      searchByPage(searchTerm, value);
    }else{
      setTempCurrentPage(value);
      getProducts(value);
    }
  };

  const handleCloseSimpleDialog = () => {
    setOpen(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setTotal(tempTotal);
    setActualPage(tempCurrentPage);
    setPageCount(Math.ceil(tempTotal / 20));
    setInvalidSearchTerm(false);
    mapProducts(tempProducts);
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
    const resp = await fetchConToken( `product?${searchFilter}=${ value }&page=1`, token );

    if( resp?.success && resp?.data ){
      setActualPage(1);
      mapProducts(resp?.data.products);
      setPageCount(Math.ceil(resp?.data.dataCount / 20));
      setTotal(resp?.data.dataCount);
    }else{
      mapProducts([]);
      setTotal(0);
    }

    setCharging(false);

  };

  const searchByPage = async(term, getFrom) => {

    setCharging(true);
    const resp = await fetchConToken( `product?${searchFilter}=${ term }&page=${ getFrom }`, token );
    
    if( resp?.success && resp?.data ){
      mapProducts(resp?.data.products);
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
                <OutlinedInput
                  startAdornment={
                      <InputAdornment position="start">
                          <FeatherIcon icon="search" width="20" />
                      </InputAdornment>
                  }
                  id="search-text" 
                  value={searchTerm}
                  placeholder="Enter your search term"
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

                    { !charging && 

                      <Grid item xs={12} md={8} lg={8}>

                        <Box
                          sx={{
                            padding: '0px 0px',
                            gap: '10px'
                          }}
                          display="flex"
                          alignItems="center"
                          justifyContent="right"
                        >

                          <Button
                            onClick={() => handleOpenExcelModal()}
                            sx={{
                              bgcolor: '#00C292',
                              color: '#ffffff',
                              height: '40px',
                              '&:hover': {
                                backgroundColor: '#0A7029',
                                color: 'white'
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <FeatherIcon icon="upload" width="15" />
                              <span style={{ marginLeft: '5px' }}>Upload excel</span>
                            </Box>
                          </Button>

                          <Button
                            onClick={() => handleModalOpen( 'create' )}
                            sx={{
                              bgcolor: '#1A97F5',
                              color: '#ffffff',
                              height: '40px',
                              '&:hover': {
                                backgroundColor: '#077eda',
                                color: 'white'
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <FeatherIcon icon="plus" width="15" />
                              <span style={{ marginLeft: '5px' }}>Publish product</span>
                            </Box>
                          </Button>

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
                    errors={errors}
                    getFieldProps={getFieldProps} 
                    touched={touched}
                    saveForm={handleSubmit}
                    updateData={updateData}
                    allowedImageExtension={allowedImageExtension}
                    allowedImageSize={allowedImageSize}
                    setImageFile={setImageFile}
                    setAllowedImageExtension={setAllowedImageExtension}
                    setAllowedImageSize={setAllowedImageSize}
                  />
                </Modal>

                <Modal 
                  openModal={openSalesModal}
                  handleModalClose={handleClosedSalesModal}
                  iconName={modalIcon}
                  title={ actionText }
                >
                  <HandleSales
                    token={token}
                    productId={productId}
                    getProducts={() => getProducts(actualPage)}
                    handleModalClose={handleClosedSalesModal}
                  />
                </Modal>

                <Modal 
                  openModal={openExcelModal}
                  handleModalClose={handleExcelClosedModal}
                  iconName={modalIcon}
                  title={ actionText }
                >
                  <UploadExcelProducts handleExcelClosedModal={handleExcelClosedModal} token={token} getProducts={() => getProducts(actualPage)} />
                </Modal>

                <SimpleDialog text='Error, you must change at least one field of the form to be able to update.' 
                  open={open} onClose={handleCloseSimpleDialog} color={'error'} />

              </CardContent>
              
            </Card>

          </Grid>

        </Grid>

      </Box>
      
    </PageContainer>
  )
};

export default ManageProducts;
