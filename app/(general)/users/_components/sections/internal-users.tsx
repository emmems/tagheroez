'use client'

import { TableSkeleton } from "@/components/table-skeleton"
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
import type { Employee, EmployeeRole, EmployeeStatus } from "@/src/api/gen/dashboard/v1/users_pb"
import { rpcProvider, useQuery } from "@/src/api/rpc.provider"
import type { Timestamp } from "@bufbuild/protobuf/wkt"
import { useEffect, useState } from "react"
import UserActionsCell from "../user-actions-cell"

function InternalUsers() {
  const {
    data: employeesResponse,
    isFetching: isEmployeesLoading,
  } = useQuery(rpcProvider.userRouter.getEmployees);

  const [employees, setEmployees] = useState<Employee[] | undefined>(undefined);

  console.log("employees: ", employees);

  const hasData = !isEmployeesLoading && employees && employees.length > 0;
  const noData = !isEmployeesLoading && (!employees || employees.length === 0);

  function getRoleView(role: EmployeeRole) {
    switch(role) {
      case 1: // EmployeeRole.SUPER_ADMIN
        return (
          <Badge className="bg-purple-100 text-purple-500">Super Admin</Badge>
        )
      case 0: // EmployeeRole.ADMIN
        return (
          <Badge className="bg-sky-100 text-sky-500">Admin</Badge>
        )
      default:
        return (
          <Badge className="bg-stone-100 text-stone-500">Unknown</Badge>
        )
    }
  }

  function getLastLoginView(lastActiveAt: Timestamp | undefined) {
    if (!lastActiveAt) {
      return <span>N/A</span>;
    }

    let date: Date;

    const seconds = Number(lastActiveAt.seconds);
    const nanos = Number(lastActiveAt.nanos);
    date = new Date(seconds * 1000 + nanos / 1000000);

    if (isNaN(date.getTime())) {
      return (
        <span>Invalid Date</span>
      );
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

    return <span>{formattedDate}</span>;
  }

  function getStatusView(status: EmployeeStatus) {
    switch(status) {
      case 0: // EmployeeStatus.ACTIVE
        return (
          <Badge className="bg-emerald-100 text-emerald-500">Active</Badge>
        )
      case 1: // EmployeeStatus.INACTIVE
        return (
          <Badge className="bg-rose-100 text-rose-500">Inactive</Badge>
        )
      default:
        return (
          <Badge className="bg-stone-100 text-stone-500">Unknown</Badge>
        )
    }
  }

  useEffect(() => {
    if (employeesResponse) {
      console.log('render employees');
      setEmployees(employeesResponse.employees)
    }
  }, [employeesResponse])

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
              {isEmployeesLoading && <TableSkeleton />}

              {noData && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No users found.
                  </TableCell>
                </TableRow>
               )}

              {hasData && employees.map((item) =>
                <TableRow key={item.email}>
                  {/*<TableCell className="font-medium">{item.name}</TableCell>*/}
                  <TableCell className="font-medium">TEST</TableCell>
                  {/*<TableCell>{item.username}</TableCell>*/}
                  <TableCell>test</TableCell>
                  {/*<TableCell>{item.email}</TableCell>*/}
                  <TableCell>test@example.com</TableCell>
                  <TableCell>
                    {getRoleView(item.role)}
                  </TableCell>
                  <TableCell>{getLastLoginView(item.lastActiveAt)}</TableCell>
                  <TableCell>
                    {getStatusView(item.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <UserActionsCell user={item} updateUser={setEmployees} />
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

export default InternalUsers;
