"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { SelectValue } from "@radix-ui/react-select";
import AsyncSelect from "react-select/async";
import ky from "ky";
import { z } from "zod";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "../../../components/ui/checkbox";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { addSourceToDbAction } from "./add-source-to-db-actions";

export function AddSourceDialog({ databaseId }: { databaseId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sourceType, setSourceType] = useState<"Lichess">("Lichess");
  const [lichessUsername, setLichessUsername] = useState<string>();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add source</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add source</DialogTitle>
          <div>
            <Label>Type</Label>
            <Select onValueChange={(v) => setSourceType(v as "Lichess")} defaultValue={"Lichess"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lichess">Lichess</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {sourceType === "Lichess" && (
            <div className="flex flex-col gap-2">
              <Label className="block">Username</Label>
              <LichessUsernameCombobox onChange={setLichessUsername} />
              <LichessProfile username={lichessUsername} closeDialog={() => setIsOpen(false)} databaseId={databaseId} />
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function LichessProfile({ username, closeDialog, databaseId }: { username: string | undefined, closeDialog: () => void, databaseId: string }) {
  const [isUltraBulletChecked, setIsUltraBulletChecked] = useState(false);
  const [isBulletChecked, setIsBulletChecked] = useState(false);
  const [isBlitzChecked, setIsBlitzChecked] = useState(false);
  const [isRapidChecked, setIsRapidChecked] = useState(false);
  const [isClassicalChecked, setIsClassicalChecked] = useState(false);
  const [isCorrespondenceChecked, setIsCorrespondenceChecked] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setIsUltraBulletChecked(false);
    setIsBulletChecked(false);
    setIsBlitzChecked(false);
    setIsRapidChecked(false);
    setIsClassicalChecked(false);
    setIsCorrespondenceChecked(false);
  }, [
    username,
    setIsUltraBulletChecked,
    setIsBulletChecked,
    setIsBlitzChecked,
    setIsRapidChecked,
    setIsClassicalChecked,
    setIsCorrespondenceChecked,
  ]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["lichessProfile", username],
    queryFn: async () => {
      const result = await ky.get(`https://lichess.org/api/user/${username}`).json();
      const perfSchema = z.object({
        games: z.number(),
      });
      const profileSchema = z.object({
        id: z.string(),
        username: z.string(),
        perfs: z
          .object({
            ultraBullet: perfSchema.optional(),
            blitz: perfSchema.optional(),
            bullet: perfSchema.optional(),
            correspondence: perfSchema.optional(),
            classical: perfSchema.optional(),
            rapid: perfSchema.optional(),
          })
          .optional(),
      });
      const profile = profileSchema.parse(result);
      return profile;
    },
    enabled: username !== undefined && username.length > 0,
  });

  const handleCheckboxChange = (setter: (value: boolean) => void) => (checked: CheckedState) => {
    setter(checked === "indeterminate" ? false : checked);
  };

  const handleSubmit = async () => {
    if (!username) {
      toast.error("Username is required");
      return;
    }
    await addSourceToDbAction({
      dbId: databaseId,
      username: username,
      importBlitz: isBlitzChecked,
      importBullet: isBulletChecked,
      importClassical: isClassicalChecked,
      importCorrespondence: isCorrespondenceChecked,
      importRapid: isRapidChecked,
      importUltraBullet: isUltraBulletChecked,
    });
    closeDialog();
    toast.success("Source added successfully");
  };

  const canSubmit =
    isUltraBulletChecked ||
    isBulletChecked ||
    isBlitzChecked ||
    isRapidChecked ||
    isClassicalChecked ||
    isCorrespondenceChecked;

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <Checkbox
              id="correspondence-cb"
              checked={isCorrespondenceChecked}
              onCheckedChange={handleCheckboxChange(setIsCorrespondenceChecked)}
            />
            <Label className="ml-2" htmlFor="correspondence-cb">
              Correspondence: {data.perfs?.correspondence?.games ?? 0} games
            </Label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="classical-cb"
              checked={isClassicalChecked}
              onCheckedChange={handleCheckboxChange(setIsClassicalChecked)}
            />
            <Label className="ml-2" htmlFor="classical-cb">
              Classical: {data.perfs?.classical?.games ?? 0} games
            </Label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="rapid-cb"
              checked={isRapidChecked}
              onCheckedChange={handleCheckboxChange(setIsRapidChecked)}
            />
            <Label className="ml-2" htmlFor="rapid-cb">
              Rapid: {data.perfs?.rapid?.games ?? 0} games
            </Label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="blitz-cb"
              checked={isBlitzChecked}
              onCheckedChange={handleCheckboxChange(setIsBlitzChecked)}
            />
            <Label className="ml-2" htmlFor="blitz-cb">
              Blitz: {data.perfs?.blitz?.games ?? 0} games
            </Label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="bullet-cb"
              checked={isBulletChecked}
              onCheckedChange={handleCheckboxChange(setIsBulletChecked)}
            />
            <Label className="ml-2" htmlFor="bullet-cb">
              Bullet: {data.perfs?.bullet?.games ?? 0} games
            </Label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="ultra-bullet-cb"
              checked={isUltraBulletChecked}
              onCheckedChange={handleCheckboxChange(setIsUltraBulletChecked)}
            />
            <Label className="ml-2" htmlFor="ultra-bullet-cb">
              Utra Bullet: {data.perfs?.ultraBullet?.games ?? 0} games
            </Label>
          </div>
        </div>
      )}
      <Button onClick={handleSubmit} disabled={!canSubmit}>Add Source</Button>
    </>
  );
}

function LichessUsernameCombobox(props: { onChange: (username: string | undefined) => void }) {
  const promiseOptions = async (inputValue: string) => {
    if (inputValue.length < 3) {
      return [];
    }
    const result = await ky.get(`https://lichess.org/api/player/autocomplete?term=${inputValue}`).json();
    const autocompleteSchema = z.array(z.string());
    const usernames = autocompleteSchema.safeParse(result);
    if (!usernames.success) {
      toast.error("Error while fetching usernames");
      return [];
    }
    return usernames.data.map((username) => ({ label: username, value: username }));
  };

  return <AsyncSelect isClearable loadOptions={promiseOptions} onChange={(e) => props.onChange(e?.value)} />;
}
