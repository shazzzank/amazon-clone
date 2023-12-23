import {
    useState,
    forwardRef,
    useImperativeHandle
} from 'react';
import {useNavigate} from 'react-router-dom';

function Toast(props, ref) {
    const [boolean, setBoolean] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useImperativeHandle(ref, () => ({
        setMessage(value){
            setBoolean(true);
            setMessage(value);
            setTimeout(() => {
                if (value.includes('success')){
                    setBoolean(false);
                    navigate(props.redirect);
                }
                else setBoolean(false)
            }, 1000);
        },
    }));

    return (
        <div className={`toast ${boolean ? 'show' : ''}`}>
      {message}
    </div>
    );
}

export default forwardRef(Toast);

/*

Usage :

  import { useRef } from 'react';
  import Toast from '../toast.jsx';

  const toastRef = useRef();

  toastRef.current.setMessage(res.data.message); //inside the function

  <Toast ref={toastRef} redirect="/"/>  //inside the return


*/