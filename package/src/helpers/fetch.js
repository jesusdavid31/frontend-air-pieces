/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import Swal from 'sweetalert2';

const baseUrl = process.env.REACT_APP_API_URL;

const handleError = (response) => {
    if (!response.success){
        const errorBody = {
            msg: response.messageError
        };
        throw errorBody;
    }
    return response;
}

const fetchSinToken = ( endpoint = '', data = {}, method = 'GET' ) => {

    const url = `${ baseUrl }/${ endpoint }`;

    if ( method === 'GET' ) {
        return fetch( url )
        .then( resp => resp.json() )
        .then( (resp) => {
            handleError(resp);
            return resp;
        })
        .catch((error) => {
            Swal.fire('Error', error.msg , 'error' );
        });
    }

    return fetch( url, {
        method,
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify( data )
    })
    .then( resp => resp.json() )
    .then( (resp) => {
        handleError(resp);
        return resp;
    })
    .catch((error) => {
        Swal.fire('Error', error.msg , 'error' );
    });

}

const fetchConToken = ( endpoint = '', token = '', data = {}, method = 'GET' ) => {

    const url = `${ baseUrl }/${ endpoint }`;

    if ( method === 'GET' ) {

        return fetch( url, {
            method,
            headers: {
                'Authorization': token
            }
        }).then( resp => resp.json() )
        .then( (resp) => {
            handleError(resp);
            return resp;
        })
        .catch((error) => {
            Swal.fire('Error', error.msg , 'error' );
        });

    }

    return fetch( url, {
        method,
        headers: {
            'Content-type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify( data )
    })
    .then( resp => resp.json() )
    .then( (resp) => {
        handleError(resp);
        return resp;
    })
    .catch((error) => {
        Swal.fire('Error', error.msg , 'error' );
    });
    
}

const fetchWithTokenAndFormData = ( endpoint = '', token = '', formData = {}, method = 'POST' ) => {

    const url = `${ baseUrl }/${ endpoint }`;

    return fetch( url, {
        method,
        headers: {
            'Authorization': token
        },
        body: formData
    })
    .then( resp => resp.json() )
    .then( (resp) => {
        handleError(resp);
        return resp;
    })
    .catch((error) => {
        Swal.fire('Error', error.msg , 'error' );
    });
    
}


export {
    fetchSinToken,
    fetchConToken,
    fetchWithTokenAndFormData
}