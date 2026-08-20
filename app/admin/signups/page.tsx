import { redirect } from "next/navigation";

export default async function SignupsRedirect() {
  redirect("/admin/enquiries");
}
