import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const mockedData = [
  {
    title: 'Active Sessions',
    description: '3 started in the last hour',
    total: '12',
  },
  {
    title: 'Players Today',
    description: '+12% from yesterday',
    total: '47',
  },
  {
    title: 'New Sign-ups',
    description: 'New parent accounts today',
    total: '8',
  },
  {
    title: 'Certificates Printed',
    description: 'Todays total',
    total: '31',
  }
]

function DailyStats() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {mockedData.map((item) =>
        <Card key={item.title} className="gap-2">
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{item.total}</p>
            <span className="text-xs text-slate-500">{item.description}</span>
          </CardContent>
        </Card>
      )}
    </section>
  )
}

export default DailyStats
