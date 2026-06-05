export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
