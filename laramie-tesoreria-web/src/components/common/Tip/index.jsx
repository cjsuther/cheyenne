import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

import { APIS } from "../../../config/apis";
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { standardRequest } from "../../../utils/requests";

function Tip({name, position = 'top', compact = false}) {
    const [showTip, setShowTip] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(false);
    const tooltipRef = useRef(null);

    useEffect(() => {
        if (!name) return;
        setLoading(true);

        standardRequest(
            REQUEST_METHOD.GET,
            APIS.URLS.TIP + `/codigo/${name}`,
            null,
            { disableToast: true }
        )
            .then(data => {
                setTitle(data.titulo || 'Ayuda');
                setDescription(data.descripcion || 'Sin contenido');
                setLink(data.link || '');
            })
            .catch(() => {
                setTitle('Error');
                setDescription('No se pudo obtener la información.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [name]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                setShowTip(false);
            }
        }
        if (showTip) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showTip]);

    const handleToggleTip = () => {
        setShowTip(!showTip);
    };

    const containerClass = `tip-container tip-container-${position === 'bottom' ? 'bottom' : 'top'} 
    ${compact ? 'tip-container-compact' : ''}`.trim();

    function renderTitle() {
        if (loading) {
            return 'Cargando...';
        }
        if (link) {
            return (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tip-link"
                >
                    {title}
                </a>
            );
        }
        return title;
    }

    return (
        <div className="tip-wrapper">
            <span
                className="material-symbols-outlined ms-help help-button"
                onClick={handleToggleTip}
            >
                help
            </span>

            {showTip && (
                <div>
                    <div className="tip-overlay" />
                    <div className={containerClass} ref={tooltipRef}>
                        <div className="tip-header">
                            <span className="tip-title">
                                {loading
                                    ? 'Cargando...'
                                    : renderTitle()
                                }
                            </span>
                            <span
                                onClick={() => setShowTip(false)}
                                className="material-symbols-outlined span-close">close</span>
                        </div>
                        <div className="tip-body">
                            {loading
                                ? 'Cargando...'
                                : (
                                    <div
                                        dangerouslySetInnerHTML={{ __html: description }}
                                    />
                                )
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tip;
