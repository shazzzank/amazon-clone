import {Fragment, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import MetaData from '../layout/MetaData';
import Sidebar from './Sidebar';
import Toast from '../Toast';
import {updateProduct, getProductDetails, clearErrors} from '../../actions/productActions';
import {UPDATE_PRODUCT_RESET} from '../../constants/productConstants';

const UpdateProduct = ()=>{
	const toastRef = useRef();
	const {id} = useParams();
	const dispatch = useDispatch();
	const {
		error,
		product
	} = useSelector(state=>state.productDetails);
	const {
		loading,
		error: updateError,
		isUpdated
	} = useSelector(state=>state.product);
	const productId = id;
	const [name, setName] = useState('');
	const [price, setPrice] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	const [stock, setStock] = useState(0);
	const [seller, setSeller] = useState('');
	const [images, setImages] = useState([]);
	const [oldImages, setOldImages] = useState([]);
	const [imagesPreview, setImagesPreview] = useState([]);
	const categories = [
		'Electronics',
		'Cameras',
		'Laptop',
		'Accessories',
		'Headphones',
		'Food',
		'Books',
		'Clothes/Shoes',
		'Beauty/Health',
		'Sports',
		'Outdoor',
		'Home'
	];
	useEffect(()=>{
		if(product && product._id !== productId){
			dispatch(getProductDetails(productId));	
		}
		else{
			setName(product.name);
			setPrice(product.price);
			setDescription(product.description);
			setCategory(product.category);
			setSeller(product.seller);
			setStock(product.stock);
			setOldImages(product.images);
		}
		if(error){
			toastRef.current.setMessage(error);
			dispatch(clearErrors());	
		}
		if(updateError){
			toastRef.current.setMessage(updateError);
			dispatch(clearErrors());	
		}
		if(isUpdated){
			toastRef.current.setMessage('Product updated successfully');
			dispatch({type: UPDATE_PRODUCT_RESET});
		}
	}, [dispatch, error, isUpdated, updateError, product, productId]);
	const onChange = e=>{
		const files = Array.from(e.target.files);
		setImagesPreview([]);
		setImages([]);
		setOldImages([]);
		files.forEach(file=>{
			const reader = new FileReader();
			reader.onload = ()=>{
				if(reader.readyState === 2){
					setImagesPreview(oldArray=>
						[...oldArray, reader.result]
					);
					setImages(oldArray=>
						[...oldArray, reader.result]
					);
				}
			}
			reader.readAsDataURL(file);
		});
	}
	const submitHandler = (e)=>{
		e.preventDefault();
		const formData = new FormData();
		formData.set('name', name);
		formData.set('price', price);
		formData.set('description', description);
		formData.set('category', category);
		formData.set('stock', stock);
		formData.set('seller', seller);
		images.forEach(image=>{
			formData.append('images', image);
		});
		dispatch(updateProduct(product._id, formData));
	}
	return(
		<Fragment>
			<Toast ref={toastRef} redirect="/admin/products"/>
			<MetaData title="Update Product"/>
			<div className="row">
				<div className="col-12 col-md-2">
					<Sidebar/>
				</div>
				<div className="col-12 col-md-10">
					<Fragment>
						<div className="wrapper my-5">
						    <form 
						    	className="shadow-lg"
						    	encType='multipart/form-data'
						    	onSubmit={submitHandler}
					    	>
						        <h1 className="mb-4">New Product</h1>
						        <div className="form-group">
						            <label htmlFor="name_field">Name</label>
						            <input
						                type="text"
						                id="name_field"
						                className="form-control"
						                value={name}
						                onChange={e=>setName(e.target.value)}
					                />
						        </div>
						        <div className="form-group">
						            <label htmlFor="price_field">Price</label>
						            <input
						                type="text"
						                id="price_field"
						                className="form-control"
						                value={price}
						                onChange={e=>setPrice(e.target.value)}
					                />
						        </div>
						        <div className="form-group">
						            <label htmlFor="description_field">Description</label>
						            <textarea 
						            	className="form-control" 
						            	id="description_field" 
						            	rows="8"
						                value={description}
						                onChange={e=>setDescription(e.target.value)}
					            	></textarea>
						        </div>
						        <div className="form-group">
						            <label htmlFor="category_field">Category</label>
						            <select 
						            	className="form-control" 
						            	id="category_field"
						                value={category}
						                onChange={e=>setCategory(e.target.value)}
					            	>
					            		{categories.map(category=>
						                	<option 
						                		key={category}
						                		value={category}
					                		>
					                			{category}
				                			</option>
					            		)}
						            </select>
						        </div>
						        <div className="form-group">
						            <label htmlFor="stock_field">Stock</label>
						            <input
						                type="number"
						                id="stock_field"
						                className="form-control"
						                value={stock}
						                onChange={e=>setStock(e.target.value)}
					                />
						        </div>
						        <div className="form-group">
						            <label htmlFor="seller_field">Seller Name</label>
						            <input
						                type="text"
						                id="seller_field"
						                className="form-control"
						                value={seller}
						                onChange={e=>setSeller(e.target.value)}
					                />
						        </div>
						        <div className='form-group'>
						            <label>Images</label>
						            <div className='custom-file'>
						                <input
						                    type='file'
						                    name='product_images'
						                    className='custom-file-input'
						                    id='customFile'
						                    multiple
						                    onChange={onChange}
					                    />
						                <label className='custom-file-label' htmlFor='customFile'>
						                	Choose Images
						                </label>
						            </div>
						            {oldImages && oldImages.map(image=>
						            	<img 
						            		key={image}
						            		className="mt-3 mr-2"
						            		src={image.url} 
						            		alt={image.url}
						            		width="250"
						            		height="150"
					            		/>
					            	)}
						            {imagesPreview.map(image=>
						            	<img 
						            		key={image}
						            		className="mt-3 mr-2"
						            		src={image}
						            		alt="Images Preview"
						            		width="55"
						            		height="52"
					            		/>
						            )}
						        </div>
						        <button
						            id="login_button"
						            type="submit"
						            className="btn btn-block py-3"
						            disabled={loading ? true: false}
					            >
						        	UPDATE
						        </button>
						    </form>
						</div>
					</Fragment>
				</div>
			</div>
		</Fragment>
	);
}

export default UpdateProduct;