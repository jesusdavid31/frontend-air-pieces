/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { useState } from 'react';

import { Grid, Fab, Typography } from '@mui/material';
import FeatherIcon from 'feather-icons-react';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

import { fetchConToken } from '../../../../helpers/fetch';
import { sweetalert } from '../../../../utils/sweetalert';

import CustomFormLabel from '../../../../components/FormElements/custom-elements/CustomFormLabel';
import CustomTextField from '../../../../components/FormElements/custom-elements/CustomTextField';

const SalesForm = ( { token, saleId, getSales, handleModalClose } ) => {

    const { handleSubmit, values, errors, getFieldProps, touched } = useFormik({
        initialValues: {
            productId: '', 
            quantity: 0,
        },
        onSubmit: async() => {
            try {

                handleModalClose();
                sweetalert('Updating', 'Please wait a moment...');
          
                const resp = await fetchConToken( `sale/${saleId}`, token, values, 'PUT' );
          
                if(resp?.success){
                    getSales();
                    Swal.fire('Data saved successfully', 'Sale registered correctly', 'success' );
                }
          
            } catch (error) {
                 Swal.fire('Error', 'An error has occurred', 'error' );
            }
        },
        validationSchema: Yup.object({
            productId: Yup.string()
            .required('This field is required')
            .min(3, 'This field must be a minimum of 3 characters')
            .max(60, 'This field must have a maximum of 60 characters'),
            quantity: Yup.number()
            .required('This field is required')
            .min(1, 'This field must have a minimum value of 1')
            .max(100000, 'This field must have a maximum value of 1,000,000')
        })
    });

    return (
        <>
            <form onSubmit={ handleSubmit } className='dynamic-form'>

                <Grid container spacing={4}>

                    <Grid item xs={12} lg={6} md={6}>
                        <CustomFormLabel htmlFor="quantity">Quantity</CustomFormLabel>
                        <CustomTextField 
                            id="quantity" 
                            variant="outlined" 
                            fullWidth
                            type='number'
                            {...getFieldProps('quantity')}
                            error={touched.quantity && Boolean(errors.quantity)}
                        />
                        { (touched.quantity && errors.quantity) && <span className='invalid-field'>{errors.quantity}</span> }
                    </Grid>

                    <Grid item xs={12} lg={6} md={6}>
                        <CustomFormLabel htmlFor="price">Price</CustomFormLabel>
                        <CustomTextField 
                            id="price" 
                            variant="outlined" 
                            fullWidth
                            type='number'
                            {...getFieldProps('price')}
                            error={touched.price && Boolean(errors.price)}
                        />
                        { (touched.price && errors.price) && <span className='invalid-field'>{errors.price}</span> }
                    </Grid>

                    <Grid item xs={12} lg={6} md={6}>
                        <CustomFormLabel htmlFor="marketplace">Market place</CustomFormLabel>
                        <CustomTextField 
                            id="marketplace" 
                            variant="outlined" 
                            fullWidth
                            type='number'
                            {...getFieldProps('marketplace')}
                            error={touched.marketplace && Boolean(errors.marketplace)}
                        />
                        { (touched.marketplace && errors.marketplace) && <span className='invalid-field'>{errors.marketplace}</span> }
                    </Grid>

                    <Grid item xs={12} lg={12} md={12}>
                        <Fab
                            variant="extended"
                            aria-label="primary-send" 
                            type="submit" 
                            sx={{
                                mr: 1,
                                mb: 2,
                                backgroundColor: '#00C292',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#0A7029',
                                    color: 'white'
                                }
                            }}
                        >
                            <FeatherIcon icon="edit" width="20" />
                            <Typography
                                sx={{
                                    ml: 1
                                }}
                            >
                                Update
                            </Typography>
                        </Fab>
                    </Grid>

                </Grid>
            </form>
        </>
    );

}

export default SalesForm;
