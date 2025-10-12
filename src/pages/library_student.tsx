import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Hero from '@/components/home/hero';

import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download, 
  Eye, 
  Image, 
  Video, 
  File,
  FileText,
  PlayCircle,
  Calendar,
  SortAsc,
  MoreVertical,
  Share2,
  Bookmark
} from "lucide-react";
import { apiFetch } from '@/lib/api';

interface LibraryItem {
  id: number;
  title: string;
  description: string;
  type: string;
  file_path: string;
  file_url: string;
  thumbnail_path: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

interface LibrariesResponse {
  data: LibraryItem[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

const StudentLibraries = () => {
  const { toast } = useToast();
  const [libraries, setLibraries] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchLibraries();
  }, []);

  const fetchLibraries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiFetch<LibrariesResponse>('/student-libraries', {
        method: 'POST'
      });

      if (response.data) {
        setLibraries(response.data);
      } else {
        throw new Error('Failed to fetch libraries');
      }
    } catch (err: any) {
      console.error('Error fetching libraries:', err);
      setError(err.message || 'Failed to load libraries');
      toast({
        title: "Error",
        description: "Failed to load libraries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // تحديد نوع الملف
  const getFileType = (fileUrl: string) => {
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return 'image';
    } else if (['mp4', 'avi', 'mov', 'webm'].includes(extension || '')) {
      return 'video';
    } else if (['pdf', 'doc', 'docx'].includes(extension || '')) {
      return 'document';
    }
    return 'file';
  };

  // فلترة وترتيب البيانات
  const filteredAndSortedLibraries = libraries
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || getFileType(item.file_url) === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const handleDownload = async (item: LibraryItem) => {
    try {
      // إنشاء رابط تحميل
      const link = document.createElement('a');
      link.href = item.file_url;
      link.download = item.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: `Downloading ${item.title}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handlePreview = (item: LibraryItem) => {
    setSelectedItem(item);
    setShowPreview(true);
  };

  const handleShare = async (item: LibraryItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: item.file_url,
        });
      } catch (error) {
        // User canceled share
      }
    } else {
      navigator.clipboard.writeText(item.file_url);
      toast({
        title: "Link Copied!",
        description: "File link copied to clipboard",
        variant: "default",
      });
    }
  };

  // Render Grid View
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredAndSortedLibraries.map((item) => {
        const fileType = getFileType(item.file_url);
        
        return (
          <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
            <CardContent className="p-0">
              {/* File Thumbnail */}
              <div className="relative aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                {fileType === 'image' ? (
                  <img 
                    src={item.file_url} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : fileType === 'video' ? (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-white" />
                  </div>
                )}
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <Button 
                    size="sm" 
                    className="bg-white/90 hover:bg-white text-black"
                    onClick={() => handlePreview(item)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-white/90 hover:bg-white text-black"
                    onClick={() => handleDownload(item)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>

                {/* File Type Badge */}
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-black/70 text-white border-0">
                    {fileType === 'image' && <Image className="w-3 h-3 mr-1" />}
                    {fileType === 'video' && <Video className="w-3 h-3 mr-1" />}
                    {fileType === 'document' && <FileText className="w-3 h-3 mr-1" />}
                    {fileType}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.created_at).toLocaleDateString('ar-SA')}
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleShare(item)}
                      className="hover:text-blue-600 transition-colors"
                    >
                      <Share2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Render List View
  const renderListView = () => (
    <div className="space-y-4">
      {filteredAndSortedLibraries.map((item) => {
        const fileType = getFileType(item.file_url);
        
        return (
          <Card key={item.id} className="group hover:shadow-md transition-shadow duration-300 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                  {fileType === 'image' ? (
                    <img 
                      src={item.file_url} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : fileType === 'video' ? (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <PlayCircle className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <Badge variant="secondary" className="mb-2">
                        {fileType === 'image' && <Image className="w-3 h-3 mr-1" />}
                        {fileType === 'video' && <Video className="w-3 h-3 mr-1" />}
                        {fileType === 'document' && <FileText className="w-3 h-3 mr-1" />}
                        {fileType}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePreview(item)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(item)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleShare(item)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Preview Modal
  const renderPreviewModal = () => {
    if (!selectedItem || !showPreview) return null;

    const fileType = getFileType(selectedItem.file_url);

    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-bold">{selectedItem.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{selectedItem.description}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(false)}
              className="rounded-full w-10 h-10 p-0"
            >
              ✕
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-auto">
            {fileType === 'image' && (
              <img 
                src={selectedItem.file_url} 
                alt={selectedItem.title}
                className="w-full h-auto rounded-lg"
              />
            )}
            
            {fileType === 'video' && (
              <div className="aspect-video bg-black rounded-lg">
                <video 
                  src={selectedItem.file_url} 
                  controls 
                  className="w-full h-full rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            
            {fileType === 'document' && (
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Preview not available for this document</p>
                  <Button 
                    className="mt-4"
                    onClick={() => handleDownload(selectedItem)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Document
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              Added on {new Date(selectedItem.created_at).toLocaleDateString('ar-SA', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => handleShare(selectedItem)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button 
                onClick={() => handleDownload(selectedItem)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل المكتبة...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">
            <p>خطأ: {error}</p>
            <Button onClick={fetchLibraries} className="mt-4">
              حاول مرة أخرى
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Hero />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مكتبتي</h1>
          <p className="text-gray-600">إدارة وتنظيم ملفاتك التعليمية</p>
        </div>

        {/* Controls */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 w-full lg:max-w-md">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="ابحث في المكتبة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              {/* Filters and View Controls */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Filter by Type */}
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">كل الأنواع</option>
                  <option value="image">صور</option>
                  <option value="video">فيديوهات</option>
                  <option value="document">مستندات</option>
                </select>

                {/* Sort */}
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">الأحدث</option>
                  <option value="oldest">الأقدم</option>
                  <option value="name">بالاسم</option>
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-none border-0"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-none border-0"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            عرض {filteredAndSortedLibraries.length} من أصل {libraries.length} عنصر
          </p>
        </div>

        {/* Content */}
        {filteredAndSortedLibraries.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد ملفات</h3>
              <p className="text-gray-600">
                {searchTerm ? "لم يتم العثور على ملفات تطابق بحثك" : "لا توجد ملفات في المكتبة بعد"}
              </p>
            </CardContent>
          </Card>
        ) : (
          viewMode === "grid" ? renderGridView() : renderListView()
        )}

        {/* Preview Modal */}
        {renderPreviewModal()}
      </div>
    </div>
  );
};

export default StudentLibraries;