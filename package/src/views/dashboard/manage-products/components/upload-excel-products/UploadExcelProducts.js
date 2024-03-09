/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { useState } from 'react';

import { Box, Grid, Button } from '@mui/material';
import FeatherIcon from 'feather-icons-react';

import { fetchWithTokenAndFormData } from '../../../../../helpers/fetch';
import { sweetalert } from '../../../../../utils/sweetalert';
import { validateExcelFileSize, validateExcelFileExtension } from '../../../../../utils/validateImages';

import CustomFormLabel from '../../../../../components/FormElements/custom-elements/CustomFormLabel';
import CustomTextField from '../../../../../components/FormElements/custom-elements/CustomTextField';

import Swal from 'sweetalert2';

const BulkLoadModal = ({ handleExcelClosedModal, token, getProducts }) => {

    // Excel file
    const [file, setFile] = useState(null);
    const [allowedFileExtension, setAllowedFileExtension] = useState(true);
    const [allowedFileSize, setAllowedFileSize] = useState(true);

    const handleFile = (e) => {

        // Validamos si no existe el archivo, es decir no se selecciono ningún archivo
        if ( !e.target.files[0] ) {
            // Se pone en true ya que se cancela la imagen seleccionada
            setAllowedFileExtension(true);
            setAllowedFileSize(true);
            setFile(null);
            return;
        }  

        setFile(e.target.files[0]);

        validateExcelFileSize( e.target.files[0] ) ? setAllowedFileSize(false) : setAllowedFileSize(true);
        validateExcelFileExtension( e.target.files[0] ) ? setAllowedFileExtension(false) : setAllowedFileExtension(true);
    
    };

    const uploadFile = async() => {

        try {

            if( !allowedFileExtension || !allowedFileSize || !file ){
                return;
            }
        
            handleExcelClosedModal();
            sweetalert('Saving', 'Please wait a moment...');
        
            const formData = new FormData();
            formData.append('file', file);
        
            const resp = await fetchWithTokenAndFormData( `product-excel`, token, formData, 'POST' );
        
            if(resp?.success){
                Swal.fire('Data saved successfully', 'Successfully created product', 'success' );
                getProducts();
            }
    
        } catch (error) {
            Swal.fire('Error', 'An error has occurred', 'error' );
        }

    }

    return (
        <>
            <Box>

                <Grid container spacing={4}>

                    <Grid item xs={12}>
                        <CustomFormLabel>File upload</CustomFormLabel>
                        <CustomTextField
                            type="file"
                            onChange={handleFile} 
                            fullWidth
                        />
                        { !allowedFileExtension && <div><span className='invalid-field'>This file extension is not allowed. Upload a file with xlsx extension.</span></div> }
                        { !allowedFileSize && <div><span className='invalid-field'>This file is not allowed because it exceeds the allowed size of 5 MB.</span></div> }
                    </Grid>

                    <Grid item xs={12} lg={12} md={12}>
                        <Button
                            type="button" 
                            onClick={uploadFile}
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
                    </Grid>

                </Grid>
            </Box>
        </>
    );

}

export default BulkLoadModal;
