import {Fragment, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {MDBDataTable} from 'mdbreact';
import Toast from '../Toast';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';
import Sidebar from './Sidebar';
import {useDispatch, useSelector} from 'react-redux';
import {
	allUsers,
	deleteUser,
	clearErrors
} from '../../actions/userActions';
import {DELETE_USER_RESET} from '../../constants/userConstants';

const UsersList = ()=>{
	const toastRef = useRef();
	const dispatch = useDispatch();
	const {
		loading, 
		error, 
		users
	} = useSelector(state=>state.allUsers);
	const {isDeleted} = useSelector(state=>state.user);

	useEffect(()=>{
		dispatch(allUsers());
		if(error){
			toastRef.current.setMessage(error);
			dispatch(clearErrors());
		}
		if(isDeleted){
			toastRef.current.setMessage('User deleted successfully');
			dispatch({type: DELETE_USER_RESET});
		}
	}, [dispatch, error, isDeleted]);

	const deleteUserHandler = (id)=>{
		dispatch(deleteUser(id));
	}
	
	const setUsers = ()=>{
		const data = {
			columns: [
				{
					label: 'User ID',
					field: 'id',
					sort: 'asc'
				},
				{
					label: 'Name',
					field: 'name',
					sort: 'asc'
				},
				{
					label: 'Email',
					field: 'email',
					sort: 'asc'
				},
				{
					label: 'Role',
					field: 'role',
					sort: 'asc'
				},
				{
					label: 'Actions',
					field: 'actions'
				}
			],
			rows: []
		};

		users && users.forEach(user=>{
			data.rows.push({
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				actions: 
					<Fragment>
						<Link 
							className="btn btn-primary py-1 px-2" 
							to={`/admin/user/${user._id}`}
						>
							<i className="fa fa-pencil"></i>
						</Link>
						<button 
							className="btn btn-danger py-1 px-2 ml-2"
							onClick={()=>deleteUserHandler(user._id)}
						>
							<i className="fa fa-trash"></i>
						</button>
					</Fragment>
			});
		});
		return data;
	}
	return(
		<Fragment>
			<Toast ref={toastRef} redirect="/admin/users"/>
			<MetaData title="All Users"/>
			<div className="row">
				<div className="col-12 col-md-2">
					<Sidebar/>
				</div>
				<div className="col-12 col-md-10">
					<Fragment>
						<h1 className="my-5">
							All Users
						</h1>
						{loading ? <Loader/> :
							<MDBDataTable
								data={setUsers()}
								className="px-3"
								bordered
								striped
								hover
							/>
						}
					</Fragment>
				</div>
			</div>
		</Fragment>
	);
}

export default UsersList;