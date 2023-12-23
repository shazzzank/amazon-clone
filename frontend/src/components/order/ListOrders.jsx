import {useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import {MDBDataTable} from 'mdbreact';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';
import Toast from '../Toast';
import {useDispatch, useSelector} from 'react-redux';
import {myOrders, clearErrors} from '../../actions/orderActions';

const ListOrders = ()=>{
	const toastRef = useRef();
	const dispatch = useDispatch();
	const {loading, error, orders} = useSelector(state=>state.myOrders);

	useEffect(()=>{
		dispatch(myOrders());
		if(error){
			toastRef.current.setMessage(error);
			dispatch(clearErrors());
		}
	}, [dispatch, error]);
	
	const setOrders = ()=>{
		const data = {
			columns: [
				{
					label: 'Order ID',
					field: 'id',
					sort: 'asc'
				},
				{
					label: 'Num of Items',
					field: 'numOfItems',
					sort: 'asc'
				},
				{
					label: 'Amount',
					field: 'amount',
					sort: 'asc'
				},
				{
					label: 'Status',
					field: 'status',
					sort: 'asc'
				},
				{
					label: 'Actions',
					field: 'actions',
					sort: 'asc'
				}
			],
			rows: []
		};

		orders && orders.forEach(order=>{
			data.rows.push({
				id: order._id,
				numOfItems: order.orderItems.length,
				amount: `$${order.totalPrice}`,
				status: order.orderStatus && String(order.orderStatus).includes('Delivered') ? 
					<p style={{color: 'green'}}>{order.orderStatus}</p> :
					<p style={{color: 'red'}}>{order.orderStatus}</p>,
				actions: 
					<Link className="btn btn-primary" to={`/order/${order._id}`}>
						<i className="fa fa-eye"></i>
					</Link>
			});
		});
		return data;
	}
	return(
		<div className="container container-fluid">
			<MetaData title="My Orders"/>
			<Toast ref={toastRef} redirect="/"/>
			<h1 className="mt-5">My Orders</h1>
			{loading ? 
				<Loader/> : 
				<MDBDataTable
					data={setOrders()}
					className="px-3"
					bordered
					striped
					hover
				/>
			}
		</div>
	);
}

export default ListOrders;