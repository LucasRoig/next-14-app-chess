"use client";

import { Loader2 } from "lucide-react"
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { useServerAction } from "zsa-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { createChessDatabaseAction } from "./create-chess-database-action";
import { toast } from "sonner"

export default function CreateChessDatabaseDialog() {
  const [createDbFormName, setCreateDbFormName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { isPending, execute } = useServerAction(createChessDatabaseAction);

  const handleSubmit = async () => {
    await execute({
      name: createDbFormName,
    });
    setIsOpen(false);
    toast("Database created successfully");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create Database</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Database</DialogTitle>
          <DialogDescription>Make changes here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              autoComplete="off"
              value={createDbFormName}
              onChange={(e) => setCreateDbFormName(e.target.value)}
              id="name"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={createDbFormName.length === 0 || isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
