import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    // Extract prev, next, and page links
    const prevLink = links[0];
    const nextLink = links[links.length - 1];
    const pageLinks = links.slice(1, -1);

    // Get current page
    const currentPage = pageLinks.findIndex(link => link.active) + 1;
    const totalPages = pageLinks.length;

    // Generate smart page numbers with ellipsis
    const getPageNumbers = () => {
        const delta = 2; // Number of pages to show around current page
        const range = [];
        const rangeWithDots = [];

        // Always show first page
        range.push(1);

        // Calculate range around current page
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        // Always show last page
        if (totalPages > 1) {
            range.push(totalPages);
        }

        // Add ellipsis where needed
        let prev = 0;
        for (const i of range) {
            if (i - prev === 2) {
                rangeWithDots.push(prev + 1);
            } else if (i - prev !== 1) {
                rangeWithDots.push('...');
            }
            rangeWithDots.push(i);
            prev = i;
        }

        return rangeWithDots;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex justify-center items-center gap-2">
            {/* Previous Button */}
            <Link
                href={prevLink.url || '#'}
                className={`btn btn-sm ${!prevLink.url ? 'btn-disabled' : 'btn-ghost'}`}
                preserveScroll
            >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Previous</span>
            </Link>

            {/* Page Numbers */}
            <div className="join hidden sm:flex">
                {pageNumbers.map((pageNum, index) => {
                    if (pageNum === '...') {
                        return (
                            <button
                                key={`ellipsis-${index}`}
                                className="btn join-item btn-sm btn-disabled"
                                disabled
                            >
                                ...
                            </button>
                        );
                    }

                    const pageLink = pageLinks[pageNum - 1];
                    return (
                        <Link
                            key={pageNum}
                            href={pageLink.url || '#'}
                            className={`btn join-item btn-sm ${
                                pageLink.active ? 'btn-active' : 'btn-ghost'
                            } ${!pageLink.url ? 'btn-disabled' : ''}`}
                            preserveScroll
                        >
                            {pageNum}
                        </Link>
                    );
                })}
            </div>

            {/* Mobile: Show current page info */}
            <div className="sm:hidden">
                <span className="text-sm text-base-content/70">
                    Page {currentPage} of {totalPages}
                </span>
            </div>

            {/* Next Button */}
            <Link
                href={nextLink.url || '#'}
                className={`btn btn-sm ${!nextLink.url ? 'btn-disabled' : 'btn-ghost'}`}
                preserveScroll
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
            </Link>
        </div>
    );
}