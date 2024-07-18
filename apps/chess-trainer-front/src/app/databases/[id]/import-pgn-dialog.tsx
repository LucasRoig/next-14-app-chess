"use client";

import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { useState } from "react";
import { validatePgnUseCase } from "../../../use-cases/pgn-use-cases";

export function ImportPgnDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const handleFileChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      const isValidPgn = validatePgnUseCase(text);
      console.log("validPgn", isValidPgn);
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
            <Input
              type="file"
              autoComplete="off"
              id="name"
              className="col-span-4"
              onChange={handleFileChanged}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" >
            {/* {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} */}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}