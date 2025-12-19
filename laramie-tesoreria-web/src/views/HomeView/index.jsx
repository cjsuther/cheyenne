import React from 'react';
import './index.scss';

import { useNav } from '../../components/hooks';
import { usePermissions } from '../../components/hooks/usePermissions';
import { PERMISSIONS } from '../../consts/permissions';

function HomeView() {
    const navigate = useNav();
    const { hasPermission } = usePermissions();

    const botones = [
        {
            label: <>CONTROL DE<br/>RECAUDACIONES</>,
            url: '/recaudacion/control',
            iconClass: 'lotes-no-balanceados-icon',
            requiredPermission: PERMISSIONS.RECAUDACION_LOTE_CONTROL,
        },{
            label: <>CONCILIACION DE<br/>RECAUDACIONES</>,
            url: '/recaudacion/conciliacion',
            iconClass: 'lotes-no-conciliados-icon',
            requiredPermission: PERMISSIONS.RECAUDACION_LOTE_CONCILICION,
        },{
            label: <>RENDICION A <br/>INGRESOS PUBLICOS</>,
            url: '/rendicion/ingresos-publicos',
            iconClass: 'rendicion-iipp-icon',
            requiredPermission: PERMISSIONS.PAGO_RENDICION_EDIT,
        },
        {
            label: <>RENDICION A <br/>CONTADURIA</>,
            url: '/rendicion/contaduria',
            iconClass: 'rendicion-contabilidad-icon',
            requiredPermission: PERMISSIONS.REGISTRO_CONTABLE_LOTE_EDIT,
        },
        {
            label: <>ACCESO<br/>A CAJAS</>,
            url: '/acceso-cajas',
            iconClass: 'cajas-icon',
            requiredPermission: PERMISSIONS.CAJA_COBRO,
        }
    ];

    return (
        <>
            <div className='ingreso-container'>
                <section className='ingreso-menu'>
                    <div className='row'>
                        {botones.map((boton, index) => (
                            hasPermission(boton.requiredPermission) && (
                                <div key={index} className="col-12 col-md-6 col-xl-3 ingreso">
                                    <div onClick={() => navigate({ to: boton.url })} className="nav-link">
                                        <div className={`ingreso-icon ${boton.iconClass}`}></div>
                                        <span className='ingreso-text'>{boton.label}</span>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}

export default HomeView;
