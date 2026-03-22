import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Target, PawPrint } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [usersRes, chaptersRes, missionsRes, charactersRes] = await Promise.all(
    [
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase
        .from("story_chapters")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("mission_templates")
        .select("id", { count: "exact", head: true }),
      supabase.from("characters").select("id", { count: "exact", head: true }),
    ]
  )

  const stats = [
    {
      label: "Users",
      value: usersRes.count ?? 0,
      icon: Users,
      color: "text-[#36679c]",
    },
    {
      label: "Characters",
      value: charactersRes.count ?? 0,
      icon: PawPrint,
      color: "text-sandy-gold",
    },
    {
      label: "Story Chapters",
      value: chaptersRes.count ?? 0,
      icon: BookOpen,
      color: "text-tech-purple",
    },
    {
      label: "Mission Templates",
      value: missionsRes.count ?? 0,
      icon: Target,
      color: "text-flag-orange",
    },
  ]

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className={`w-5 h-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/admin/stories"
              className="block p-3 rounded-xl bg-surface hover:bg-surface-low transition-colors text-sm"
            >
              <span className="font-semibold">Create Story Chapter</span>
              <span className="block text-muted-foreground text-xs mt-0.5">
                Add new adventure content for kids
              </span>
            </a>
            <a
              href="/admin/missions"
              className="block p-3 rounded-xl bg-surface hover:bg-surface-low transition-colors text-sm"
            >
              <span className="font-semibold">Add Mission Template</span>
              <span className="block text-muted-foreground text-xs mt-0.5">
                Create daily and real-world missions
              </span>
            </a>
            <a
              href="/admin/users"
              className="block p-3 rounded-xl bg-surface hover:bg-surface-low transition-colors text-sm"
            >
              <span className="font-semibold">View Users</span>
              <span className="block text-muted-foreground text-xs mt-0.5">
                See families, kids, and engagement
              </span>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">App Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 rounded-xl bg-surface">
              <span className="text-muted-foreground">Database</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-forest-green" />
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-surface">
              <span className="text-muted-foreground">iOS App</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-coin-gold" />
                In Development
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-surface">
              <span className="text-muted-foreground">COPPA Compliance</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-forest-green" />
                Zero tracking
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
