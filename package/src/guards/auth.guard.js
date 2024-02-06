/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/react-in-jsx-scope */
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import Swal from 'sweetalert2';
import moment from 'moment';
import { decodeJWT } from '../utils/decodeToken';

import { startChecking } from '../actions/auth';

export const AuthGuard = () => {

    const dispatch = useDispatch();
    const { token } = useSelector( state => state.auth ) || {};
    let sessionExpired = true;

    const handleStartChecking = async() => {
        try {
            dispatch( startChecking(token) );
        } catch (error) {
            Swal.fire('Error', 'Error al renovar la sesión, por favor intente nuevamente o cierre sesión y inicie sesión nuevamente.', 'error' );
        }
    }

    if( token ){

        const data = decodeJWT(token);
        const currentMoment = moment();
        const tokenExpiration = new Date(data?.exp * 1000);
        sessionExpired = moment(currentMoment).isAfter(tokenExpiration);

        if(sessionExpired){
            const diff = currentMoment.diff(tokenExpiration, 'days');
            if(diff > 0){
                Swal.fire('Error', 'Tu sesión ha expirado, por favor inicia sesión nuevamente.', 'error' );
            }else{
                // Ponemos el sessionExpired en false para que no cierre sesión el sistema ya que se renovara el token
                sessionExpired = false;
                handleStartChecking();
            }
        }
        
    }

    return (token && !sessionExpired) ? <Outlet /> : <Navigate replace to={'/auth/login'} />;

};

export default AuthGuard;