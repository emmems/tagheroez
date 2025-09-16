'use client'

import { TableSkeleton } from "@/components/table-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { User } from "@/src/api/gen/dashboard/v1/users_pb";

interface ParentsTableProps {
  parents: User[];
  isParentsLoading: boolean;
}

function ParentsTable({ parents, isParentsLoading } : ParentsTableProps) {
  // const {
  //   data: parentsResponse,
  //   isFetching: isParentsLoading,
  // } = useQuery(rpcProvider.userRouter.getUsers);

  // const [parents, setParents] = useState<User[] | undefined>(undefined);
  // console.log("parents: ", parents);

  const hasData = !isParentsLoading && parents && parents.length > 0;
  const noData = !isParentsLoading && (!parents || parents.length === 0);

  // function getConsentsView(consents: any) {}

  // useEffect(() => {
  //   if (parentsResponse) {
  //     console.log('render parents');
  //     setParents(parentsResponse.users)
  //   }
  // }, [parentsResponse])

  return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Parents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Children</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Consents</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
               {isParentsLoading && <TableSkeleton />}

              {noData && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No parents found.
                  </TableCell>
                </TableRow>
               )}

               {hasData && parents.map((item) =>
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  {/*<TableCell>{item.username}</TableCell>*/}
                  <TableCell>+48 123 456 789</TableCell>
                  <TableCell>
                    2
                    {/*{getRoleView(item.role)}*/}
                  </TableCell>
                  {/*<TableCell>{getLastLoginView(item.lastActiveAt)}</TableCell>*/}
                  <TableCell>4/15/2023</TableCell>
                  <TableCell>
                    -
                    {/*{getStatusView(item.status)}*/}
                  </TableCell>
                  <TableCell className="text-right">
                    {/*<UserActionsCell user={item} updateUser={setEmployees} />*/}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  )
}

export default ParentsTable;
