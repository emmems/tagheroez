'use client'

import { TableSkeleton } from "@/components/table-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { User } from "@/src/api/gen/dashboard/v1/users_pb";
import PlayerActionsCell from "../player-actions-cell";

interface PlayersTableProps {
  players: User[];
  isPlayersLoading: boolean;
}

function PlayersTable({ players, isPlayersLoading } : PlayersTableProps) {
  // const {
  //   data: playersResponse,
  //   isFetching: isPlayersLoading,
  // } = useQuery(rpcProvider.userRouter.getUsers);

  // const [players, setParents] = useState<User[] | undefined>(undefined);
  // console.log("players: ", players);

  const hasData = !isPlayersLoading && players && players.length > 0;
  const noData = !isPlayersLoading && (!players || players.length === 0);

  // function getConsentsView(consents: any) {}

  // useEffect(() => {
  //   if (playersResponse) {
  //     console.log('render players');
  //     setParents(playersResponse.users)
  //   }
  // }, [playersResponse])

  return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Players</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Nickname</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Birth Date</TableHead>
                <TableHead>Guardian</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
               {isPlayersLoading && <TableSkeleton />}

              {noData && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No players found.
                  </TableCell>
                </TableRow>
               )}

               {hasData && players.map((item) =>
                <TableRow key={item.id}>
                  {/*<TableCell className="font-medium">{item.details?.nickname}</TableCell>*/}
                  <TableCell className="font-medium">Test</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>12/07/2001</TableCell>
                  <TableCell>Piotr Nowak</TableCell>
                  <TableCell>
                    2
                    {/*{getRoleView(item.role)}*/}
                  </TableCell>
                  <TableCell className="text-right">
                    {/*<UserActionsCell user={item} updateUser={setEmployees} />*/}
                    <PlayerActionsCell player={item} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  )
}

export default PlayersTable;
