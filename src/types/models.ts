// Domain models for LinkHUB

export interface Department {
    id: string;
    larkDepartmentId: string;
    name: string;
    nameEn?: string;
    description?: string;
    parentId?: string;
    memberCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface Profile {
    id: string;
    larkUserId: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    mobile?: string;
    employeeNo?: string;
    department?: Department;
    departmentName?: string;
    jobTitle?: string;
    role: 'Admin' | 'Manager' | 'User' | 'Viewer';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
    parentId?: string;
    departmentId?: string;
    visibility: 'Public' | 'Department' | 'Private';
    linkCount: number;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
    color?: string;
    description?: string;
    usageCount: number;
    createdAt: string;
}

export interface Link {
    id: string;
    title: string;
    url: string;
    description?: string;
    notes?: string;
    shortCode?: string;
    qrCodeUrl?: string;
    category?: Category;
    categoryId?: string;
    department: Department;
    departmentId: string;
    owner: Profile;
    ownerId: string;
    createdBy: Profile;
    createdById: string;
    tags: Tag[];
    visibility: 'Public' | 'Department' | 'Team' | 'Private';
    status: 'Active' | 'Pending' | 'Dead' | 'Archived';
    metadata?: Record<string, any>;
    source?: string;
    language: string;
    clickCount: number;
    viewCount: number;
    lastAccessedAt?: string;
    createdAt: string;
    updatedAt: string;
}

// API Request/Response Types

export interface CreateLinkRequest {
    title: string;
    url: string;
    description?: string;
    notes?: string;
    categoryId?: string;
    tagIds?: string[];
    visibility?: 'Public' | 'Department' | 'Team' | 'Private';
    metadata?: Record<string, any>;
}

export interface UpdateLinkRequest {
    title?: string;
    url?: string;
    description?: string;
    notes?: string;
    categoryId?: string;
    tagIds?: string[];
    visibility?: 'Public' | 'Department' | 'Team' | 'Private';
    status?: 'Active' | 'Pending' | 'Dead' | 'Archived';
    metadata?: Record<string, any>;
}

export interface SearchLinksRequest {
    query?: string;
    categoryId?: string;
    tagIds?: string[];
    departmentId?: string;
    status?: 'Active' | 'Pending' | 'Dead' | 'Archived';
    visibility?: 'Public' | 'Department' | 'Team' | 'Private';
    sortBy?: 'created_at' | 'updated_at' | 'click_count' | 'title';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}

export interface SearchLinksResponse {
    links: Link[];
    total: number;
    limit: number;
    offset: number;
}

export interface CreateCategoryRequest {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
    parentId?: string;
    departmentId?: string;
    visibility?: 'Public' | 'Department' | 'Private';
    sortOrder?: number;
}

export interface UpdateCategoryRequest {
    name?: string;
    slug?: string;
    description?: string;
    icon?: string;
    color?: string;
    parentId?: string;
    visibility?: 'Public' | 'Department' | 'Private';
    sortOrder?: number;
}

export interface CreateTagRequest {
    name: string;
    slug: string;
    color?: string;
    description?: string;
}

// Filter types
export interface LinkFilters {
    search?: string;
    categoryId?: string;
    tagIds?: string[];
    status?: 'Active' | 'Pending' | 'Dead' | 'Archived';
    visibility?: 'Public' | 'Department' | 'Team' | 'Private';
}

// Pagination
export interface PaginationParams {
    limit: number;
    offset: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
}
