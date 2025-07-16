import React, { useState } from 'react';
import { FolderClosed, Plus } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function ProjectForm({ project, setProject, disabled = false }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });

  const handleAddProject = () => {
    // In a real app, we would save the project to the database
    // For demo purposes, we'll just set a fake ID and use the project
    const projectWithId = {
      ...newProject,
      _id: `project_${Date.now()}`
    };
    setProject(projectWithId);
    setIsAdding(false);
  };

  if (disabled) {
    return (
      <div className="space-y-2">
        <Label htmlFor="project">Project</Label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center border border-slate-200 rounded-md px-4 py-3 bg-slate-50/50 text-muted-foreground opacity-70">
            <FolderClosed className="mr-2 h-4 w-4" />
            No project selected
          </div>
          <p className="text-xs text-amber-500">
            Select a client first to add a project
          </p>
        </div>
      </div>
    );
  }

  if (project) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-base font-medium">Project</Label>
          <Button variant="ghost" size="sm" onClick={() => setProject(null)}>
            Change
          </Button>
        </div>
        
        <div className="p-4 border border-slate-200 rounded-md bg-slate-50/50">
          <h3 className="font-medium text-base">{project.name}</h3>
          {project.description && (
            <p className="mt-2 text-sm text-slate-600">{project.description}</p>
          )}
        </div>
      </div>
    );
  }

  if (isAdding) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-base font-medium">Add New Project</Label>
          <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
            Cancel
          </Button>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="projectName">Project Name</Label>
            <Input 
              id="projectName" 
              value={newProject.name}
              onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Project name"
            />
          </div>
          
          <div>
            <Label htmlFor="projectDescription">Description</Label>
            <Textarea 
              id="projectDescription"
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Project description"
            />
          </div>
          
          <Button 
            className="w-full mt-2" 
            onClick={handleAddProject}
            disabled={!newProject.name}
          >
            Add Project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="project" className="text-base font-medium">Project</Label>
      
      <div className="flex flex-col gap-3">
        <Button variant="outline" className="w-full" onClick={() => {
          setProject({
            _id: 'project_12345',
            name: 'Webdev',
            description: 'Strategic technology advisory services for digital transformation'
          });
        }}>
          <FolderClosed className="mr-2 h-4 w-4" />
          Quick Select Demo Project
        </Button>
        
        <Button variant="secondary" className="w-full" onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Project
        </Button>
      </div>
    </div>
  );
}