
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Client } from '@/types/client';
import ClientBasicInfoForm from '@/components/client/ClientBasicInfoForm';
import ClientDocumentsSection from '@/components/client/ClientDocumentsSection';
import ClientLinksSection from '@/components/client/ClientLinksSection';
import ClientPeopleSection from '@/components/client/ClientPeopleSection';
import ClientInvoiceEditSection from '@/components/client/ClientInvoiceEditSection';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onSave: (updatedClient: Client) => void;
}

const EditClientModal = ({ isOpen, onClose, client, onSave }: EditClientModalProps) => {
  const [formData, setFormData] = useState({
    ...client,
    documents: client.documents || [],
    links: client.links || [],
    people: client.people || [],
    invoices: client.invoices || []
  });

  const [newDocument, setNewDocument] = useState({ name: '', url: '', type: 'upload' });
  const [newLink, setNewLink] = useState('');
  const [newPerson, setNewPerson] = useState({ name: '', email: '', title: '' });
  const [newInvoice, setNewInvoice] = useState({ amount: '', date: '', status: 'pending', url: '', currency: 'USD' });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Client name is required';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {client.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <ClientBasicInfoForm 
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />


          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Add notes about this client"
            />
          </div>

          <ClientDocumentsSection 
            formData={formData}
            setFormData={setFormData}
            newDocument={newDocument}
            setNewDocument={setNewDocument}
          />

          <ClientLinksSection 
            formData={formData}
            setFormData={setFormData}
            newLink={newLink}
            setNewLink={setNewLink}
          />

          <ClientPeopleSection 
            formData={formData}
            setFormData={setFormData}
            newPerson={newPerson}
            setNewPerson={setNewPerson}
            errors={errors}
            setErrors={setErrors}
          />

          <ClientInvoiceEditSection 
            formData={formData}
            setFormData={setFormData}
            newInvoice={newInvoice}
            setNewInvoice={setNewInvoice}
            errors={errors}
            setErrors={setErrors}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="primary">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientModal;
