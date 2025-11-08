export type UserType = 'student' | 'teacher' | 'parent';

export const USER_TYPES = {
  STUDENT: 'student' as UserType,
  TEACHER: 'teacher' as UserType,
  PARENT: 'parent' as UserType
};

export const API_ENDPOINTS = {
  student: '/api/student/register',
  teacher: '/api/teachers/register',
  parent: '/api/parent/register'
};

export const STEP_TITLES = {
  student: ['register.steps.personalInfo', 'register.steps.academicInfo'],
  teacher: ['register.steps.personalInfo', 'register.steps.academicInfo', 'register.steps.reviewData'],
  parent: ['register.steps.personalInfo', 'register.steps.completeRegistration'],
};