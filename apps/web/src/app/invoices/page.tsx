import Link from 'next/link';
import { Download } from 'lucide-react';

export default function InvoicesPage() {
  const invoices = [
    { id: 'INV-001', date: '2024-11-10', amount: '99.99€', course: 'Maîtriser React et Next.js', status: 'Payé' },
    { id: 'INV-002', date: '2024-10-15', amount: '79.99€', course: 'Python pour la Data Science', status: 'Payé' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="text-xl font-bold">Brainow</Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Historique des factures</h1>

        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="p-4 text-left font-semibold">Numéro</th>
                  <th className="p-4 text-left font-semibold">Date</th>
                  <th className="p-4 text-left font-semibold">Description</th>
                  <th className="p-4 text-left font-semibold">Montant</th>
                  <th className="p-4 text-left font-semibold">Statut</th>
                  <th className="p-4 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border last:border-0">
                    <td className="p-4 font-medium">{invoice.id}</td>
                    <td className="p-4 text-muted-foreground">{invoice.date}</td>
                    <td className="p-4">{invoice.course}</td>
                    <td className="p-4 font-semibold">{invoice.amount}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <Download className="h-4 w-4" />
                        Télécharger
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
