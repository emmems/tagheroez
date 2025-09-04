import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockedData = [
  {
    title: 'Server Status',
    status: 'Online',
  },
  {
    title: 'Internet Connection',
    status: 'Connected',
  },
  {
    title: 'Check-in Kiosk Status',
    status: 'Active',
  },
  {
    title: 'Tag Status',
    status: 'Operational',
  },
]

function SystemStatus() {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockedData.map((item) => <div
            className="flex justify-between place-items-center"
            key={item.title}
          >
            <p className="text-sm">{item.title}</p>
            <Badge className="bg-green-100 text-green-700 font-medium">{item.status}</Badge>
          </div>)}
        </CardContent>
      </Card>
    </section>
  )
}

export default SystemStatus;
