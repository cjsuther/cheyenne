import React, { useState, useMemo, useEffect, useImperativeHandle, forwardRef } from 'react';
import { array, string, bool, number, func } from 'prop-types';
import { useTable, useGlobalFilter, useSortBy, usePagination, useExpanded } from 'react-table';
import { OpenObjectURL } from '../../../utils/helpers';

import './index.scss';
import { buildCheckColumn } from './utils'
import ShowToastMessage from '../../../utils/toast';
import { ALERT_TYPE } from '../../../consts/alertType';
import { APPCONFIG } from '../../../app.config';


const TableCustom = forwardRef(function TableCustom(props, ref) {

    const [state, setState] = useState({ globalFilter: "" });

    useEffect(() => { setGlobalFilter(state.globalFilter); }, [props.data]);

    const [selectedAll, setSelectedAll] = useState(false)

    const rt_columns = useMemo(() => {
        let cols = props.columns
        if (props.useSelectedField)
            cols = [buildCheckColumn(props, selectedAll, setSelectedAll), ...props.columns]

        return cols.map((col, index) => ({
            ...col, id: col.id || `col_${index}`,
        }))
    }, [props.columns, selectedAll])
    const rt_data = useMemo(() => {
        const maxDataSize = APPCONFIG.GENERAL.MAX_DATA_SIZE;
        if (props.limitDataSize && props.data.length > maxDataSize) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, `Se han superado los ${maxDataSize} registros, debe agregar más filtros`)
            return []
        }

        return props.data
    }, [props.data]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        prepareRow,
        visibleColumns,
        //global filter
        setGlobalFilter,
        //pagination
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize }
    } = useTable({
            columns: rt_columns,
            data: rt_data,
            autoResetExpanded: false,
            autoResetPage: false,
            initialState: {
                pageIndex: props.pageIndex,
                pageSize: (props.showPagination) ? props.pageSize : 1000000
            }
        },
        useGlobalFilter,
        useSortBy,
        useExpanded,
        usePagination
    );

    const resetSelections = () => {
        setSelectedAll(false)
        props.onItemsSelected(props.data.map(x => ({ id: x.id, selected: false })))
    }

    useEffect(resetSelections, [pageIndex, pageSize, props.data.length])

    useImperativeHandle(ref, () => ({
        manualReset: () => {
            setSelectedAll(false)
            gotoPage(0)
        },
    }))
    
    const notSort = <i className="fa fa-angle-right"></i>
    const ascSort = <i className="fa fa-angle-up"></i>
    const descSort = <i className="fa fa-angle-down"></i>

    const onClickCSV = () => {
        const filteredColumns = rt_columns.filter(col => !['index', 'id'].includes(col.accessor))
        let csv = ''
	 

        csv += filteredColumns.map(col => `"${col.Header}"`).join(';') + '\n'
        rt_data.forEach(row => {
            const result = []
            filteredColumns.forEach(col => {
                try {
                    if (col.Cell) result.push(col.Cell({
                        row: {
                            original: row
                        },
                        value: row[col.accessor]
                    }))
                    else result.push(row[col.accessor])
                }
                catch {
                    result.push("ERROR");
                }
            })
            csv += result.join(';') + '\n'
        })
        OpenObjectURL(props.csvName, new Blob(['\ufeff' + csv], { type: 'text/csv' }))
    }

    const getClassNameAlignCell = (column) => {
        return `${(column.alignCell && column.alignCell === 'right') ? 'align-right' :
                  (column.alignCell && column.alignCell === 'center') ? 'align-center' : 'align-left'}`;
    }

    const handleClickRow = (row, cellId) => {
        if (props.onClickRow) {
            props.onClickRow(row, cellId);
        }
    }

    return (

        <div className={props.className}>

            {(props.showFilterGlobal || props.showDownloadCSV) && (
                <div className='rt-utilities'>
                    {props.showFilterGlobal && (
                        <div className='rt-globalFilter'>
                            <input
                                className='form-control'
                                placeholder='Buscar...'
                                value={state.globalFilter}
                                onChange={e => {
                                    setState({ globalFilter: e.target.value} );
                                    setGlobalFilter(e.target.value);
                                }}
                            />
                        </div>
                    )}

                    {props.showDownloadCSV && 
                        <div className="rt-download link" onClick={ (event) => onClickCSV() }>
                            <i className="fa fa-download" title="descargar CSV"></i>
                        </div>
                    }
                </div>
            )}

            <table {...getTableProps()}>
                {props.showHeader &&
                <thead>
                    {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps([column.getSortByToggleProps(), { style: { width: column.width, cursor: 'pointer' }, title: ''}])}>
                            {column.render('Header')}
                            {column.disableSortBy ? '' : column.isSorted ? column.isSortedDesc ? descSort : ascSort : notSort}
                        </th>
                        ))}
                    </tr>
                    ))}
                </thead>
                }
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                    prepareRow(row)
                    return (
                        <React.Fragment key={i}>
                            <tr className='rt-tr-row' {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return (
                                <td {...cell.getCellProps([{ style: { width: cell.column.width }}])} className={getClassNameAlignCell(cell.column)} onClick={() => handleClickRow(row, cell.column.id)}>
                                    {cell.render('Cell')}
                                </td>
                                )
                            })}
                            </tr>
                            {row.isExpanded ? (
                                <tr className='rt-tr-expanded'>
                                    <td colSpan={visibleColumns.length}>
                                        {props.subComponent({ row })}
                                    </td>
                                </tr>
                            ) : null}
                        </React.Fragment>
                    )
                    })}
                    {page.length === 0 ? (
                        <tr>
                            <td colSpan={visibleColumns.length} className="empty-row">
                            {props.messageEmpty}
                            </td>
                        </tr>
                    ) : null}
                </tbody>
                {props.showFooter &&
                <tfoot>
                    {footerGroups.map(footerGroup => (
                    <tr {...footerGroup.getFooterGroupProps()}>
                        {footerGroup.headers.map(column => (
                        <td {...column.getFooterProps()} className={getClassNameAlignCell(column)}>
                            {column.render('Footer')}
                        </td>
                        ))}
                    </tr>
                    ))}
                </tfoot>
                }
            </table>

            {props.showPagination && (
            <div className='rt-page'>

                {props.showPageSize && (
                <div className='rt-pagesize'>
                    <select
                        className='form-control'
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value))
                        }}
                        >
                        {[  {key: 5, value: '5'},
                            {key: 10, value: '10'},
                            {key: 25, value: '25'},
                            {key: 50, value: '50'},
                            {key: rt_data.length, value: 'todos'}
                        ].map((item, index) => (
                            <option key={index} value={item.key}>
                                Mostrar {item.value} registros
                            </option>
                        ))}
                    </select>
                </div>
                )}

                {(!props.showPageCountOnlyPage || pageOptions.length > 1) && (
                <div className='rt-pagecount'>
                    <div onClick={() => (canPreviousPage) ? gotoPage(0) : null } className="link p-right-10">
                        <i className="fa fa-angle-double-left" style={(!canPreviousPage) ? {opacity:0.8} : {}}></i>
                    </div>

                    <div onClick={() => (canPreviousPage) ? previousPage() : null} className="link p-right-10">
                        <i className="fa fa-angle-left" style={(!canPreviousPage) ? {opacity:0.8} : {}}></i>
                    </div>

                    <div className='rt-pagecount-current pagecount-text p-right-10'>
                        <input
                            className='form-control'
                            type="text"
                            value={pageIndex + 1}
                            min={1}
                            max={pageCount}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                gotoPage(page)
                            }}
                            style={{ width: '75px' }}
                        />&nbsp;/&nbsp;{pageOptions.length}
                    </div>

                    <div onClick={() => (canNextPage) ? nextPage() : null} className="link p-right-10">
                        <i className="fa fa-angle-right" style={(!canNextPage) ? {opacity:0.8} : {}}></i>
                    </div>

                    <div onClick={() => (canNextPage) ? gotoPage(pageCount - 1) : null} className="link p-right-20">
                        <i className="fa fa-angle-double-right" style={(!canNextPage) ? {opacity:0.8} : {}}></i>
                    </div>

                </div>
                )}
                
            </div>
            )}

        </div>

    )
})

TableCustom.propTypes = {
    showHeader: bool,
    showFooter: bool,
    showDownloadCSV: bool,
    showFilterGlobal: bool,
    showPagination: bool,
    showPageSize: bool,
    showPageCountOnlyPage: bool,
    limitDataSize: bool,
    pageSize: number,
    pageIndex: number,
    className: string,
    messageEmpty: string,
    columns: array,
    data: array,
    subComponent: func,
    csvName: string,
    onClickRow: func,
    onItemsSelected: func,
};

TableCustom.defaultProps = {
    showHeader: true,
    showFooter: false,
    showDownloadCSV: true,
    showFilterGlobal: true,
    showPagination: true,
    showPageSize: true,
    showPageCountOnlyPage: false,
    limitDataSize: false,
    pageSize: 10,
    pageIndex: 0,
    className: "",
    messageEmpty: "Sin registros",
    columns: [],
    data: [],
    subComponent: null,
    csvName: 'datos',
    onClickRow: null,
    onItemsSelected: () => {},
};

export default TableCustom;
