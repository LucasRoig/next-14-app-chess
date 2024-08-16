"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { validatePgnUseCase } from "../../../use-cases/pgn-use-cases";

export type ImportPgnSubmitHandler = (pgn: string, closeDialog: () => void) => void;

export type PgnImportDialogProps = {
  onSubmit?: ImportPgnSubmitHandler;
}

export function ImportPgnDialog(props: PgnImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isValidPgn, setIsValidPgn] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const text = await file.text();
      const isValidPgn = validatePgnUseCase(text);
      setIsValidPgn(isValidPgn);
    } else {
      setSelectedFile(null);
      setIsValidPgn(false);
    }
  };
  const handleSubmit = async () => {
    console.debug("submit");
    if (selectedFile && props.onSubmit) {
      const text = await selectedFile.text();
      props.onSubmit(text, () => setIsOpen(false));
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Import pgn</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import pgn</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input type="file" accept=".pgn" autoComplete="off" id="name" className="col-span-4" onChange={handleFileChanged} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={!isValidPgn} onClick={handleSubmit}>
            {/* {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} */}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
