import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isVisible: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isVisible
}) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center items-center gap-2 mt-8 transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="transition-all duration-300 hover:scale-105 disabled:opacity-50"
      >
        <ChevronLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
      </Button>

      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        let pageNum;
        if (totalPages <= 5) {
          pageNum = i + 1;
        } else if (currentPage <= 3) {
          pageNum = i + 1;
        } else if (currentPage >= totalPages - 2) {
          pageNum = totalPages - 4 + i;
        } else {
          pageNum = currentPage - 2 + i;
        }

        return (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(pageNum)}
            className={`transition-all duration-300 hover:scale-105 ${
              currentPage === pageNum ? 'bg-blue-600 text-white' : ''
            }`}
          >
            {pageNum}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="transition-all duration-300 hover:scale-105 disabled:opacity-50"
      >
        <ChevronRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
      </Button>
    </div>
  );
};