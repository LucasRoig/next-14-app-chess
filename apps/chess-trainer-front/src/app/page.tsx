import { Poppins } from "next/font/google";
import { cn } from "../lib/utils";
import { dbClient, queryBuilder } from "@repo/database";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import CreateChessDatabaseDialog from "./_components/create-chess-database-dialog";
import { getAllChessDatabasesUseCase } from "../use-cases/chess-database-use-cases";


const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap", //Fix network error to load font
  adjustFontFallback: false, //Fix network error to load font
});

export default async function HomePage() {
  const databases = await getAllChessDatabasesUseCase();

  return (
    <div>
      <h1 className={cn(font.className)}>Welcome to Chess Trainer</h1>
      <h3>Databases</h3>
      <CreateChessDatabaseDialog />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
          </TableRow>
        </TableHeader>
        {databases.length === 0 ? (
          <TableCaption>No database created</TableCaption>
        ) : (
          <TableBody>
            {databases.map((database) => (
              <TableRow key={database.id}>
                <TableCell className="font-medium">{database.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
}
