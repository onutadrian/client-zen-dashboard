
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet, FileImage } from 'lucide-react';
import { Project } from '@/hooks/useProjects';

interface ProjectExportOptionsProps {
  project: Project;
}

const ProjectExportOptions = ({ project }: ProjectExportOptionsProps) => {
  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log('Export to PDF');
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export
    console.log('Export to Excel');
  };

  const handleExportSummary = () => {
    // TODO: Implement summary export
    console.log('Export summary');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="w-5 h-5 mr-2" />
          Export Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={handleExportPDF} variant="outline" className="h-auto p-4 flex-col">
            <FileText className="w-8 h-8 mb-2" />
            <span className="font-medium">Export to PDF</span>
            <span className="text-sm text-slate-600">Complete project report</span>
          </Button>

          <Button onClick={handleExportExcel} variant="outline" className="h-auto p-4 flex-col">
            <FileSpreadsheet className="w-8 h-8 mb-2" />
            <span className="font-medium">Export to Excel</span>
            <span className="text-sm text-slate-600">Task and time data</span>
          </Button>

          <Button onClick={handleExportSummary} variant="outline" className="h-auto p-4 flex-col">
            <FileImage className="w-8 h-8 mb-2" />
            <span className="font-medium">Project Summary</span>
            <span className="text-sm text-slate-600">Quick overview document</span>
          </Button>
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <h4 className="font-medium mb-2">Export Options</h4>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• PDF report includes project details, tasks, timeline, and budget information</li>
            <li>• Excel export contains detailed task data and time tracking information</li>
            <li>• Summary document provides a quick project overview for stakeholders</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectExportOptions;
