/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/react-in-jsx-scope */
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import { decodeJWT } from '../utils/decodeToken';

import moment from 'moment';
import 'moment/locale/es';


export const LoggedOutGuard = () => {

    const { token } = useSelector( (state) => state.auth ) || {};
    let sessionExpired = true;

    if( token ){

        const data = decodeJWT(token);
        const currentMoment = moment();
        const tokenExpiration = new Date(data?.exp * 1000);
        sessionExpired = moment(currentMoment).isAfter(tokenExpiration);
        
    }
    
    return (!token || sessionExpired) ? <Outlet /> : <Navigate replace to={'/dashboard/manage-products'} />;

};

export default LoggedOutGuard;