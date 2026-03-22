import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function MissionsPage() {
  const supabase = await createClient()
  const { data: missions } = await supabase
    .from("mission_templates")
    .select("*")
    .order("created_at", { ascending: false })

  const typeColors: Record<string, string> = {
    story: "bg-tech-purple/10 text-tech-purple",
    real_world: "bg-forest-green/10 text-forest-green",
    quiz: "bg-[#36679c]/10 text-[#36679c]",
    daily: "bg-coin-gold text-sandy-gold",
    custom: "bg-flag-orange/10 text-flag-orange",
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">Mission Templates</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Mission
        </Button>
      </div>

      {missions && missions.length > 0 ? (
        <div className="space-y-3">
          {missions.map((mission) => (
            <Card key={mission.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-heading font-semibold">
                    {mission.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {mission.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="secondary"
                      className={typeColors[mission.type] ?? ""}
                    >
                      {mission.type.replace("_", " ")}
                    </Badge>
                    {mission.character_id && (
                      <span className="text-xs text-muted-foreground">
                        {mission.character_id}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {mission.coins_reward} coins
                    </span>
                  </div>
                </div>
                <Badge variant={mission.is_active ? "default" : "secondary"}>
                  {mission.is_active ? "Active" : "Inactive"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="text-lg mb-2">No mission templates yet</p>
            <p className="text-sm">
              Create mission templates that can be assigned to kids
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
