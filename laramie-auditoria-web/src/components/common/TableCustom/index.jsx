import React, { useState, useMemo, useEffect, useImperativeHandle, forwardRef } from 'react';
import { array, string, bool, number, func, object } from 'prop-types';
import { useTable, useGlobalFilter, useSortBy, usePagination, useExpanded } from 'react-table';

import { OpenObjectURL } from '../../../utils/helpers';
import { buildAvmrColumn, buildCheckColumn } from './utils'
import ShowToastMessage from '../../../utils/toast';
import { ALERT_TYPE } from '../../../consts/alertType';
import { APPCONFIG } from '../../../app.config';
import { useAccess } from '../../hooks/useAccess';
import TextEllipsis from '../TextEllipsis';

import './index.scss';


const TableCustom = forwardRef(function TableCustom(props, ref) {

    const [state, setState] = useState({ globalFilter: "" });

    useEffect(() => { setGlobalFilter(state.globalFilter); }, [props.data]);
    useEffect(() => gotoPage(0), [props.data])

    const [selectedAll, setSelectedAll] = useState(false);

    const [hasEditAccess, setHasEditAccess] = useState(props.editCode ? false : true);
    useAccess({
        key: 'TableCustom',
        onLoaded: (data, isSuccess, error) => {
            if (!isSuccess) ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error)
            else if (props.editCode) setHasEditAccess(data.some(x => x.codigo === props.editCode))
        }
    });

    const rt_columns = useMemo(() => {
        let cols = props.columns
        if (props.useSelectedField)
            cols = [buildCheckColumn(props, selectedAll, setSelectedAll), ...props.columns]
        if (props.avmr)
            cols = [...cols, buildAvmrColumn(props.avmr, hasEditAccess && !props.disabled)]

        return cols.map((col, index) => ({
            ...col, id: col.id || `col_${index}`,
        }))
    }, [props.columns, selectedAll, hasEditAccess])
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
                pageSize: props.pageSize
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
    
    const getColumnSortIcon = (column) => {
        if (column.disableSortBy || !column.isSorted) return ''
        else if (column.isSortedDesc) return <span className="material-symbols-outlined float-end">expand_less</span>
        else return <span className="material-symbols-outlined float-end">expand_more</span>
    }

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

    const getCellClassName = (column, isFooter = false) => {
        let name = `${(column.alignCell && column.alignCell === 'right') ? 'align-right' :
            (column.alignCell && column.alignCell === 'center') ? 'align-center' : 'align-left'}`;
        if (column.ellipsis !== false && !isFooter && !['select', 'abm', 'expnader'].includes(column.id))
            name += ' cell-ellipsis';
        if (props.onClickRow)
            name += ' clickable';
        return name
    }

    const handleClickRow = (row, cellId) => {
        if (props.onClickRow) {
            props.onClickRow(row, cellId);
        }
    }

    return (

        <div className={`${props.className}${props.floatingDownloadCSVButton ? ' TableCustomFloatingDownloadCSVButton' : ''}`}>

            {(props.showFilterGlobal || props.showDownloadCSV) && rt_data.length > 0 && (
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
                            <span className="material-symbols-outlined" title="Descargar CSV">download</span>
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
                            <th
                                {...column.getHeaderProps([column.getSortByToggleProps(), { style: { width: column.width, cursor: 'pointer' }, title: ''}])}
                                className={column.ellipsis !== false ? 'cell-ellipsis min-column' : ''}
                            >
                                <div className='table-custom-header-container'>
                                    <TextEllipsis>{column.render('Header')}</TextEllipsis>
                                    {getColumnSortIcon(column)}
                                </div>
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
                                <td
                                    {...cell.getCellProps([{ style: { width: cell.column.width }}])}
                                    className={getCellClassName(cell.column)}
                                    onClick={() => handleClickRow(row, cell.column.id)}
                                >
                                    <TextEllipsis>{cell.render('Cell')}</TextEllipsis>
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
                        <td {...column.getFooterProps()} className={getCellClassName(column, true)}>
                            {column.render('Footer')}
                        </td>
                        ))}
                    </tr>
                    ))}
                </tfoot>
                }
            </table>

            {rt_data.length > props.pageSize && (
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
                        <span className="material-symbols-outlined" style={(!canPreviousPage) ? {opacity:0.8} : {}}>keyboard_double_arrow_left</span>
                    </div>

                    <div onClick={() => (canPreviousPage) ? previousPage() : null} className="link p-right-10">
                        <span className="material-symbols-outlined" style={(!canPreviousPage) ? {opacity:0.8} : {}}>chevron_left</span>
                    </div>

                    <div className='rt-pagecount-current pagecount-text p-right-5'>
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
                        <span className="material-symbols-outlined" style={(!canNextPage) ? {opacity:0.8} : {}}>chevron_right</span>
                    </div>

                    <div onClick={() => (canNextPage) ? gotoPage(pageCount - 1) : null} className="link p-right-10">
                        <span className="material-symbols-outlined" style={(!canNextPage) ? {opacity:0.8} : {}}>keyboard_double_arrow_right</span>
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
    floatingDownloadCSVButton: bool,
    showFilterGlobal: bool,
    showPageSize: bool,
    showPageCountOnlyPage: bool,
    useSelectedField: bool,
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
    avmr: object,
    disabled: bool,
};

TableCustom.defaultProps = {
    showHeader: true,
    showFooter: false,
    showDownloadCSV: true,
    floatingDownloadCSVButton: false,
    showFilterGlobal: true,
    showPageSize: true,
    showPageCountOnlyPage: false,
    useSelectedField: false,
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
    avmr: null,
    disabled: false,
};

export default TableCustom;
