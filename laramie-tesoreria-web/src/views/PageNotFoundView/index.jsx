import React from 'react';
import timeout from '../../assets/images/timeout.png';


function PageNotFoundView() {

    return (
        <>

            <section className='m-top-50 text-center'>

                <div className="m-top-100">
                    <img src={timeout} alt="logo" width={250} height={250} />
                </div>
                <br></br>
                <br></br>
                
                <h2>Página no encontrada</h2>
                <h3>Por favor, revise si la URL es correcta.</h3>

            </section>

        </>
    )
}

export default PageNotFoundView;
