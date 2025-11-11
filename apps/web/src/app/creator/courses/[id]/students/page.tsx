import Link from 'next/link';
import { ArrowLeft, Search, Download } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function StudentsPage({ params }: { params: { id: string } }) {
  const students = [
    { id: 1, name: 'Alice Martin', email: 'alice@example.com', progress: 75, enrolled: '2024-11-01', lastActive: '2024-11-10' },
    { id: 2, name: 'Bob Dupont', email: 'bob@example.com', progress: 45, enrolled: '2024-11-03', lastActive: '2024-11-09' },
    { id: 3, name: 'Claire Bernard', email: 'claire@example.com', progress: 90, enrolled: '2024-10-28', lastActive: '2024-11-10' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link href="/creator/courses" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux cours
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Étudiants inscrits</h1>
            <p className="text-muted-foreground">{students.length} étudiants au total</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent">
            <Download className="h-5 w-5" />
            Exporter CSV
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un étudiant..."
              className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Étudiant</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Progression</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Inscrit le</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Dernière activité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-accent">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{student.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{student.enrolled}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{student.lastActive}</td>
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
