
import React from 'react';
import AddClientModal from './AddClientModal';
import AddSubscriptionModal from './AddSubscriptionModal';
import EditSubscriptionModal from './EditSubscriptionModal';

interface ModalsContainerProps {
  showClientModal: boolean;
  onCloseClientModal: () => void;
  onAddClient: (client: any) => void;
  
  showSubscriptionModal: boolean;
  onCloseSubscriptionModal: () => void;
  onAddSubscription: (subscription: any) => void;
  
  showEditSubscriptionModal: boolean;
  onCloseEditSubscriptionModal: () => void;
  selectedSubscription: any;
  onUpdateSubscription: (id: number, subscription: any) => void;
}

const ModalsContainer = ({
  showClientModal,
  onCloseClientModal,
  onAddClient,
  showSubscriptionModal,
  onCloseSubscriptionModal,
  onAddSubscription,
  showEditSubscriptionModal,
  onCloseEditSubscriptionModal,
  selectedSubscription,
  onUpdateSubscription
}: ModalsContainerProps) => {
  return (
    <>
      <AddClientModal 
        isOpen={showClientModal}
        onClose={onCloseClientModal}
        onAdd={onAddClient}
      />
      
      <AddSubscriptionModal 
        isOpen={showSubscriptionModal}
        onClose={onCloseSubscriptionModal}
        onAdd={onAddSubscription}
      />
      
      <EditSubscriptionModal 
        subscription={selectedSubscription}
        isOpen={showEditSubscriptionModal}
        onClose={onCloseEditSubscriptionModal}
        onUpdate={onUpdateSubscription}
      />
    </>
  );
};

export default ModalsContainer;
