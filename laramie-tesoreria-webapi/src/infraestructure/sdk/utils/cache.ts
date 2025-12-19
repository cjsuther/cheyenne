import { Mutex } from 'async-mutex';
import config from '../../../server/configuration/config';

let mutexProfiles = new Mutex();

export async function getCache(key:string) {
    let data = null;
    await mutexProfiles.runExclusive(async () => {
        try {
            if (config.GLOBAL_DATA.CACHE && config.GLOBAL_DATA.CACHE.has(key)) data = config.GLOBAL_DATA.CACHE.get(key);
        }
        catch {}
    });
    
    return data;
}

export async function setCache(key:string, data:any) {
    await mutexProfiles.runExclusive(async () => {
        try {
            if (!config.GLOBAL_DATA.CACHE) config.GLOBAL_DATA.CACHE = new Map<string, any>();
            config.GLOBAL_DATA.CACHE.set(key, data);
        }
        catch {}
    });
}

export async function clearCache() {
    await mutexProfiles.runExclusive(async () => {
        try {
            if (!config.GLOBAL_DATA.CACHE) config.GLOBAL_DATA.CACHE.clear();
        }
        catch {}
    });
}
