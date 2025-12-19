export const requestEventos = async filters => {
    const params = `/filter` +
        `?idTipoEvento=` +
        `&idModulo=${filters.idModulo ?? ''}` +
        `&idUsuario=${filters.idUsuario ?? ''}` +
        `&fechaDesde=${filters.fechaDesde ?? ''}` +
        `&fechaHasta=${filters.fechaHasta ?? ''}` +
        `&origen=` +
        `&mensaje=`
}