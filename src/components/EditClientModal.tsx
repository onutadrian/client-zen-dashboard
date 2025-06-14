
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, Upload, Link as LinkIcon } from 'lucide-react';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
  onSave: (updatedClient: any) => void;
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
  const [newInvoice, setNewInvoice] = useState({ amount: '', date: '', status: 'pending', url: '' });

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const addDocument = () => {
    if (newDocument.name.trim()) {
      setFormData({
        ...formData,
        documents: [...formData.documents, { ...newDocument, id: Date.now() }]
      });
      setNewDocument({ name: '', url: '', type: 'upload' });
    }
  };

  const removeDocument = (index: number) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((_: any, i: number) => i !== index)
    });
  };

  const addLink = () => {
    if (newLink.trim()) {
      setFormData({
        ...formData,
        links: [...formData.links, newLink.trim()]
      });
      setNewLink('');
    }
  };

  const removeLink = (index: number) => {
    setFormData({
      ...formData,
      links: formData.links.filter((_: any, i: number) => i !== index)
    });
  };

  const addPerson = () => {
    if (newPerson.name.trim() && newPerson.email.trim()) {
      setFormData({
        ...formData,
        people: [...formData.people, { ...newPerson, id: Date.now() }]
      });
      setNewPerson({ name: '', email: '', title: '' });
    }
  };

  const removePerson = (index: number) => {
    setFormData({
      ...formData,
      people: formData.people.filter((_: any, i: number) => i !== index)
    });
  };

  const addInvoice = () => {
    if (newInvoice.amount && newInvoice.date) {
      setFormData({
        ...formData,
        invoices: [...formData.invoices, { 
          ...newInvoice, 
          amount: parseFloat(newInvoice.amount),
          id: Date.now() 
        }]
      });
      setNewInvoice({ amount: '', date: '', status: 'pending', url: '' });
    }
  };

  const removeInvoice = (index: number) => {
    setFormData({
      ...formData,
      invoices: formData.invoices.filter((_: any, i: number) => i !== index)
    });
  };

  const updateInvoice = (index: number, field: string, value: any) => {
    const updatedInvoices = [...formData.invoices];
    updatedInvoices[index] = { ...updatedInvoices[index], [field]: value };
    setFormData({ ...formData, invoices: updatedInvoices });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {client.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Notes */}
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

          {/* Documents */}
          <div>
            <Label>Documents</Label>
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                <Input
                  placeholder="Document name"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                />
                <Input
                  placeholder="URL or file path"
                  value={newDocument.url}
                  onChange={(e) => setNewDocument({ ...newDocument, url: e.target.value })}
                />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newDocument.type}
                  onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value })}
                >
                  <option value="upload">Upload</option>
                  <option value="link">Link</option>
                </select>
                <Button type="button" onClick={addDocument} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.documents.map((doc: any, index: number) => (
                <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {doc.type === 'upload' ? <Upload className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                    <span className="font-medium">{doc.name || doc}</span>
                    {doc.url && (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm">
                        View
                      </a>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocument(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <Label>Relevant Links</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="Add relevant link"
                />
                <Button type="button" onClick={addLink} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.links.map((link: string, index: number) => (
                <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm truncate">
                    {link}
                  </a>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLink(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* People */}
          <div>
            <Label>Team Members</Label>
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2">
                <Input
                  value={newPerson.name}
                  onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                  placeholder="Name"
                />
                <Input
                  value={newPerson.email}
                  onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                  placeholder="Email"
                />
                <Input
                  value={newPerson.title}
                  onChange={(e) => setNewPerson({ ...newPerson, title: e.target.value })}
                  placeholder="Title"
                />
                <Button type="button" onClick={addPerson} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.people.map((person: any, index: number) => (
                <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                  <div>
                    <div className="font-medium">{person.name}</div>
                    <div className="text-sm text-slate-600">{person.title}</div>
                    <div className="text-xs text-slate-500">{person.email}</div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePerson(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Invoices */}
          <div>
            <Label>Invoices</Label>
            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-2">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                />
                <Input
                  type="date"
                  value={newInvoice.date}
                  onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })}
                />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newInvoice.status}
                  onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
                <Input
                  placeholder="Invoice URL"
                  value={newInvoice.url}
                  onChange={(e) => setNewInvoice({ ...newInvoice, url: e.target.value })}
                />
                <Button type="button" onClick={addInvoice} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.invoices.map((invoice: any, index: number) => (
                <div key={index} className="grid grid-cols-5 gap-2 items-center bg-slate-50 p-3 rounded-lg">
                  <Input
                    type="number"
                    step="0.01"
                    value={invoice.amount}
                    onChange={(e) => updateInvoice(index, 'amount', parseFloat(e.target.value))}
                  />
                  <Input
                    type="date"
                    value={invoice.date}
                    onChange={(e) => updateInvoice(index, 'date', e.target.value)}
                  />
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={invoice.status}
                    onChange={(e) => updateInvoice(index, 'status', e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Invoice URL"
                      value={invoice.url || ''}
                      onChange={(e) => updateInvoice(index, 'url', e.target.value)}
                    />
                    {invoice.url && (
                      <a href={invoice.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                        <LinkIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeInvoice(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientModal;
