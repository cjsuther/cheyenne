import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from './DataTable';
import LoadingSpinner from './LoadingSpinner';

// ── Estilos ─────────────────────────────────────────────────────────
export const inputClass = 'mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500';
export const btnPrimary = 'bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium';
export const btnDanger = 'bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium';
export const btnSecondary = 'bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-medium';

// ── Modal ───────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50" onClick={onClose}>
      <div
        className={`bg-white sm:rounded-lg shadow-xl w-full ${wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'} max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-t-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b sticky top-0 bg-white z-10">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate pr-2">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl shrink-0">&times;</button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Field ───────────────────────────────────────────────────────────
export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

// ── DynamicSelect (campo select con datos remotos) ──────────────────
function DynamicSelect({ field, value, onChange }) {
  const { data: options, isLoading } = useQuery({
    queryKey: [field.queryKey],
    queryFn: field.queryFn,
    staleTime: 5 * 60 * 1000,
  });

  const vk = field.optionValue || 'id';
  const lk = field.optionLabel || 'nombre';

  return (
    <Field label={field.label}>
      <select value={value ?? ''} onChange={onChange} className={inputClass} required={field.required} disabled={isLoading}>
        <option value="">{isLoading ? 'Cargando...' : 'Seleccionar...'}</option>
        {options?.map((o) => (
          <option key={o[vk]} value={o[vk]}>{o[lk]}</option>
        ))}
      </select>
    </Field>
  );
}

// ── SearchSelect (combo con búsqueda remota, 3+ caracteres) ─────────
function SearchSelect({ field, value, onChange }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const vk = field.optionValue || 'id';
  const lk = field.optionLabel || 'nombre';
  const minChars = field.minChars || 3;

  const enabled = search.length >= minChars;

  const { data: results, isFetching } = useQuery({
    queryKey: [field.queryKey, search],
    queryFn: () => field.searchFn(search).then((r) => r.data),
    enabled,
    staleTime: 30 * 1000,
  });

  // Resolver label del valor actual al montar (edición)
  const { data: currentItem } = useQuery({
    queryKey: [field.queryKey, 'resolve', value],
    queryFn: () => field.getOneFn(value).then((r) => r.data),
    enabled: !!value && !selectedLabel,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (currentItem && !selectedLabel) {
      setSelectedLabel(field.formatLabel ? field.formatLabel(currentItem) : currentItem[lk] || `#${currentItem[vk]}`);
    }
  }, [currentItem]);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (item) => {
    const label = field.formatLabel ? field.formatLabel(item) : item[lk];
    setSelectedLabel(label);
    setSearch('');
    setOpen(false);
    onChange({ target: { value: item[vk] } });
  };

  const handleClear = () => {
    setSelectedLabel('');
    setSearch('');
    onChange({ target: { value: '' } });
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <Field label={field.label}>
      <div ref={wrapperRef} className="relative">
        {value && selectedLabel ? (
          <div className={`${inputClass} flex items-center justify-between`}>
            <span className="truncate text-gray-800">{selectedLabel}</span>
            <button type="button" onClick={handleClear} className="ml-2 text-gray-400 hover:text-gray-600 shrink-0">&times;</button>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
            onFocus={() => { if (search.length >= minChars) setOpen(true); }}
            placeholder={`Escribi ${minChars}+ caracteres para buscar...`}
            className={inputClass}
          />
        )}
        {open && enabled && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {isFetching && (
              <div className="px-3 py-2 text-sm text-gray-500">Buscando...</div>
            )}
            {!isFetching && results?.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">Sin resultados</div>
            )}
            {!isFetching && results?.map((item) => (
              <button
                key={item[vk]}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-primary-50 hover:text-primary-700 transition-colors"
                onClick={() => handleSelect(item)}
              >
                {field.formatLabel ? field.formatLabel(item) : item[lk]}
              </button>
            ))}
          </div>
        )}
      </div>
    </Field>
  );
}

// ── Pagination bar ──────────────────────────────────────────────────
const btnPage = 'px-3 py-1.5 rounded text-xs font-medium transition-colors';
const btnPageActive = `${btnPage} bg-primary-600 text-white`;
const btnPageDisabled = `${btnPage} bg-gray-100 text-gray-400 cursor-not-allowed`;
const btnPageEnabled = `${btnPage} bg-white text-gray-600 hover:bg-gray-50 border border-gray-200`;

function Pagination({ page, setPage, dataLength, pageSize }) {
  const isFirst = page === 0;
  const isLast = !dataLength || dataLength < pageSize;
  return (
    <div className="flex items-center justify-between mt-3">
      <button disabled={isFirst} onClick={() => setPage((p) => p - 1)} className={isFirst ? btnPageDisabled : btnPageEnabled}>Anterior</button>
      <span className="text-xs text-gray-500">Pagina {page + 1}</span>
      <button disabled={isLast} onClick={() => setPage((p) => p + 1)} className={isLast ? btnPageDisabled : btnPageEnabled}>Siguiente</button>
    </div>
  );
}

// ── Filter row ──────────────────────────────────────────────────────
function FilterRow({ columns, filterInputs, setFilterInputs }) {
  const visibleCols = columns.filter((c) => c.key !== '_actions');
  return (
    <div className="bg-white rounded-t-lg border border-b-0 border-gray-200 px-2 py-2 overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {visibleCols.map((col) => (
          <input
            key={col.key}
            placeholder={col.label}
            value={filterInputs[col.key] || ''}
            onChange={(e) => setFilterInputs((prev) => ({ ...prev, [col.key]: e.target.value }))}
            className="w-20 sm:w-auto sm:flex-1 min-w-0 border border-gray-200 rounded px-2 py-1 text-xs placeholder:text-gray-400 focus:ring-1 focus:ring-primary-400 focus:border-primary-400"
          />
        ))}
        <div className="w-[100px] sm:w-[120px] shrink-0" />
      </div>
    </div>
  );
}

// ── CrudTab (tabla con CRUD completo + paginación + filtros) ────────
const PAGE_SIZE = 10;

export function CrudTab({ queryKey, apiFns, columns, formFields, entityName, wide }) {
  const [modal, setModal] = useState(null);
  const [page, setPage] = useState(0);
  const [filterInputs, setFilterInputs] = useState({});
  const [filters, setFilters] = useState({});
  const queryClient = useQueryClient();

  // Debounce filtros: aplica después de 400ms y resetea a página 0
  useEffect(() => {
    const t = setTimeout(() => {
      const clean = {};
      Object.entries(filterInputs).forEach(([k, v]) => { if (v) clean[k] = v; });
      setFilters(clean);
      setPage(0);
    }, 400);
    return () => clearTimeout(t);
  }, [filterInputs]);

  const { data, isLoading } = useQuery({
    queryKey: [queryKey, page, filters],
    queryFn: () => apiFns.list({ skip: page * PAGE_SIZE, limit: PAGE_SIZE, ...filters }).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiFns.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
  });

  // Cargar lookups de todos los remote_select para resolver columnas
  const remoteSelects = formFields.filter((f) => f.type === 'remote_select');
  const lookupResults = useQueries({
    queries: remoteSelects.map((f) => ({
      queryKey: [f.queryKey],
      queryFn: f.queryFn,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const lookupMaps = {};
  remoteSelects.forEach((f, i) => {
    const d = lookupResults[i].data;
    if (d) {
      const vk = f.optionValue || 'id';
      const lk = f.optionLabel || 'nombre';
      lookupMaps[f.key] = Object.fromEntries(d.map((item) => [item[vk], item[lk]]));
    }
  });

  // Para search_select: resolver IDs únicos de la data actual usando getOneFn
  const searchSelects = formFields.filter((f) => f.type === 'search_select' && f.getOneFn);
  const uniqueIds = {};
  searchSelects.forEach((f) => {
    const ids = [...new Set((data || []).map((row) => row[f.key]).filter(Boolean))];
    uniqueIds[f.key] = ids;
  });

  const searchResolveResults = useQueries({
    queries: searchSelects.flatMap((f) =>
      uniqueIds[f.key].map((id) => ({
        queryKey: [f.queryKey, 'resolve', id],
        queryFn: () => f.getOneFn(id).then((r) => r.data),
        staleTime: 5 * 60 * 1000,
      }))
    ),
  });

  let resultIdx = 0;
  searchSelects.forEach((f) => {
    const map = {};
    uniqueIds[f.key].forEach((id) => {
      const item = searchResolveResults[resultIdx]?.data;
      if (item) {
        map[id] = f.formatLabel ? f.formatLabel(item) : item[f.optionLabel || 'nombre'] || `#${id}`;
      }
      resultIdx++;
    });
    if (Object.keys(map).length > 0) lookupMaps[f.key] = map;
  });

  const resolvedColumns = columns.map((col) => {
    if (lookupMaps[col.key] && !col.render) {
      const map = lookupMaps[col.key];
      return { ...col, render: (v) => map[v] ?? v ?? '' };
    }
    return col;
  });

  const allColumns = [
    ...resolvedColumns,
    {
      key: '_actions',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          <button className={btnSecondary} onClick={() => setModal({ mode: 'edit', item: row })}>Editar</button>
          <button className={btnDanger} onClick={() => { if (confirm(`Eliminar ${entityName}?`)) deleteMutation.mutate(row.id); }}>Eliminar</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-3 flex justify-end">
        <button className={btnPrimary} onClick={() => setModal('create')}>Nuevo {entityName}</button>
      </div>
      <FilterRow columns={allColumns} filterInputs={filterInputs} setFilterInputs={setFilterInputs} />
      {isLoading ? <LoadingSpinner /> : <DataTable columns={allColumns} data={data} />}
      <Pagination page={page} setPage={setPage} dataLength={data?.length} pageSize={PAGE_SIZE} />
      {(modal === 'create' || modal?.mode === 'edit') && (
        <CrudFormModal
          title={modal === 'create' ? `Nuevo ${entityName}` : `Editar ${entityName}`}
          item={modal?.item}
          formFields={formFields}
          apiFns={apiFns}
          queryKey={queryKey}
          onClose={() => setModal(null)}
          wide={wide}
        />
      )}
    </>
  );
}

// ── CrudFormModal ───────────────────────────────────────────────────
export function CrudFormModal({ title, item, formFields, apiFns, queryKey, onClose, wide }) {
  const queryClient = useQueryClient();
  const isEdit = !!item;

  const initialForm = {};
  formFields.forEach((f) => {
    initialForm[f.key] = item?.[f.key] ?? f.defaultValue ?? '';
  });

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? apiFns.update(item.id, data) : apiFns.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [queryKey] }); onClose(); },
    onError: (e) => setError(e.response?.data?.detail || 'Error al guardar'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {};
    formFields.forEach((f) => {
      if (f.editOnly === false && isEdit) return;
      const val = form[f.key];
      if (f.type === 'number' || f.type === 'int' || f.type === 'decimal' || f.type === 'remote_select' || f.type === 'search_select') {
        payload[f.key] = val === '' || val === null || val === undefined ? null : Number(val);
      } else if (f.type === 'boolean') {
        payload[f.key] = val === true || val === 'true';
      } else {
        payload[f.key] = val === '' ? null : val;
      }
    });
    mutation.mutate(payload);
  };

  const set = (k, type) => (e) => {
    const val = type === 'boolean' ? e.target.checked : e.target.value;
    setForm({ ...form, [k]: val });
  };

  return (
    <Modal title={title} onClose={onClose} wide={wide}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={wide ? 'grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4' : 'space-y-3 sm:space-y-4'}>
          {formFields.map((f) => {
            if (f.editOnly === false && isEdit) return null;

            if (f.type === 'boolean') {
              return (
                <label key={f.key} className="flex items-center gap-2">
                  <input type="checkbox" checked={!!form[f.key]} onChange={set(f.key, 'boolean')} className="w-4 h-4 text-primary-600 rounded" />
                  <span className="text-sm font-medium text-gray-700">{f.label}</span>
                </label>
              );
            }

            if (f.type === 'remote_select') {
              return (
                <DynamicSelect
                  key={f.key}
                  field={f}
                  value={form[f.key]}
                  onChange={set(f.key)}
                />
              );
            }

            if (f.type === 'search_select') {
              return (
                <SearchSelect
                  key={f.key}
                  field={f}
                  value={form[f.key]}
                  onChange={set(f.key)}
                />
              );
            }

            if (f.type === 'select') {
              return (
                <Field key={f.key} label={f.label}>
                  <select value={form[f.key]} onChange={set(f.key)} className={inputClass} required={f.required}>
                    <option value="">Seleccionar...</option>
                    {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </Field>
              );
            }

            return (
              <Field key={f.key} label={f.label}>
                <input
                  type={f.type === 'number' || f.type === 'int' || f.type === 'decimal' ? 'number' : f.type || 'text'}
                  step={f.type === 'decimal' ? '0.01' : undefined}
                  value={form[f.key] ?? ''}
                  onChange={set(f.key)}
                  required={f.required && !isEdit}
                  className={inputClass}
                />
              </Field>
            );
          })}
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className={btnPrimary}>
            {mutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
