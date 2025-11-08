import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List, ChevronDown } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Filters } from '@/type/courecses';

interface CoursesFiltersProps {
  filters: Filters;
  searchTerm: string;
  viewMode: "grid" | "list";
  showFilters: boolean;
  categories: string[];
  teachers: string[];
  levels: string[];
  priceRanges: string[];
  onFilterChange: (key: keyof Filters, value: string) => void;
  onSearchChange: (value: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  onClearFilter: (key: keyof Filters) => void;
}

const CoursesFilters: React.FC<CoursesFiltersProps> = ({
  filters,
  searchTerm,
  viewMode,
  showFilters,
  categories,
  teachers,
  levels,
  priceRanges,
  onFilterChange,
  onSearchChange,
  onViewModeChange,
  onToggleFilters,
  onClearFilters,
  onClearFilter
}) => {
  const { t, i18n } = useTranslation();

  const hasActiveFilters = searchTerm || 
    filters.category || 
    filters.level || 
    filters.price || 
    filters.teacher;

  return (
    <>
      {/* Search and Filters Header */}
      <div className="bg-card rounded-xl p-6 shadow-soft mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className={`absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
              <Input 
                placeholder={t('common.search', 'Search courses...')}
                className={`${i18n.language === 'ar' ? 'pr-10' : 'pl-10'} bg-background`}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onToggleFilters}
              className="lg:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              {t('common.filter', 'Filters')}
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => onViewModeChange("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => onViewModeChange("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters Grid */}
        <div className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('courses.category', 'Category')}</label>
              <Select 
                value={filters.category} 
                onValueChange={(value) => onFilterChange('category', value === t('courses.allCategories', 'All Categories').toLowerCase() ? '' : value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={t('courses.allCategories', 'All Categories')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Level Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('courses.level', 'Level')}</label>
              <Select 
                value={filters.level} 
                onValueChange={(value) => onFilterChange('level', value === t('courses.allLevels', 'All Levels').toLowerCase() ? '' : value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={t('courses.allLevels', 'All Levels')} />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level.toLowerCase()}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('courses.price', 'Price')}</label>
              <Select 
                value={filters.price} 
                onValueChange={(value) => onFilterChange('price', value === t('courses.allPrices', 'All Prices').toLowerCase() ? '' : value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={t('courses.allPrices', 'All Prices')} />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range} value={range.toLowerCase()}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Teacher Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('courses.teacher', 'Teacher')}</label>
              <Select 
                value={filters.teacher} 
                onValueChange={(value) => onFilterChange('teacher', value === t('courses.allTeachers', 'All Teachers').toLowerCase() ? '' : value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={t('courses.allTeachers', 'All Teachers')} />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher} value={teacher.toLowerCase()}>
                      {teacher}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('common.sort', 'Sort by')}</label>
              <Select 
                value={filters.sort} 
                onValueChange={(value) => onFilterChange('sort', value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={t('courses.mostPopular', 'Most Popular')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">{t('courses.mostPopular', 'Most Popular')}</SelectItem>
                  <SelectItem value="newest">{t('courses.newest', 'Newest')}</SelectItem>
                  <SelectItem value="rating">{t('courses.highestRated', 'Highest Rated')}</SelectItem>
                  <SelectItem value="price-low">{t('courses.priceLowToHigh', 'Price: Low to High')}</SelectItem>
                  <SelectItem value="price-high">{t('courses.priceHighToLow', 'Price: High to Low')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Applied Filters Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {searchTerm && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {t('common.search', 'Search')}: {searchTerm}
              <button 
                className="ml-2 hover:text-destructive"
                onClick={() => onSearchChange("")}
              >
                ×
              </button>
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {t('courses.category', 'Category')}: {filters.category}
              <button 
                className="ml-2 hover:text-destructive"
                onClick={() => onClearFilter('category')}
              >
                ×
              </button>
            </Badge>
          )}
          {filters.level && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {t('courses.level', 'Level')}: {filters.level}
              <button 
                className="ml-2 hover:text-destructive"
                onClick={() => onClearFilter('level')}
              >
                ×
              </button>
            </Badge>
          )}
          {filters.price && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {t('courses.price', 'Price')}: {filters.price}
              <button 
                className="ml-2 hover:text-destructive"
                onClick={() => onClearFilter('price')}
              >
                ×
              </button>
            </Badge>
          )}
          {filters.teacher && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {t('courses.teacher', 'Teacher')}: {filters.teacher}
              <button 
                className="ml-2 hover:text-destructive"
                onClick={() => onClearFilter('teacher')}
              >
                ×
              </button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={onClearFilters}>
            {t('common.clearAll', 'Clear all filters')}
          </Button>
        </div>
      )}
    </>
  );
};

export default CoursesFilters;