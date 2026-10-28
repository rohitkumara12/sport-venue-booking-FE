
const STEPS = [
  {
    title: "Pilih lapangan dan jam",
    text: "Cari lapangan, pilih tanggal, lalu pilih jam yang masih kosong.",
  },
  {
    title: "Bayar dan unggah bukti",
    text: "Setelah checkout, kamu punya 30 menit untuk mengunggah bukti bayar. Lewat dari itu, pesanan kedaluwarsa dan jamnya dibuka lagi.",
  },
  {
    title: "Tunggu konfirmasi admin",
    text: "Admin memeriksa bukti bayar. Kamu menerima email saat pesanan diterima atau ditolak.",
  },
];

export function HowItWorks() {
  return (
   
    <section id="cara-memesan" className="scroll-mt-20 border-t border-line bg-surface">

    
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">

        
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-primary">Cara memesan</h2>

        
        <ol className="mt-8 grid gap-8 md:grid-cols-3">

        
          {STEPS.map((step, index) => (
            
            <li key={step.title} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-display text-lg font-extrabold text-primary">
                {index + 1}
              </span>

             
              <div>
                <h3 className="font-display text-lg font-bold text-primary">{step.title}</h3>

               
                <p className="mt-1 text-sm leading-relaxed text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
