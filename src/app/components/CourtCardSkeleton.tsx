
export function CourtCardSkeleton() {
  return (
 
    <div className="animate-pulse overflow-hidden rounded-2xl border border-line bg-surface" aria-hidden="true">

     
      <div className="aspect-4/3 bg-line" />

      <div className="space-y-3 p-4">

       
        <div className="h-5 w-2/3 rounded bg-line" />

        
        <div className="h-4 w-full rounded bg-line" />

       
        <div className="h-1.5 w-full rounded bg-line" />

        <div className="flex justify-between pt-2">
          
          <div className="h-6 w-24 rounded bg-line" />
         
          <div className="h-9 w-28 rounded-xl bg-line" />
        </div>
      </div>
    </div>
  );
}
