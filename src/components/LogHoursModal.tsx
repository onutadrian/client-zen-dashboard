
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Save } from 'lucide-react';

interface LogHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogHours: (hours: number, description: string, date: string) => void;
  clientName: string;
  priceType: 'hour' | 'day' | 'week' | 'month';
}

const LogHoursModal = ({ isOpen, onClose, onLogHours, clientName, priceType }: LogHoursModalProps) => {
  const [timeValue, setTimeValue] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const getTimeLabel = () => {
    switch (priceType) {
      case 'hour':
        return 'Hours Worked';
      case 'day':
        return 'Days Worked';
      case 'week':
        return 'Weeks Worked';
      case 'month':
        return 'Months Worked';
      default:
        return 'Time Worked';
    }
  };

  const getTimeUnit = () => {
    switch (priceType) {
      case 'hour':
        return 'hours';
      case 'day':
        return 'days';
      case 'week':
        return 'weeks';
      case 'month':
        return 'months';
      default:
        return 'units';
    }
  };

  const getStepValue = () => {
    switch (priceType) {
      case 'hour':
        return '0.25';
      case 'day':
        return '0.5';
      case 'week':
        return '0.25';
      case 'month':
        return '0.1';
      default:
        return '0.1';
    }
  };

  const getMinValue = () => {
    switch (priceType) {
      case 'hour':
        return '0.25';
      case 'day':
        return '0.5';
      case 'week':
        return '0.25';
      case 'month':
        return '0.1';
      default:
        return '0.1';
    }
  };

  const getPlaceholder = () => {
    switch (priceType) {
      case 'hour':
        return 'e.g., 2.5';
      case 'day':
        return 'e.g., 1.5';
      case 'week':
        return 'e.g., 0.5';
      case 'month':
        return 'e.g., 0.3';
      default:
        return 'e.g., 1';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeValue || isNaN(Number(timeValue)) || Number(timeValue) <= 0) {
      return;
    }
    
    // Convert everything to hours for consistent storage
    const convertToHours = (value: number, type: string) => {
      switch (type) {
        case 'hour':
          return value;
        case 'day':
          return value * 8; // 8 hours per day
        case 'week':
          return value * 40; // 40 hours per week
        case 'month':
          return value * 160; // ~160 hours per month (4 weeks)
        default:
          return value;
      }
    };

    const hoursEquivalent = convertToHours(Number(timeValue), priceType);
    onLogHours(hoursEquivalent, description, date);
    setTimeValue('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Log Time for {clientName}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeValue">{getTimeLabel()}</Label>
              <Input
                id="timeValue"
                type="number"
                step={getStepValue()}
                min={getMinValue()}
                placeholder={getPlaceholder()}
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">In {getTimeUnit()}</p>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="What did you work on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Log Time
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LogHoursModal;
