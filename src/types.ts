
export enum UserRole {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  MEMBER = 'Member',
  VIEWER = 'Viewer',
}

export enum LinkStatus {
  HEALTHY = 'Healthy',
  DEAD = 'Dead',
  PENDING = 'Pending Approval',
  ARCHIVED = 'Archived',
}

export enum Visibility {
  PRIVATE = 'Private',
  TEAM = 'Team',
  DEPARTMENT = 'Department',
  COMPANY = 'Company',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string;
  team: string;
  avatarUrl: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Link {
  id: string;
  title: string;
  description: string;
  url: string;
  owner: User;
  visibility: Visibility;
  status: LinkStatus;
  tags: string[];
  category: string;
  createdAt: string;
  lastAccessedAt: string;
  clickCount: number;
  departmentId: string;
  hasMetadataOnlyAccess?: boolean;
}

export interface AnalyticData {
  date: string;
  clicks: number;
}
