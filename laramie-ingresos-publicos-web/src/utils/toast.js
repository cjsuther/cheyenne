import { toast } from 'react-toastify';
import { ALERT_TYPE } from '../consts/alertType';

const ShowToastMessage = (type, message, callbackOnClose = null) => {

    if (type && message) {

      switch(type) {

        case ALERT_TYPE.ALERT_INFO: {
          toast.info(message, {
            theme: "colored",
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            onClose: callbackOnClose
          });
          break;
        }

        case ALERT_TYPE.ALERT_SUCCESS: {
          toast.success(message, {
            theme: "colored",
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            onClose: callbackOnClose
          });
          break;
        }

        case ALERT_TYPE.ALERT_WARNING: {
          toast.warning(message, {
            theme: "colored",
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            onClose: callbackOnClose
          });
          break;
        }

        case ALERT_TYPE.ALERT_ERROR: {
          toast.error(message, {
            theme: "colored",
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            onClose: callbackOnClose
          });
          break;
        }

        default: {
          break;
        }

      }

    }

}

export default ShowToastMessage;