import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge, Card } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  CheckSquare, 
  Trash2, 
  Edit3, 
  Search, 
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../utils/cn';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
}



export const DashboardPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const queryClient = useQueryClient();

  // Fetch Tasks
  const { data, isLoading } = useQuery({
    queryKey: ['tasks', page, status, search],
    queryFn: async () => {
      const response = await api.get('/tasks', {
        params: { page, limit: 6, status, search }
      });
      return response.data;
    },
  });

  // Create Task
  const createMutation = useMutation({
    mutationFn: (newTask: { title: string; description?: string }) => api.post('/tasks', newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      handleCloseModal();
    },
  });

  // Update Task
  const updateMutation = useMutation({
    mutationFn: (task: { id: string; title: string; description?: string }) => 
      api.patch(`/tasks/${task.id}`, { title: task.title, description: task.description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      handleCloseModal();
    },
  });

  // Toggle Status
  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/tasks/${id}/toggle`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  // Delete Task
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description || '');
    } else {
      setEditingTask(null);
      setTitle('');
      setDescription('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setTitle('');
    setDescription('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, title, description });
    } else {
      createMutation.mutate({ title, description });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Tasks</h1>
          <p className="text-slate-500 text-sm">Manage your daily goals and track progress</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-primary-200">
          <Plus className="mr-2 h-4 w-4" />
          Add New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-10 h-10 border-slate-100 bg-slate-50 focus:bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <select 
            className="h-10 px-3 pr-8 rounded-lg border border-slate-100 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Task Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-48 rounded-xl bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : data?.tasks.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.tasks.map((task: Task) => (
              <Card key={task.id} className="p-6 flex flex-col group h-full">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant={task.status === 'COMPLETED' ? 'success' : 'warning'}>
                    {task.status}
                  </Badge>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleOpenModal(task)}
                    >
                      <Edit3 className="h-4 w-4 text-slate-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:text-red-600 hover:bg-red-50"
                      onClick={() => deleteMutation.mutate(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 cursor-pointer" onClick={() => toggleMutation.mutate(task.id)}>
                   <div className="flex gap-3">
                    <div className="mt-1">
                      {task.status === 'COMPLETED' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <h3 className={cn(
                        "font-semibold text-slate-900 decoration-slate-300 transition-all",
                        task.status === 'COMPLETED' && "line-through text-slate-400"
                      )}>
                        {task.title}
                      </h3>
                      <p className={cn(
                        "text-sm text-slate-500 mt-1 line-clamp-2",
                        task.status === 'COMPLETED' && "text-slate-300"
                      )}>
                        {task.description || "No description provided."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                  <div className="font-medium text-slate-500">
                    ID: {task.id.slice(0, 8)}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium text-slate-600">
                Page {page} of {data.pagination.totalPages}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === data.pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
            <CheckSquare className="h-10 w-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No tasks found</h3>
          <p className="text-slate-500 max-w-sm mt-2">
            Tasks you create will show up here. Start by adding your first task!
          </p>
          <Button onClick={() => handleOpenModal()} className="mt-8">
            <Plus className="mr-2 h-4 w-4" />
            Add New Task
          </Button>
        </div>
      )}

      {/* Task Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingTask ? 'Edit Task' : 'New Task'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Title"
            placeholder="Review weekly goals"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              className="w-full min-h-[120px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-slate-400"
              placeholder="Provide more context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingTask ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
