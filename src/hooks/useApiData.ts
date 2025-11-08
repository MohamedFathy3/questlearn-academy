import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '@/lib/api';

interface Country {
  id: number;
  name: string;
  code: string;
  image: string;
  phone_code: string;
}

interface Stage {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
}

interface ApiResponse<T> {
  status: number;
  data: T;
  message?: string;
  success?: boolean;
}

export const useApiData = () => {
  const { t } = useTranslation();
  const [countries, setCountries] = useState<Country[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 [API] Starting to fetch data...');
        
        const [countriesData, stagesData, subjectsData] = await Promise.all([
          apiFetch<ApiResponse<Country[]>>('/country/index', {
            method: 'POST',
            body: { filters: {}, perPage: 100, paginate: true }
          }),
          apiFetch<ApiResponse<Stage[]>>('/stage/index', {
            method: 'POST', 
            body: { filters: {}, perPage: 100, paginate: true }
          }),
          apiFetch<ApiResponse<Subject[]>>('/subject/index', {
            method: 'POST',
            body: { filters: {}, perPage: 100, paginate: true }
          })
        ]);

        console.log('✅ [API] Data fetched successfully');
        console.log('📊 [API] Countries:', countriesData?.data?.length);
        console.log('📊 [API] Stages:', stagesData?.data?.length);
        console.log('📊 [API] Subjects:', subjectsData?.data?.length);

        // معالجة البيانات
        if (countriesData?.status === 200) {
          setCountries(countriesData.data || []);
        }

        if (stagesData?.status === 200) {
          setStages(stagesData.data || []);
        }

        if (subjectsData?.status === 200) {
          setSubjects(subjectsData.data || []);
        }

        toast.success(t('register.messages.successOnLoad'));
        
      } catch (error) {
        console.error('❌ [API] Error loading data:', error);
        const errorMessage = error instanceof Error ? error.message : t('register.messages.errorLoading');
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
        console.log('🏁 [API] Loading completed');
      }
    };

    fetchData();
  }, [t]);

  return { countries, stages, subjects, loading, error };
};