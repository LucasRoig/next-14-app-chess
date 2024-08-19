import type { LichessSource } from "@repo/database";
import { Checkbox } from "../../../components/ui/checkbox";
import { Label } from "../../../components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { getChessDatabaseByIdUseCase } from "../../../use-cases/chess-database-use-cases";
import { AddSourceDialog } from "./add-source-dialog";
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
      <Tabs defaultValue="games">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>
        <TabsContent value="games">
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
                    <TableCell className="font-medium">
                      <CustomLink href={`/game/${game.id}`}>{game.white}</CustomLink>
                    </TableCell>

                    <TableCell className="font-medium">
                      <CustomLink href={`/game/${game.id}`}>{game.black}</CustomLink>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TabsContent>
        <TabsContent value="sources" className="p-4">
          <AddSourceDialog databaseId={database.id} />
          <div className="flex flex-col mt-4">
            {database.sources.map((source) => (
              <LichessSourceItem key={source.id} source={source} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

function LichessSourceItem({ source }: { source: Omit<LichessSource, "chessDatabase"> }) {
  return (
    <div className="flex flex-col gap-2 border border-solid p-4">
      <div className="flex items-center gap-8">
        <div>
          <span>Site : </span>
          <span>{source.kind}</span>
        </div>
        <div>
          <span>Username : </span>
          <span>{source.username}</span>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Checkbox checked={source.importUltraBullet} disabled={true} />
            <Label>Ultra Bullet</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={source.importBullet} disabled={true} />
            <Label>Bullet</Label>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Checkbox checked={source.importBlitz} disabled={true} />
            <Label>Blitz</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={source.importRapid} disabled={true} />
            <Label>Rapid</Label>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Checkbox checked={source.importClassical} disabled={true} />
            <Label>Classical</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={source.importCorrespondence} disabled={true} />
            <Label>Correspondance</Label>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomLink(props: { href: string; children: React.ReactNode }) {
  return (
    <Link href={props.href} className="block w-full h-full">
      {props.children}
    </Link>
  );
}
