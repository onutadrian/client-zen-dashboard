import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';

const AddClientModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    priceType: 'hour',
    status: 'active',
    notes: '',
    documents: [],
    links: [],
    people: [],
    invoices: [],
    currency: 'USD'
  });

  const [newDocument, setNewDocument] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newPerson, setNewPerson] = useState({ name: '', email: '', title: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const clientData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      totalHours: 0
    };
    onAdd(clientData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      priceType: 'hour',
      status: 'active',
      notes: '',
      documents: [],
      links: [],
      people: [],
      invoices: [],
      currency: 'USD'
    });
    setNewDocument('');
    setNewLink('');
    setNewPerson({ name: '', email: '', title: '' });
  };

  const addDocument = () => {
    if (newDocument.trim()) {
      setFormData({
        ...formData,
        documents: [...formData.documents, newDocument.trim()]
      });
      setNewDocument('');
    }
  };

  const removeDocument = (index) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((_, i) => i !== index)
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

  const removeLink = (index) => {
    setFormData({
      ...formData,
      links: formData.links.filter((_, i) => i !== index)
    });
  };

  const addPerson = () => {
    if (newPerson.name.trim() && newPerson.email.trim()) {
      setFormData({
        ...formData,
        people: [...formData.people, { ...newPerson }]
      });
      setNewPerson({ name: '', email: '', title: '' });
    }
  };

  const removePerson = (index) => {
    setFormData({
      ...formData,
      people: formData.people.filter((_, i) => i !== index)
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client-name">Client Name *</Label>
              <Input
                id="client-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter client name"
                required
              />
            </div>
            <div>
              <Label htmlFor="client-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="client-price">Price *</Label>
              <Input
                id="client-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="price-type">Price Type</Label>
              <Select value={formData.priceType} onValueChange={(value) => setFormData({ ...formData, priceType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">Per Hour</SelectItem>
                  <SelectItem value="day">Per Day</SelectItem>
                  <SelectItem value="week">Per Week</SelectItem>
                  <SelectItem value="month">Per Month</SelectItem>
                  <SelectItem value="project">Per Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="client-currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="RON">Romanian Lei (RON)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Documents */}
          <div>
            <Label>Documents</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newDocument}
                  onChange={(e) => setNewDocument(e.target.value)}
                  placeholder="Add document name or link"
                />
                <Button type="button" onClick={addDocument} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                  <span className="text-sm">{doc}</span>
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
              {formData.links.map((link, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                  <span className="text-sm truncate">{link}</span>
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
            <Label>People</Label>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
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
                <div className="flex gap-2">
                  <Input
                    value={newPerson.title}
                    onChange={(e) => setNewPerson({ ...newPerson, title: e.target.value })}
                    placeholder="Title"
                  />
                  <Button type="button" onClick={addPerson} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {formData.people.map((person, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                  <div className="text-sm">
                    <span className="font-medium">{person.name}</span>
                    {person.title && <span className="text-slate-600"> - {person.title}</span>}
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

          {/* Notes */}
          <div>
            <Label htmlFor="client-notes">Notes</Label>
            <Textarea
              id="client-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any relevant notes about this client"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Client
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientModal;
