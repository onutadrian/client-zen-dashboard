
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

const AddClientModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    priceType: 'hour',
    status: 'active',
    notes: '',
    totalHours: 0
  });

  const [documents, setDocuments] = useState([]);
  const [links, setLinks] = useState([]);
  const [people, setPeople] = useState([]);
  const [newDocument, setNewDocument] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newPerson, setNewPerson] = useState({ name: '', email: '', title: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const clientData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      totalHours: parseInt(formData.totalHours) || 0,
      documents,
      links,
      people,
      invoices: []
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
      totalHours: 0
    });
    setDocuments([]);
    setLinks([]);
    setPeople([]);
    setNewDocument('');
    setNewLink('');
    setNewPerson({ name: '', email: '', title: '' });
  };

  const addDocument = () => {
    if (newDocument.trim()) {
      setDocuments([...documents, newDocument.trim()]);
      setNewDocument('');
    }
  };

  const addLink = () => {
    if (newLink.trim()) {
      setLinks([...links, newLink.trim()]);
      setNewLink('');
    }
  };

  const addPerson = () => {
    if (newPerson.name && newPerson.email) {
      setPeople([...people, { ...newPerson }]);
      setNewPerson({ name: '', email: '', title: '' });
    }
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const removeLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const removePerson = (index) => {
    setPeople(people.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Client Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="priceType">Price Type</Label>
              <Select value={formData.priceType} onValueChange={(value) => setFormData({ ...formData, priceType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">Per Hour</SelectItem>
                  <SelectItem value="day">Per Day</SelectItem>
                  <SelectItem value="week">Per Week</SelectItem>
                  <SelectItem value="month">Per Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Total Hours */}
          <div>
            <Label htmlFor="totalHours">Total Hours Worked</Label>
            <Input
              id="totalHours"
              type="number"
              value={formData.totalHours}
              onChange={(e) => setFormData({ ...formData, totalHours: e.target.value })}
            />
          </div>

          {/* Documents */}
          <div>
            <Label>Documents</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Document name (e.g. Contract.pdf)"
                value={newDocument}
                onChange={(e) => setNewDocument(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDocument())}
              />
              <Button type="button" onClick={addDocument} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {documents.map((doc, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {doc}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeDocument(index)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <Label>Relevant Links</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="https://example.com"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
              />
              <Button type="button" onClick={addLink} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {links.map((link, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {link}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeLink(index)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* People */}
          <div>
            <Label>Team Members</Label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <Input
                placeholder="Name"
                value={newPerson.name}
                onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
              />
              <Input
                placeholder="Email"
                type="email"
                value={newPerson.email}
                onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Title"
                  value={newPerson.title}
                  onChange={(e) => setNewPerson({ ...newPerson, title: e.target.value })}
                />
                <Button type="button" onClick={addPerson} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {people.map((person, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                  <div>
                    <span className="font-medium">{person.name}</span>
                    {person.title && <span className="text-slate-600"> - {person.title}</span>}
                    <div className="text-sm text-slate-500">{person.email}</div>
                  </div>
                  <X className="w-4 h-4 cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => removePerson(index)} />
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes about this client..."
              rows={3}
            />
          </div>

          {/* Actions */}
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
