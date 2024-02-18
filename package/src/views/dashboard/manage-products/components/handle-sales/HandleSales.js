/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

import { Grid, Button } from '@mui/material';

import CustomFormLabel from '../../../../../components/FormElements/custom-elements/CustomFormLabel';
import CustomTextField from '../../../../../components/FormElements/custom-elements/CustomTextField';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

import { fetchConToken } from '../../../../../helpers/fetch';
import { sweetalert } from '../../../../../utils/sweetalert';

const HandleSales = ( { token, productId, getProducts, handleModalClose } ) => {

    const { handleSubmit, values, errors, getFieldProps, touched, setFieldValue } = useFormik({
        initialValues: {
            productId: '', 
            quantity: 0,
        },
        onSubmit: async() => {
            try {

                handleModalClose();
                sweetalert('Saving', 'Please wait a moment...');
          
                const resp = await fetchConToken( `sale`, token, values, 'POST' );
          
                if(resp?.success){
                    getProducts();
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

    useEffect(() => {
        setFieldValue('productId', productId);
    }, []);

    return (
        <>
            <form onSubmit={ handleSubmit } className='dynamic-form'>

                <Grid container spacing={4}>

                    <Grid item xs={12}>
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

                    <Grid item xs={12} lg={12} md={12}>
                        <Button
                            color="success"
                            variant="contained"
                            size="large"
                            type="submit"
                            fullWidth
                        >
                            Save
                        </Button>
                    </Grid>

                </Grid>
            </form>
        </>
    )
}

export default HandleSales;