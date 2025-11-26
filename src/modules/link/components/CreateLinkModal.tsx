import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Link, LinkStatus, Visibility } from '../../../types';
import { DEPARTMENTS } from '../../../constants';

interface CreateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLink: (link: Omit<Link, 'id' | 'owner' | 'createdAt' | 'lastAccessedAt' | 'clickCount'>) => void;
  linkToEdit?: Link;
}

const CreateLinkModal: React.FC<CreateLinkModalProps> = ({ isOpen, onClose, onAddLink, linkToEdit }) => {
    const [title, setTitle] = useState(linkToEdit?.title || '');
    const [url, setUrl] = useState(linkToEdit?.url || '');
    const [description, setDescription] = useState(linkToEdit?.description || '');
    const [tags, setTags] = useState(linkToEdit?.tags.join(', ') || '');
    const [visibility, setVisibility] = useState<Visibility>(linkToEdit?.visibility || Visibility.TEAM);
    const [departmentId, setDepartmentId] = useState(linkToEdit?.departmentId || DEPARTMENTS[0].id);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddLink({
            title,
            url,
            description,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            visibility,
            departmentId,
            category: 'Uncategorized', // Simplified for mock
            status: LinkStatus.PENDING, // New links are pending
            hasMetadataOnlyAccess: false,
        });
        onClose();
        // Reset form
        setTitle('');
        setUrl('');
        setDescription('');
        setTags('');
    }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={linkToEdit ? 'Edit Link' : 'Add New Link'}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input id="url" label="URL" type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" required icon="link-outline"/>
            <Input id="title" label="Title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Q4 Marketing Plan" required icon="text-outline"/>
            <div>
                 <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                 <textarea id="description" rows={3} value={description} onChange={e => setDescription(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="A brief description of the link..."></textarea>
            </div>
            <Input id="tags" label="Tags (comma-separated)" type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="planning, marketing, q4" icon="pricetags-outline"/>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="visibility" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Visibility</label>
                    <select id="visibility" value={visibility} onChange={e => setVisibility(e.target.value as Visibility)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {Object.values(Visibility).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="department" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                    <select id="department" value={departmentId} onChange={e => setDepartmentId(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="primary">{linkToEdit ? 'Save Changes' : 'Submit for Approval'}</Button>
            </div>
        </form>
    </Modal>
  );
};

export default CreateLinkModal;