import React, {Fragment} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux'; 

const ProtectedRoute = ({isAdmin, element})=>{
	const navigate = useNavigate();
	const {
		isAuthenticated,
		loading,
		user
	} = useSelector(state=> state.auth);
	if(loading){
		return null;
	}
	if(!isAuthenticated){
		navigate('/login');
		return null;
	} 
	if(isAdmin && user.role !== 'admin'){
		navigate('/');
		return null;
	}
	if(!isAdmin && user.role === 'admin'){
		navigate('/');
		return null;
	}
	return(
		<Fragment>
			{element}
		</Fragment>
	);
}

export default ProtectedRoute;