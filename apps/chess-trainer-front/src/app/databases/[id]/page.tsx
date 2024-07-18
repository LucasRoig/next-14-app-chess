import { Link } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { getChessDatabaseByIdUseCase } from "../../../use-cases/chess-database-use-cases";
import { ImportPgnDialog } from "./import-pgn-dialog";

type Props = {
  params: {
    id: string;
  };
};

export default async function DatabaseDetailsPage(props: Props) {
  const database = await getChessDatabaseByIdUseCase(props.params.id);
  return (
    <>
      <div>Database: {database.name}</div>
      <ImportPgnDialog />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-full">White</TableHead>
            <TableHead className="w-full">Black</TableHead>
          </TableRow>
        </TableHeader>
        {database.games.length === 0 ? (
          <TableCaption>No Game in database</TableCaption>
        ) : (
          <TableBody>
            {database.games.map((game) => (
              <TableRow key={game.id}>
                <Link href={`/games/${database.id}`}>
                  <TableCell className="font-medium w-full block">{game.white}</TableCell>
                  <TableCell className="font-medium w-full block">{game.black}</TableCell>
                </Link>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </>
  );
}
