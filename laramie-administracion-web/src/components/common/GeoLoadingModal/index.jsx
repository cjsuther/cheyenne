import React, { useEffect } from 'react';
import { string, bool ,func } from 'prop-types';


const GeoLoadingModal = (props) => {

  const mount = () => {

    if (props.active) {
        setTimeout(() => {
            if (props.callbackGeoLoading) {
                props.callbackGeoLoading();
            }
        }, 3000);
    }

    const unmount = () => {}
    return unmount;
  }
  useEffect(mount, [props.active]);

  return (

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
      <div className="modal-dialog">
        <div className="modal-content animated fadeIn">
          <div className="modal-body">
            <p className="text-center p-top-10">
                <i className="fa fa-spinner fa-spin m-right-10"></i>
                {props.message}
            </p>
          </div>
        </div>
      </div>
    </div>

  );
}

GeoLoadingModal.propTypes = {
    message: string.isRequired,
    active: bool,
    callbackGeoLoading: func
};

GeoLoadingModal.defaultProps = {
    active: false,
    callbackGeoLoading: null
};

export default GeoLoadingModal;
