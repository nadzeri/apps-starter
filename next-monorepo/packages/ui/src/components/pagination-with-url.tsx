import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./pagination"
import { match } from "ts-pattern";

export default function PaginationWithUrl({ currentPage, totalPage, previousPageUrl, getPageItemUrl, nextPageUrl }: Props) {
  const pageNumbers = getPagination(currentPage, totalPage);

  return (
    <Pagination className="pt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage === 1 ? "#" : previousPageUrl}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
        {pageNumbers.map((pageNumber, index) =>
          match(pageNumber)
            .with(-1, () => (
              <PaginationItem key={index}>
                <PaginationEllipsis />
              </PaginationItem>
            ))
            .otherwise(() => (
              <PaginationItem key={index}>
                <PaginationLink href={getPageItemUrl(pageNumber)} isActive={pageNumber === currentPage}>
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))
        )}
        <PaginationItem>
          <PaginationNext
            href={currentPage === totalPage ? "#" : nextPageUrl}
            className={currentPage >= totalPage ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}


const getPagination = (currentPage: number, totalPages: number) => {
  const pages: number[] = [];

  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  let start = Math.max(1, currentPage - 1);
  let end = Math.min(totalPages, currentPage + 1);

  if (currentPage === 1) {
    end = Math.min(3, totalPages);
  } else if (currentPage === totalPages) {
    start = Math.max(1, totalPages - 2);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // -1 means we display ellipsis
  if (start > 1) {
    pages.unshift(-1);
  }

  if (end < totalPages) {
    pages.push(-1);
  }

  return pages;
}

interface Props {
  currentPage: number;
  totalPage: number;
  previousPageUrl: string;
  getPageItemUrl: (pageNumber: number) => string;
  nextPageUrl: string;
}