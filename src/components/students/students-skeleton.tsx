import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const StudentsSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 8 }, (_, index) => (
        <Card key={index} className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="text-center pt-8 pb-4">
            <div className="relative mx-auto mb-4">
              <Skeleton className="w-20 h-20 rounded-full" />
            </div>
            <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
            <div className="flex flex-col gap-2 mt-2">
              <Skeleton className="h-5 w-1/2 mx-auto" />
              <Skeleton className="h-5 w-2/3 mx-auto" />
              <Skeleton className="h-5 w-1/3 mx-auto" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i}>
                  <Skeleton className="h-6 w-8 mx-auto mb-1" />
                  <Skeleton className="h-4 w-12 mx-auto" />
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};