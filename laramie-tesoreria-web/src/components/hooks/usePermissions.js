import { useEffect, useState } from 'react';
import { useAccess } from './useAccess';

export const usePermissions = () => {
    const GLOBAL_PERMISSIONS_KEY = 'USER_PERMISSIONS';

    const [permissions, setPermissions] = useState([]);
    const [ready, setReady] = useState(false);

    const [accesses, accessReady] = useAccess({ key: GLOBAL_PERMISSIONS_KEY });

    useEffect(() => {
        if (accessReady) {
            setPermissions(accesses);
            setReady(true);
        }
    }, [accesses, accessReady]);

    const hasPermission = (code) => {
        return ready && permissions.some((perm) => perm.codigo === code);
    };

    return { permissions, ready, hasPermission };
};
