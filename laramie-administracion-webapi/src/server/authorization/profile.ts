import { Mutex } from 'async-mutex';
import container from '../../infraestructure/ioc/dependency-injection';
import config from '../../server/configuration/config';
import PerfilService from '../../domain/services/perfil-service';
import PerfilPermiso from '../../domain/dto/perfil-permiso';

let mutexProfiles = new Mutex();

export async function  getProfiles() {

    await mutexProfiles.runExclusive(async () => {
        try {
            if (config.GLOBAL_DATA.PROFILES.length === 0) {
                let profiles = [];
                const perfilService = container.resolve("perfilService") as PerfilService;
                const perfiles = await perfilService.listPermisos() as Array<PerfilPermiso>;
        
                for (let i=0; i < perfiles.length; i++) {
                    const profile = {
                        id: perfiles[i].id,
                        permisos: perfiles[i].permisos.map(x => { 
                            return {id: x.id, codigo: x.codigo};
                        })
                    };
                    profiles.push(profile);
                }
                config.GLOBAL_DATA.PROFILES = profiles;
            }
        }
        catch {
            config.GLOBAL_DATA.PROFILES = [];
        }
    });

    return [...config.GLOBAL_DATA.PROFILES];
}

export async function  clearProfiles() {
    await mutexProfiles.runExclusive(async () => {
        config.GLOBAL_DATA.PROFILES = [];
    });
}

export async function verifyAccess(idsPerfiles: Array<number>, codigosPermisos: string | Array<string>) {
    try {
        if (typeof codigosPermisos === 'string') {
            codigosPermisos = [codigosPermisos];
        }
        const profiles = await getProfiles() as any[];
        if (profiles.length === 0) return false;

        let requiredAccess = new Map();
        let verifiedAccess = new Map();
        for (let c=0; c < codigosPermisos.length; c++) {
            let verified = false;
            for (let p=0; p < profiles.length; p++) {
                for (let i=0; i < profiles[p].permisos.length; i++) {
                    if (profiles[p].permisos[i].codigo === codigosPermisos[c]) {
                        if (!requiredAccess.has(codigosPermisos[c])) requiredAccess.set(codigosPermisos[c], true);
                        if (idsPerfiles.includes(profiles[p].id)) {
                            verifiedAccess.set(codigosPermisos[c], true);
                            verified = true;
                        }
                    }
                    if (verified) break;
                }
                if (verified) break;
            }
        }
        
        return (requiredAccess.size === verifiedAccess.size);
    }
    catch {
        return false;
    }
}