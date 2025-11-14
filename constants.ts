
import { User, Department, Link, UserRole, LinkStatus, Visibility, AnalyticData } from './types';

export const DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Engineering' },
  { id: 'd2', name: 'Product' },
  { id: 'd3', name: 'Marketing' },
  { id: 'd4', name: 'Sales' },
];

export const USERS: User[] = [
  { id: 'u1', name: 'Alex Johnson', email: 'alex@example.com', role: UserRole.ADMIN, departmentId: 'd1', team: 'Platform', avatarUrl: 'https://i.pravatar.cc/150?u=u1' },
  { id: 'u2', name: 'Brenda Smith', email: 'brenda@example.com', role: UserRole.MANAGER, departmentId: 'd1', team: 'Frontend', avatarUrl: 'https://i.pravatar.cc/150?u=u2' },
  { id: 'u3', name: 'Charles Brown', email: 'charles@example.com', role: UserRole.MEMBER, departmentId: 'd2', team: 'Growth', avatarUrl: 'https://i.pravatar.cc/150?u=u3' },
  { id: 'u4', name: 'Diana Green', email: 'diana@example.com', role: UserRole.VIEWER, departmentId: 'd3', team: 'Content', avatarUrl: 'https://i.pravatar.cc/150?u=u4' },
  { id: 'u5', name: 'Ethan Hunt', email: 'ethan@example.com', role: UserRole.MEMBER, departmentId: 'd1', team: 'Frontend', avatarUrl: 'https://i.pravatar.cc/150?u=u5' },
];

export const CURRENT_USER = USERS[0]; // Alex Johnson (Admin)

export const LINKS: Link[] = [
  {
    id: 'l1',
    title: 'Q3 Engineering Roadmap',
    description: 'The official planning document for all engineering projects in the third quarter.',
    url: 'https://docs.example.com/eng/q3-roadmap',
    owner: USERS[1],
    visibility: Visibility.DEPARTMENT,
    status: LinkStatus.HEALTHY,
    tags: ['planning', 'roadmap', 'engineering'],
    category: 'Documents',
    createdAt: '2023-08-15T10:00:00Z',
    lastAccessedAt: '2023-09-28T14:30:00Z',
    clickCount: 125,
    departmentId: 'd1'
  },
  {
    id: 'l2',
    title: 'Production Kubernetes Cluster',
    description: 'Link to the production Kubernetes dashboard. Access restricted.',
    url: 'https://k8s.prod.example.com',
    owner: USERS[0],
    visibility: Visibility.PRIVATE,
    status: LinkStatus.HEALTHY,
    tags: ['infra', 'prod', 'k8s'],
    category: 'Tools',
    createdAt: '2023-01-20T11:00:00Z',
    lastAccessedAt: '2023-09-29T09:05:00Z',
    clickCount: 78,
    departmentId: 'd1',
    hasMetadataOnlyAccess: true,
  },
  {
    id: 'l3',
    title: 'Marketing Campaign Tracker',
    description: 'Spreadsheet for tracking the performance of ongoing marketing campaigns.',
    url: 'https://sheets.example.com/mktg/campaigns',
    owner: USERS[3],
    visibility: Visibility.DEPARTMENT,
    status: LinkStatus.HEALTHY,
    tags: ['marketing', 'analytics', 'sheets'],
    category: 'Analytics',
    createdAt: '2023-09-01T16:20:00Z',
    lastAccessedAt: '2023-09-27T11:45:00Z',
    clickCount: 210,
    departmentId: 'd3'
  },
  {
    id: 'l4',
    title: 'Old Design System Docs (Archived)',
    description: 'Legacy documentation for the V1 design system. Do not use for new projects.',
    url: 'https://archive.example.com/design-v1',
    owner: USERS[2],
    visibility: Visibility.COMPANY,
    status: LinkStatus.ARCHIVED,
    tags: ['design', 'legacy', 'docs'],
    category: 'Documentation',
    createdAt: '2022-05-10T09:00:00Z',
    lastAccessedAt: '2023-03-15T18:00:00Z',
    clickCount: 35,
    departmentId: 'd2'
  },
  {
    id: 'l5',
    title: 'Customer Feedback Portal',
    description: 'Central hub for all customer feedback and feature requests.',
    url: 'https://feedback.example.com',
    owner: USERS[2],
    visibility: Visibility.COMPANY,
    status: LinkStatus.HEALTHY,
    tags: ['feedback', 'product', 'customer'],
    category: 'Tools',
    createdAt: '2023-07-11T12:00:00Z',
    lastAccessedAt: '2023-09-29T10:10:00Z',
    clickCount: 543,
    departmentId: 'd2'
  },
    {
    id: 'l6',
    title: 'Onboarding Checklist for New Hires',
    description: 'A step-by-step guide for new employees during their first week.',
    url: 'https://hr.example.com/onboarding',
    owner: USERS[0],
    visibility: Visibility.COMPANY,
    status: LinkStatus.PENDING,
    tags: ['hr', 'onboarding', 'new-hire'],
    category: 'Documents',
    createdAt: '2023-09-25T15:00:00Z',
    lastAccessedAt: '2023-09-25T15:00:00Z',
    clickCount: 2,
    departmentId: 'd1'
  },
  {
    id: 'l7',
    title: 'Staging Environment Deployment Tool',
    description: 'Internal tool for deploying new builds to the staging environment.',
    url: 'https://deploy-staging.internal',
    owner: USERS[1],
    visibility: Visibility.TEAM,
    status: LinkStatus.DEAD,
    tags: ['ci-cd', 'staging', 'deploy'],
    category: 'Tools',
    createdAt: '2023-06-01T18:00:00Z',
    lastAccessedAt: '2023-09-20T12:00:00Z',
    clickCount: 92,
    departmentId: 'd1'
  },
];

export const ANALYTICS_DATA: AnalyticData[] = [
  { date: '2023-09-18', clicks: 120 },
  { date: '2023-09-19', clicks: 150 },
  { date: '2023-09-20', clicks: 130 },
  { date: '2023-09-21', clicks: 180 },
  { date: '2023-09-22', clicks: 210 },
  { date: '2023-09-23', clicks: 190 },
  { date: '2023-09-24', clicks: 250 },
  { date: '2023-09-25', clicks: 230 },
  { date: '2023-09-26', clicks: 280 },
  { date: '2023-09-27', clicks: 310 },
  { date: '2023-09-28', clicks: 290 },
  { date: '2023-09-29', clicks: 350 },
];
