"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  })

  if (error) {
    return { error: error.message }
  }

  // Verify admin role
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Authentication failed" }

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .single()

  if (!admin) {
    await supabase.auth.signOut()
    return { error: "Not authorized as admin" }
  }

  revalidatePath("/admin", "layout")
  redirect("/admin")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}
