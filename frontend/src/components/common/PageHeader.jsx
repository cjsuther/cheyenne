export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="border-l-4 border-primary-500 pl-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
