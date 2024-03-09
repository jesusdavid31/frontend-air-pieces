/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/react-in-jsx-scope */
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import { decodeJWT } from '../utils/decodeToken';

import Swal from 'sweetalert2';
import moment from 'moment';

export const AuthGuard = () => {

    const { token } = useSelector( state => state.auth ) || {};
    let sessionExpired = true;

    if( token ){

        const data = decodeJWT(token);
        const currentMoment = moment();
        const tokenExpiration = new Date(data?.exp * 1000);
        sessionExpired = moment(currentMoment).isAfter(tokenExpiration);

        if(sessionExpired){
            const diff = currentMoment.diff(tokenExpiration, 'days');
            if(diff > 0){
                Swal.fire('Error', 'Your session has expired, please log in again.', 'error' );
            }else{
                // Ponemos el sessionExpired en false para que no cierre sesión el sistema ya que se renovara el token
                sessionExpired = false;
                // handleStartChecking();
            }
        }
        
    }

    return (token && !sessionExpired) ? <Outlet /> : <Navigate replace to={'/auth/login'} />;

};

export default AuthGuard;