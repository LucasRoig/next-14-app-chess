//SOURCE: https://github.com/webdevcody/wdc-saas-starter-kit/blob/main/src/lib/get-ip.ts

import { headers } from "next/headers";

export function getIp() {
  const forwardedFor = headers().get("x-forwarded-for");
  const realIp = headers().get("x-real-ip");

  if (forwardedFor) {
    const splitted = forwardedFor.split(",")[0];
    if (splitted) {
      return splitted.trim();
    }
  }

  if (realIp) {
    return realIp.trim();
  }

  return null;
}
