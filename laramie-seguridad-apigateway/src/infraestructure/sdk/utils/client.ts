
export function getIPRemote(req:any) {
    try {
        return req.connection.remoteAddress.toString();
    }
    catch {
        return "";
    }
}

export function getPortRemote(req:any) {
    try {
        return req.connection.remotePort.toString();
    }
    catch {
        return "";
    }
}
