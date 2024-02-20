import React, { ReactNode, FC } from 'react'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
    children: ReactNode;
}

export const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
    return localStorage.getItem("valid") ? children : <Navigate to='/' />


}
