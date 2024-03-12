/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

import { Grid, 
    Box, 
    Typography, Button, FormControl, InputAdornment, OutlinedInput, FormGroup,
    FormControlLabel, Stack 
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';

import { onLogin, onRememberMe } from "../../../redux/slices/AuthSlice";
import { useNavigate } from 'react-router-dom';
import './login.css';

import CustomFormLabel from '../../../components/FormElements/custom-elements/CustomFormLabel';
import PageContainer from '../../../components/container/PageContainer';
import CustomCheckbox from "../../../components/FormElements/custom-elements/CustomCheckbox";

import { sweetalert } from '../../../utils/sweetalert';
import { fetchSinToken } from '../../../helpers/fetch';
// import img1 from '../../../assets/images/backgrounds/kyle-glenn-4SfHeE5MpFk-unsplash.jpg';

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { emailSaved, password, rememberMe } = useSelector( state => state.auth ) || {};

    const [rememberMeLogin, setRememberMeLogin] = useState(false);

    useEffect(() => {
        handleRememberMeValidation();
    }, []);

    const { handleSubmit, values, errors, getFieldProps, touched, setFieldValue } = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: async () => {
    
            handleRememberMe(rememberMe);
            sweetalert('Charging', 'Please wait a moment...');

            const resp = await fetchSinToken( 'user-login', values, 'POST' );

            if( resp?.success ) {
                dispatch(onLogin(resp));
                navigate('/dashboard/manage-products');
            }else{
                Swal.fire('Error', 'Incorrect email or password', 'error');
            }

        },
        validationSchema: Yup.object({
            email: Yup.string()
            .min(8, 'This field must be a minimum of 8 characters')
            .max(50, 'This field must have a maximum of 50 characters')
            .required('This field is required'),
            password: Yup.string()
            .max(64, 'This field must have a maximum of 64 characters')
            .required('This field is required')
        })
    });

    const handleRememberMe = (value) => {
        setRememberMeLogin(value);
        dispatch(onRememberMe({ rememberMe: value, email: values.email, password: values.password }));
    }

    const handleRememberMeValidation = () => {

        if( rememberMe ) {
            setRememberMeLogin(true);
        }

        if(emailSaved && password){
            setFieldValue('email', emailSaved);
            setFieldValue('password', password);
        }
        
    }

  return (
    <PageContainer title="Login" description="this is Login page" display="flex" >
        <Grid className='login-container' display="flex" alignItems="center" container spacing={0} 
            sx={{ 
                height: 'auto', 
                justifyContent: 'center',
                minHeight: '100vh',
                maxHeight: 'auto'
            }}
        >
            <Grid item xs={10} sm={8} md={7} lg={4} style={{ background: '#ffffff' }}
              sx={{
                  height: 'auto',
                  margin: '0 auto',
                  borderRadius: '15px',
                  marginTop: '20px',
                  marginBottom: '20px'
              }}
            >
                <Grid container spacing={0} display="flex" justifyContent="center">
                    <Grid item xs={12} lg={12} xl={12} md={12} padding={3}>
                        <Box
                        sx={{
                            p: 4
                        }}
                        >
                            <Box display="flex" justifyContent="center">
                                {/* <img
                                    src={img1}
                                    width='200'
                                    height={50}
                                    alt="logo"
                                /> */}
                            </Box>
                            <Typography fontWeight="700" variant="h2" color="#0e86d4" mt={3}>
                                Welcome to SFONE
                            </Typography>
                            <Typography fontWeight="400" variant="h5" color="black">
                                Please sign in to continue.
                            </Typography>
                        <Box
                            sx={{
                                mt: 1,
                                color: '#242424'
                            }} 
                        >
                            <form onSubmit={ handleSubmit }>
                                <FormControl fullWidth>
                                    <CustomFormLabel htmlFor="mail-text">Email</CustomFormLabel>
                                    <OutlinedInput
                                        type='email'
                                        startAdornment={
                                        <InputAdornment position="start">
                                            <FeatherIcon icon="mail" width="20" />
                                        </InputAdornment>
                                        }
                                        id="mail-text"
                                        placeholder="Enter your email"
                                        fullWidth
                                        size="small"
                                        {...getFieldProps('email')}
                                        error={touched.email && Boolean(errors.email)}
                                    />
                                    { (touched.email && errors.email) && <span className='invalid-field'>{errors.email}</span> }
                                </FormControl>

                                <FormControl fullWidth>
                                    <CustomFormLabel htmlFor="pwd-text">Password</CustomFormLabel>
                                    <OutlinedInput
                                        type="password"
                                        startAdornment={
                                        <InputAdornment position="start">
                                            <FeatherIcon icon="lock" width="20" />
                                        </InputAdornment>
                                        }
                                        id="pwd-text"
                                        placeholder="Enter your password"
                                        fullWidth
                                        size="small"
                                        {...getFieldProps('password')}
                                        error={touched.password && Boolean(errors.password)}
                                    />
                                    { (touched.password && errors.password) && <span className='invalid-field'>{errors.password}</span> }
                                </FormControl>

                                <Stack
                                    justifyContent="space-between"
                                    direction="row"
                                    alignItems="center"
                                    my={0}
                                >
                                    <FormGroup>
                                        <FormControlLabel
                                            control={<CustomCheckbox 
                                                checked={rememberMeLogin} 
                                            />}
                                            label="Remember me"
                                            onClick={e => handleRememberMe(e.target.checked)}
                                        />
                                    </FormGroup>
                                    {/* <p className='text-right'><Link to="/" className="link_to_create_account"> ¿Olvidaste tu contraseña?</Link></p> */}
                                </Stack>

                                <Button
                                    color="primary"
                                    variant="contained"
                                    size="large"
                                    type="submit"
                                    fullWidth
                                    sx={{
                                        pt: '10px',
                                        pb: '10px',
                                        marginTop: '30px'
                                    }}
                                >
                                  Log in
                                </Button>

                            </form>
                        </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </PageContainer>
  );
};

export default Login;
