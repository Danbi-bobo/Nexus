import React, { useState } from 'react';
import { departmentSyncService } from '../../../services/department-sync.service';

interface DepartmentSyncButtonProps {
    onSyncComplete?: () => void;
}

export const DepartmentSyncButton: React.FC<DepartmentSyncButtonProps> = ({ onSyncComplete }) => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSync = async () => {
        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const response = await departmentSyncService.syncDepartments();

            if (response.success) {
                setResult(
                    `✓ Sync thành công!\n` +
                    `- Tìm thấy: ${response.summary?.total_found} phòng ban\n` +
                    `- Đã sync: ${response.summary?.synced}\n` +
                    `- Lỗi: ${response.summary?.errors}`
                );
                onSyncComplete?.(); // Refresh department list
            } else {
                setError(response.error || 'Sync thất bại');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Đồng bộ phòng ban từ Lark
            </h3>

            <button
                onClick={handleSync}
                disabled={loading}
                className={`
          px-4 py-2 rounded-md font-medium transition-colors
          ${loading
                        ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }
        `}
            >
                {loading ? 'Đang đồng bộ...' : 'Đồng bộ ngay'}
            </button>

            {result && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                    <pre className="text-sm text-green-800 dark:text-green-200 whitespace-pre-wrap">
                        {result}
                    </pre>
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
            )}

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Chức năng này sẽ kéo toàn bộ cấu trúc phòng ban từ Lark về database.
                Chỉ admin mới nên sử dụng.
            </p>
        </div>
    );
};