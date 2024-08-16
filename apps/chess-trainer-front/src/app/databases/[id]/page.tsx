import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { getChessDatabaseByIdUseCase } from "../../../use-cases/chess-database-use-cases";
import { ImportPgnDialog, type ImportPgnSubmitHandler } from "./import-pgn-dialog";
import { importPgnAction } from "./import-pgn-action";
import { toast } from "sonner";
import { ImportPgnInDatabaseDialog } from "./import-pgn-in-database-dialog";
import Link from "next/link";

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
      {JSON.stringify(database.games)}
      <ImportPgnInDatabaseDialog databaseId={database.id} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>White</TableHead>
            <TableHead>Black</TableHead>
          </TableRow>
        </TableHeader>
        {database.games.length === 0 ? (
          <TableCaption>No Game in database</TableCaption>
        ) : (
          <TableBody>
            {database.games.map((game) => (
              <TableRow key={game.id}>
                <TableCell className="font-medium"><CustomLink href={`/game/${game.id}`}>{game.white}</CustomLink></TableCell>

                <TableCell className="font-medium"><CustomLink href={`/game/${game.id}`}>{game.black}</CustomLink></TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </>
  );
}

function CustomLink(props: { href: string, children: React.ReactNode }) {
  return (
    <Link href={props.href} className="block w-full h-full">
      {props.children}
    </Link>
  );
}