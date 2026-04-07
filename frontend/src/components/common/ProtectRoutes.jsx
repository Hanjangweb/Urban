import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

// 1. Destructure children and role from props
const ProtectRoutes = ({ children, role }) => {
    const { user } = useSelector((state) => state.auth) 

    // 2. Check if user exists. 
    // 3. If a specific role is required, check if user has that role.
    if (!user || (role && user.role !== role)) {
        return <Navigate to="/login" replace />
    }

    // 4. Return the children (the actual components)
    return children
}

export default ProtectRoutes