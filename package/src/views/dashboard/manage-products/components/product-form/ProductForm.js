/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { useState } from 'react';

import { Grid, Fab, Typography } from '@mui/material';
import FeatherIcon from 'feather-icons-react';

import { validateImageSize, validateImageExtension } from '../../../../../utils/validateImages';

import CustomFormLabel from '../../../../../components/FormElements/custom-elements/CustomFormLabel';
import CustomTextField from '../../../../../components/FormElements/custom-elements/CustomTextField';
// import CustomSelect from '../../../../../components/FormElements/custom-elements/CustomSelect';

const ProductForm = ( { errors, getFieldProps, touched, saveForm, updateData } ) => {

    // Question image
    const [imageFile, setImageFile] = useState(null);
    const [allowedImageExtension, setAllowedImageExtension] = useState(true);
    const [allowedImageSize, setAllowedImageSize] = useState(true);
    const [tempImg, setTempImg] = useState(null);

    const handleImage = (e) => {

        // Validamos si no existe el archivo, es decir no se selecciono ningún archivo
        if ( !e.target.files[0] ) {
            // Se pone en true ya que se cancela la imagen seleccionada
            setAllowedImageExtension(true);
            setAllowedImageSize(true);
            setImageFile(null);
            setTempImg(null);
            return;
        }  

        setImageFile(e.target.files[0]);

        validateImageSize( e.target.files[0] ) ? setAllowedImageSize(false) : setAllowedImageSize(true);
        validateImageExtension( e.target.files[0] ) ? setAllowedImageExtension(false) : setAllowedImageExtension(true);

        const reader = new FileReader();
        reader.readAsDataURL( e.target.files[0] );
    
        reader.onloadend = () => {
          setTempImg(reader.result);
        }
    
    };

    return (
        <>
            <form onSubmit={ saveForm } className='dynamic-form'>

                <Grid container spacing={4}>

                    <Grid item xs={12} lg={6} md={6}>
                        <CustomFormLabel htmlFor="name">Name</CustomFormLabel>
                        <CustomTextField 
                            id="name" 
                            variant="outlined" 
                            fullWidth
                            type='text'
                            {...getFieldProps('name')}
                            error={touched.name && Boolean(errors.name)}
                        />
                        { (touched.name && errors.name) && <span className='invalid-field'>{errors.name}</span> }
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
                        <CustomFormLabel htmlFor="stock">Stock</CustomFormLabel>
                        <CustomTextField 
                            id="stock" 
                            variant="outlined" 
                            fullWidth
                            type='number'
                            {...getFieldProps('stock')}
                            error={touched.stock && Boolean(errors.stock)}
                        />
                        { (touched.stock && errors.stock) && <span className='invalid-field'>{errors.stock}</span> }
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

                    <Grid item xs={12} lg={6} md={6}>
                        <CustomFormLabel htmlFor="nsn">NSN</CustomFormLabel>
                        <CustomTextField 
                            id="nsn" 
                            variant="outlined" 
                            fullWidth
                            type='text'
                            {...getFieldProps('nsn')}
                            error={touched.nsn && Boolean(errors.nsn)}
                        />
                        { (touched.nsn && errors.nsn) && <span className='invalid-field'>{errors.nsn}</span> }
                    </Grid>

                    <Grid item xs={12} lg={6} md={6}>
                        <CustomFormLabel htmlFor="partNumber">Part number</CustomFormLabel>
                        <CustomTextField 
                            id="partNumber" 
                            variant="outlined" 
                            fullWidth
                            type='text'
                            {...getFieldProps('partNumber')}
                            error={touched.partNumber && Boolean(errors.partNumber)}
                        />
                        { (touched.partNumber && errors.partNumber) && <span className='invalid-field'>{errors.partNumber}</span> }
                    </Grid>

                    <Grid item xs={12} lg={6} md={6}>
                        <CustomFormLabel htmlFor="itemNumber">Item number</CustomFormLabel>
                        <CustomTextField 
                            id="itemNumber" 
                            variant="outlined" 
                            fullWidth
                            type='text'
                            {...getFieldProps('itemNumber')}
                            error={touched.itemNumber && Boolean(errors.itemNumber)}
                        />
                        { (touched.itemNumber && errors.itemNumber) && <span className='invalid-field'>{errors.itemNumber}</span> }
                    </Grid>

                    <Grid item xs={12} lg={6} md={6}>
                        <CustomFormLabel htmlFor="question-image">Cargar imagen de la pregunta</CustomFormLabel>
                        { (tempImg && allowedImageExtension) && <img src={tempImg} className="selected-image" alt='imagen' /> }
                        <CustomTextField
                            type="file"
                            onChange={handleImage} 
                            fullWidth
                        />
                        { !allowedImageExtension && <div><span className='invalid-field'>La extensión de este archivo no está permitida, cargue un archivo con la extensión png, jpg, jpeg.</span></div> }
                        { !allowedImageSize && <div><span className='invalid-field'>Esta imagen no está permitida porque excede el tamaño permitido de 10 MB</span></div> }
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
                            <FeatherIcon icon="save" width="20" />
                            <Typography
                                sx={{
                                    ml: 1
                                }}
                            >
                                { updateData ? 'Update' : 'Save' }
                            </Typography>
                        </Fab>
                    </Grid>

                </Grid>
            </form>
        </>
    );

}

export default ProductForm;
