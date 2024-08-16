"use client";

import { toast } from "sonner";
import { importPgnAction } from "./import-pgn-action";
import { ImportPgnDialog, type ImportPgnSubmitHandler } from "./import-pgn-dialog";

export function ImportPgnInDatabaseDialog(props: { databaseId: string }) {
  const handleImportPgn: ImportPgnSubmitHandler = async (pgn, closeDialog) => {
    await importPgnAction({
      pgn,
      dbId: props.databaseId,
    })
    closeDialog();
    toast.success("Pgn imported successfully");
  }

  return <ImportPgnDialog onSubmit={handleImportPgn} />
}
