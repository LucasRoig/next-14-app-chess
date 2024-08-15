"use client";

import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { parsePgnUseCase, validatePgnUseCase } from "../../../use-cases/pgn-use-cases";
import { importPgnAction } from "./import-pgn-action";

export function ImportPgnDialog() {
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
    if (selectedFile) {
      console.debug("selectedFile", selectedFile);
      const text = await selectedFile.text();
      await importPgnAction({
        pgn: text,
        dbId: "TODO",
      });
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
