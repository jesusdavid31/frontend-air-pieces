/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/self-closing-comp */
/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable object-shorthand */
/* eslint-disable no-use-before-define */
/* eslint-disable spaced-comment */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';

import FeatherIcon from 'feather-icons-react';
import Modal from '@mui/material/Modal';

const fatherStyles = {
    display: 'flex',
    flexDirection: 'column',
    bgcolor: 'white',
    width: { xs: '90%', sm: '90%', md: "90%", lg: '80%', xl: '50%' },
    minHeight: '10vh',
    maxHeight: '90vh',
    margin: '50px auto auto',
    overflow: 'hidden',
    borderRadius: '15px',
    zIndex: '999'
};


const sonStyles = {
    overflowY: 'scroll',
    bgcolor: 'background.paper',
    p: 4,
    "&::-webkit-scrollbar": {
        width: "12px",
        height: "12px",
        size: "10px",
        "&-track": { 
            backgroundColor: "#EEEDE7",
            borderRadius: "10px",
            border: "5px solid white",
            marginLeft: '10px'
        },
        "&-thumb": {
            backgroundColor: "#ccc",
            borderRadius: "20px",
            width: "10px",
        },
    }
};

const ReusableModal = ( { openModal, handleModalClose, iconName = '', title = 'Título del modal', children } ) => {

    return (
        <div className='modal-container'>
            <Modal
                open={openModal}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <>
                    <Box className='general-modal' sx={fatherStyles}>

                        {/***********
                            BOTÓN X
                        ************/}
                        <Box sx={{ display: "flex", justifyContent: "space-between", padding: '20px', alignItems: 'center' }}>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <FeatherIcon icon={iconName} width="20" /> <Typography variant="h3" sx={{ marginLeft: '5px' }}>{ title }</Typography>
                            </Box>

                            <Button
                                disableTouchRipple
                                onClick={handleModalClose}
                                sx={{
                                    width: "20px",
                                    height: "17px",
                                    padding: "20px 40px",
                                    color: '#868B8E',
                                    fontWeight: '700',
                                    fontSize: '18px',
                                    ":hover": {
                                        bgcolor: "transparent"
                                    },
                                }}
                                >
                                {/* <FeatherIcon icon="plus" width="20" /> */}
                                X
                            </Button>
                            
                        </Box>

                        <Divider 
                            sx={{
                                marginTop: '0px',
                            }}
                        />

                        <Box sx={sonStyles}>
                          {children}
                        </Box>

                        <Divider 
                            sx={{
                                marginTop: '0px',
                            }}
                        />

                        <Box sx={{ display: "flex", justifyContent: "end", padding: '20px'  }}>
                            {/* <Typography>footer</Typography> */}
                            <Button
                                onClick={handleModalClose}
                                sx={{
                                    bgcolor: '#FDF3F5',
                                    color: "#FC4B6C",
                                    width: "20px",
                                    height: "17px",
                                    padding: "20px 40px",
                                    ":hover": {
                                        bgcolor: "#fc4b6c",
                                        color: "#fff !important"
                                    },
                                }}
                                >
                                Close
                            </Button>
                        </Box>
                        
                    </Box>
                </> 
            </Modal>
        </div>
    );

}

export default ReusableModal;
