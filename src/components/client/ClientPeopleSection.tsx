
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

interface ClientPeopleSectionProps {
  formData: any;
  setFormData: (data: any) => void;
  newPerson: any;
  setNewPerson: (person: any) => void;
  errors: {[key: string]: string};
  setErrors: (errors: {[key: string]: string}) => void;
}

const ClientPeopleSection = ({ formData, setFormData, newPerson, setNewPerson, errors, setErrors }: ClientPeopleSectionProps) => {
  const addPerson = () => {
    if (newPerson.name.trim() && newPerson.email.trim()) {
      if (!/\S+@\S+\.\S+/.test(newPerson.email)) {
        setErrors({...errors, personEmail: 'Please enter a valid email address'});
        return;
      }
      setFormData({
        ...formData,
        people: [...formData.people, { ...newPerson, id: Date.now() }]
      });
      setNewPerson({ name: '', email: '', title: '' });
      const newErrors = {...errors};
      delete newErrors.personEmail;
      setErrors(newErrors);
    }
  };

  const removePerson = (index: number) => {
    setFormData({
      ...formData,
      people: formData.people.filter((_: any, i: number) => i !== index)
    });
  };

  return (
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
            className={errors.personEmail ? 'border-red-500' : ''}
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
        {errors.personEmail && <p className="text-red-500 text-sm">{errors.personEmail}</p>}
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
  );
};

export default ClientPeopleSection;
