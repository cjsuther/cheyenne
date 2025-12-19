import React from 'react'
import { bool } from 'prop-types';
import LoadingImg from '../../../assets/images/Loading.gif';


const Loading = (props) => {
  const {visible} = props;
  
  return (
    <>
        <div className={visible ? ("loading loading-show") : ("loading loading-hide")} >
            <img src={LoadingImg} alt="loading img"/>
        </div>
    </>
  )
}

Loading.propTypes = {
  visible: bool
};

Loading.defaultProps = {
  visible: false
};

export default Loading;
