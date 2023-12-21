import React, {
	Fragment,
	useEffect,
	useRef,
	useState
} from 'react';
import {
	useDispatch,
	useSelector
} from 'react-redux';
import {useParams} from 'react-router-dom';
import Toast from '../Toast';
import MetaData from '../layout/MetaData';
import Sidebar from './Sidebar';
import {
	clearErrors,
	getUserDetails,
	updateUser
} from '../../actions/userActions';
import {UPDATE_USER_RESET} from '../../constants/userConstants';

const UpdateUser = ()=>{
	const toastRef = useRef();
	const dispatch = useDispatch();
	const {id} = useParams();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [role, setRole] = useState('');
	const {
		error,
		isUpdated
	} = useSelector(state=>state.user);
	const {
		user: userDetails
	} = useSelector(state=>state.userDetails);

	useEffect(()=>{
		const fetchUserDetails = async()=>{
			try{
				dispatch(getUserDetails(id));
			}
			catch(error){
				toastRef.current.setMessage(error);
			}
		};
		fetchUserDetails();
	}, [dispatch, id]);

	useEffect(()=>{
		if(userDetails){
			setName(userDetails.name);
			setEmail(userDetails.email);
			setRole(userDetails.role);
		}
	}, [userDetails]);

	useEffect(()=>{
		if(error){
			toastRef.current.setMessage(error);
			dispatch(clearErrors());
		}
	}, [dispatch, error]);

	useEffect(()=>{
		if(isUpdated){
			toastRef.current.setMessage('User updated successfully');
			dispatch({type: UPDATE_USER_RESET});
		}
	}, [dispatch, isUpdated]);

	const submitHandler = (e)=>{
		e.preventDefault();
		const formData = new FormData();
		formData.set('name', name);
		formData.set('email', email);
		formData.set('role', role);
		dispatch(updateUser(userDetails._id, formData));
	}
	return(
		<Fragment>
			<Toast ref={toastRef} redirect="/admin/users"/>
			<MetaData title="Update User"/>
			<div className="row">
				<div className="col-12 col-md-2">
					<Sidebar/>
				</div>
				<div className="col-12 col-md-10">
					<div className="row wrapper">
					    <div className="col-10 col-lg-5">
					        <form 
					        	className="shadow-lg"
					        	onSubmit={submitHandler}
				        	>
					            <h1 className="mt-2 mb-5">Update User</h1>
					            <div className="form-group">
					                <label for="name_field">Name</label>
					                <input 
					                    type="name" 
					                    id="name_field" 
					                    className="form-control"
					                    name='name'
					                    value={name}
					                    onChange={e=>setName(e.target.value)}
				                    />
					            </div>
					            <div className="form-group">
					                <label for="email_field">Email</label>
					                <input
					                    type="email"
					                    id="email_field"
					                    className="form-control"
					                    value={email}
					                    onChange={e=>setEmail(e.target.value)}
				                    />
					            </div>
					            <div className="form-group">
					                <label for="role_field">Role</label>
					                <select
					                    id="role_field"
					                    className="form-control"
					                    name='role'
					                    value={role}
					                    onChange={e=>setRole(e.target.value)}
				                    >
					                    <option value="user">user</option>
					                    <option value="admin">admin</option>
					                </select>
					            </div>
					            <button type="submit" className="btn update-btn btn-block mt-4 mb-3" >Update</button>
					        </form>
					    </div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default UpdateUser;