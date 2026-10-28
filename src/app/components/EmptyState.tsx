
import type { ReactNode } from "react";


interface EmptyStateProps {

  icon: ReactNode;

  title: string;

  description: string;
  
  action?: { label: string; onClick: () => void };
}


export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
   
    <div
      role="status"
      className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center"
    >
      
      <div className="mb-4 text-primary">{icon}</div>

    
      <h3 className="font-display text-xl font-bold text-primary">{title}</h3>

     
      <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>

     
      {action && (
        
        <button
          type="button"
          onClick={action.onClick}
          className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
