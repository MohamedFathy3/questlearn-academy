import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiUser, FiUserCheck, FiUsers } from 'react-icons/fi';
import { UserType } from '@/utils/constants';

interface RegisterTabsProps {
  activeTab: UserType;
  onTabChange: (tab: UserType) => void;
}

const RegisterTabs: React.FC<RegisterTabsProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'student' as UserType, label: t('register.accountTypes.student'), icon: FiUser, color: 'green' },
    { id: 'teacher' as UserType, label: t('register.accountTypes.teacher'), icon: FiUserCheck, color: 'blue' },
    { id: 'parent' as UserType, label: t('register.accountTypes.parent'), icon: FiUsers, color: 'purple' },
  ];

  return (
    <div className="flex justify-center gap-4 mb-8 animate-slide-up">
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const colorClasses = {
          green: isActive ? 'bg-green-500 border-green-400 shadow-green-500/30' : '',
          blue: isActive ? 'bg-blue-500 border-blue-400 shadow-blue-500/30' : '',
          purple: isActive ? 'bg-purple-500 border-purple-400 shadow-purple-500/30' : '',
        }[tab.color];

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 border-2 ${
              isActive
                ? `${colorClasses} text-white shadow-lg`
                : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300 shadow-md hover:shadow-lg'
            } animate-bounce-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Icon className="text-xl" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default RegisterTabs;