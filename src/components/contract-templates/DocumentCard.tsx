
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { GeneratedDocument } from '@/services/contractTemplateService';

interface DocumentCardProps {
  document: GeneratedDocument;
  onDownload: (document: GeneratedDocument) => void;
  onDelete: (documentId: string) => void;
}

const DocumentCard = ({ document, onDownload, onDelete }: DocumentCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="truncate">{document.document_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Generated on {new Date(document.created_at).toLocaleDateString()}
        </p>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(document)}
          >
            <Download className="w-4 h-4 mr-1" />
            Download Word
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Document</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{document.document_name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(document.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
