import React, {
	useEffect,
	useRef,
	useState
} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import Toast from '../Toast';
import MetaData from '../layout/MetaData';
import {
	resetPassword,
	clearErrors
} from '../../actions/userActions';


const NewPassword = ()=>{
	const toastRef = useRef();
	const dispatch = useDispatch();
	const {token} = useParams();
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const {
		error,
		success
	} = useSelector(state=>state.forgotPassword);

	useEffect(()=>{
		if(error){
			toastRef.current.setMessage(error);
			dispatch(clearErrors());
		}
		if(success){
			toastRef.current.setMessage('Password updated successfully');
		}
	}, [dispatch, error, success]);

	const submitHandler = (e)=>{
		e.preventDefault();
		const formData = new FormData();
		formData.set('password', password);
		formData.set('confirmPassword', confirmPassword);
		dispatch(resetPassword(token, formData));
	}
	return(
		<div className="container container-fluid">
			<Toast ref={toastRef} redirect="/login"/>
			<MetaData title="New Password Reset"/>
			<div className="row wrapper">
			    <div className="col-10 col-lg-5">
			        <form 
			        	className="shadow-lg"
			        	onSubmit={submitHandler}
			        >
			            <h1 className="mb-3">New Password</h1>

			            <div className="form-group">
			                <label htmlFor="password_field">Password</label>
			                <input
			                    type="password"
			                    id="password_field"
			                    className="form-control"
			                    value={password}
			                    onChange={e=>setPassword(e.target.value)}
			                />
			            </div>

			            <div className="form-group">
			                <label htmlFor="confirm_password_field">Confirm Password</label>
			                <input
			                    type="password"
			                    id="confirm_password_field"
			                    className="form-control"
			                    value={confirmPassword}
			                    onChange={e=>setConfirmPassword(e.target.value)}
			                />
			            </div>

			            <button
			                id="new_password_button"
			                type="submit"
			                className="btn btn-block py-3">
			                Set Password
			            </button>

			        </form>
			    </div>
			</div>
		</div>
	);
}

export default NewPassword;