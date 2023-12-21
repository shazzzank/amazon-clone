import {Fragment, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {MDBDataTable} from 'mdbreact';
import Toast from '../Toast';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';
import Sidebar from './Sidebar';
import {useDispatch, useSelector} from 'react-redux';
import {
	getAdminProducts, 
	deleteProduct, 
	clearErrors
} from '../../actions/productActions';
import {DELETE_PRODUCT_RESET} from '../../constants/productConstants';

const ProductsList = ()=>{
	const toastRef = useRef();
	const dispatch = useDispatch();
	const {
		loading, 
		error, 
		products
	} = useSelector(state=>state.products);
	const {
		error: deleteError, 
		isDeleted
	} = useSelector(state=>state.product);

	useEffect(()=>{
		dispatch(getAdminProducts());
		if(error){
			toastRef.current.setMessage(error);
			dispatch(clearErrors());
		}
		if(deleteError){
			toastRef.current.setMessage(deleteError);
			dispatch(clearErrors());
		}
		if(isDeleted){
			toastRef.current.setMessage('Product deleted successfully');
			dispatch({type: DELETE_PRODUCT_RESET});
		}
	}, [dispatch, error, deleteError, isDeleted]);
	
	const setProducts = ()=>{
		const data = {
			columns: [
				{
					label: 'ID',
					field: 'id',
					sort: 'asc'
				},
				{
					label: 'Name',
					field: 'name',
					sort: 'asc'
				},
				{
					label: 'Price',
					field: 'price',
					sort: 'asc'
				},
				{
					label: 'Stock',
					field: 'stock',
					sort: 'asc'
				},
				{
					label: 'Actions',
					field: 'actions'
				}
			],
			rows: []
		};

		products && products.forEach(product=>{
			data.rows.push({
				id: product._id,
				name: product.name,
				price: `$${product.price}`,
				stock: product.stock,
				actions: 
					<Fragment>
						<Link 
							className="btn btn-primary py-1 px-2" 
							to={`/admin/product/${product._id}`}
						>
							<i className="fa fa-pencil"></i>
						</Link>
						<button 
							className="btn btn-danger py-1 px-2 ml-2"
							onClick={()=>deleteProductHandler(product._id)}
						>
							<i className="fa fa-trash"></i>
						</button>
					</Fragment>
			});
		});
		return data;
	}
	const deleteProductHandler = (id)=>{
		dispatch(deleteProduct(id));
	}
	return(
		<Fragment>
			<Toast ref={toastRef} redirect="/admin/products"/>
			<MetaData title="All Products"/>
			<div className="row">
				<div className="col-12 col-md-2">
					<Sidebar/>
				</div>
				<div className="col-12 col-md-10">
					<Fragment>
						<h1 className="my-5">
							All Products
						</h1>
						{loading ? <Loader/> :
							<MDBDataTable
								data={setProducts()}
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

export default ProductsList;