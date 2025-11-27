import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { USERS, DEPARTMENTS } from '../../../constants';
import { UserRole } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { DepartmentSyncButton } from '../../dashboard/components/DepartmentSyncButton';

type AdminTab = 'Users' | 'Departments' | 'Roles' | 'Settings' | 'Audit';

const AdminTable: React.FC<{ headers: string[]; data: (string | React.ReactNode)[][]; }> = ({ headers, data }) => (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
                {headers.map(h => <th key={h} scope="col" className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>)}
                <th scope="col" className="relative p-4"><span className="sr-only">Edit</span></th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    {row.map((cell, cellIndex) => <td key={cellIndex} className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{cell}</td>)}
                    <td className="p-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

export const AdminConsole: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('Users');

    const renderContent = () => {
        switch (activeTab) {
            case 'Users':
                return <AdminTable headers={['Name', 'Email', 'Role', 'Department']} data={USERS.map(u => [u.name, u.email, u.role, DEPARTMENTS.find(d => d.id === u.departmentId)?.name || 'N/A'])} />;
            case 'Departments':
                return (
                    <div className="p-6 space-y-6">
                        {/* Sync Button - Đặt trên cùng */}
                        <DepartmentSyncButton />

                        {/* Department Table */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                Danh sách phòng ban
                            </h3>
                            <AdminTable
                                headers={['ID', 'Name']}
                                data={DEPARTMENTS.map(d => [d.id, d.name])}
                            />
                        </div>
                    </div>
                );
            case 'Roles':
                return <AdminTable headers={['Role Name']} data={Object.values(UserRole).map(r => [r])} />;
            case 'Audit':
                return <p className="text-gray-500 dark:text-gray-400 p-4">Audit log viewer would be here.</p>;
            case 'Settings':
                return <p className="text-gray-500 dark:text-gray-400 p-4">System settings configuration would be here.</p>;
            default: return null;
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Console</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage users, permissions, and system configuration.</p>
            </div>
            <Card>
                <CardHeader className="p-0 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2 px-4">
                        {(['Users', 'Departments', 'Roles', 'Audit', 'Settings'] as AdminTab[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-white dark:hover:border-gray-500'
                                    }`}
                            >{tab}</button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {renderContent()}
                </CardContent>
            </Card>
        </div>
    )
}