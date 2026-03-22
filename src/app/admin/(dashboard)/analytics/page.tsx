import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const [usersRes, familiesRes, progressRes, assignmentsRes] =
    await Promise.all([
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase.from("families").select("id", { count: "exact", head: true }),
      supabase
        .from("story_progress")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("mission_assignments")
        .select("id", { count: "exact", head: true }),
    ])

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold">
              {usersRes.count ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Families
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold">
              {familiesRes.count ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Stories Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold">
              {progressRes.count ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Missions Assigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold">
              {assignmentsRes.count ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>
            Engagement charts, completion rates, and retention metrics will
            populate as users interact with the app.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
