import React, {
	useEffect,
	useRef,
	useState
} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Toast from '../Toast';
import MetaData from '../layout/MetaData';
import {
	forgotPassword,
	clearErrors
} from '../../actions/userActions';

const ForgotPassword = ()=>{
	const toastRef = useRef();
	const dispatch = useDispatch();
	const [email, setEmail] = useState('');
	const {
		error,
		loading,
		message
	} = useSelector(state=>state.forgotPassword);

	useEffect(()=>{
		if(error){
			toastRef.current.setMessage(error);
			dispatch(clearErrors());
		}
		if(message){
			toastRef.current.setMessage(message);
		}
	}, [dispatch, error, message]);

	const submitHandler = (e)=>{
		e.preventDefault();
		const formData = new FormData();
		formData.set('email', email);
		dispatch(forgotPassword(formData));
	}

	return(
		<div className="container container-fluid">
			<MetaData title="Forgot Password"/>
			<Toast ref={toastRef} redirect="/login"/>
			<div className="row wrapper">
			    <div className="col-10 col-lg-5">
			        <form 
			        	className="shadow-lg"
			        	onSubmit={submitHandler}
		        	>
			            <h1 className="mb-3">Forgot Password</h1>
			            <div className="form-group">
			                <label htmlFor="email_field">Enter Email</label>
			                <input
			                    type="email"
			                    id="email_field"
			                    className="form-control"
			                    value={email}
			                    onChange={e=>setEmail(e.target.value)}
			                />
			            </div>

			            <button
			                id="forgot_password_button"
			                type="submit"
			                className="btn btn-block py-3"
			                disabled={loading ? true : false}
			            >
			                Send Email
			        </button>

			        </form>
			    </div>
			</div>
		</div>
	);
}

export default ForgotPassword;