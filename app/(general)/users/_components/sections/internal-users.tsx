import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { EllipsisVertical } from "lucide-react"

const mockedData = [
  {
    name: 'John Admin',
    username: 'superadmin',
    email: 'superadmin@jumpheroez.com',
    role: 'Super Admin',
    lastLogin: '5/14/2023, 8:30:00 AM',
    status: 'Active',
  },
  {
    name: 'Jane Staff',
    username: 'admin',
    email: 'admin@jumpheroez.com',
    role: 'Admin',
    lastLogin: '5/15/2023, 9:15:00 AM',
    status: 'Active',
  },
  {
    name: 'Robert Smith',
    username: 'robert.smith',
    email: 'robert@jumpheroez.com',
    role: 'Admin',
    lastLogin: '5/12/2023, 2:22:00 PM',
    status: 'Active',
  },
  {
    name: 'Sara Johnson',
    username: 'sara.johnson',
    email: 'sara@jumpheroez.com',
    role: 'Admin',
    lastLogin: '5/10/2023, 11:05:00 AM',
    status: 'Inactive',
  }
]

function InternalUsers() {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Internal Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockedData.map((item) =>
                <TableRow>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <Badge>{item.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.lastLogin}
                  </TableCell>
                  <TableCell>
                    <Badge>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <EllipsisVertical width={16} height={16} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}

export default InternalUsers
