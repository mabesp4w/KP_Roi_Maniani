import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Table({
    headers,
    data,
    renderRow,
    emptyMessage = 'Tidak ada data',
    emptyColSpan,
    sortConfig,
    onSort,
    className = '',
}) {
    return (
        <div className={`overflow-x-auto ${className}`.trim()}>
            <table className="table table-zebra">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className={
                                    header.sortable
                                        ? 'cursor-pointer hover:bg-base-200'
                                        : ''
                                }
                                onClick={() => header.sortable && onSort && onSort(header.key)}
                            >
                                <div className="flex items-center gap-1">
                                    {header.label}
                                    {header.sortable && sortConfig?.key === header.key && (
                                        sortConfig.direction === 'asc' ? (
                                            <ChevronUp size={16} />
                                        ) : (
                                            <ChevronDown size={16} />
                                        )
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={emptyColSpan || headers.length} className="py-8 text-center">
                                <div className="text-base-content/60">{emptyMessage}</div>
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => renderRow(item, index))
                    )}
                </tbody>
            </table>
        </div>
    );
}