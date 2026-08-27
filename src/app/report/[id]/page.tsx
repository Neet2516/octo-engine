export default function ReportPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-surface-1 text-white flex items-center justify-center">
      <p className="text-muted">Report {params.id} — built in T09</p>
    </main>
  )
}
