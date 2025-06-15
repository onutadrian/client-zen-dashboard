
import { useState } from 'react';

export interface Subscription {
  id: number;
  name: string;
  price: number;
  seats: number;
  billingDate: string;
  loginEmail: string;
  password: string;
  category: string;
  totalPaid: number;
  status: string;
  currency: string;
}

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: 1,
      name: "Adobe Creative Suite",
      price: 52.99,
      seats: 2,
      billingDate: "2024-06-15",
      loginEmail: "work@example.com",
      password: "••••••••",
      category: "Design",
      totalPaid: 1200,
      status: "active",
      currency: "USD"
    },
    {
      id: 2,
      name: "Figma Pro",
      price: 12.00,
      seats: 3,
      billingDate: "2024-06-20",
      loginEmail: "work@example.com",
      password: "••••••••",
      category: "Design",
      totalPaid: 600,
      status: "active",
      currency: "USD"
    }
  ]);

  const addSubscription = (newSubscription: any) => {
    setSubscriptions([...subscriptions, { ...newSubscription, id: Date.now(), seats: newSubscription.seats || 1, totalPaid: 0 }]);
  };

  const updateSubscription = (subscriptionId: number, updatedSubscription: any) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === subscriptionId ? updatedSubscription : sub
    ));
  };

  return {
    subscriptions,
    addSubscription,
    updateSubscription
  };
};
