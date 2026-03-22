import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function StoriesPage() {
  const supabase = await createClient()
  const { data: chapters } = await supabase
    .from("story_chapters")
    .select("*")
    .order("land")
    .order("chapter_number")

  const landLabels: Record<string, string> = {
    coin_canyon: "Coin Canyon",
    savings_forest: "Savings Forest",
    invention_tower: "Invention Tower",
    family_store: "Family Store",
    generosity_garden: "Generosity Garden",
    future_forest: "Future Forest",
  }

  const landColors: Record<string, string> = {
    coin_canyon: "bg-coin-gold text-sandy-gold",
    savings_forest: "bg-forest-green/10 text-forest-green",
    invention_tower: "bg-tech-purple/10 text-tech-purple",
    family_store: "bg-flag-orange/10 text-flag-orange",
    generosity_garden: "bg-forest-green/10 text-forest-green",
    future_forest: "bg-[#36679c]/10 text-[#36679c]",
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">Stories</h1>
        <Link href="/admin/stories/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Chapter
          </Button>
        </Link>
      </div>

      {chapters && chapters.length > 0 ? (
        <div className="space-y-3">
          {chapters.map((chapter) => (
            <Card key={chapter.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-mid flex items-center justify-center font-heading font-bold text-lg">
                    {chapter.chapter_number}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold">
                      {chapter.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={landColors[chapter.land] ?? ""}
                      >
                        {landLabels[chapter.land] ?? chapter.land}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Ages {chapter.age_min}-{chapter.age_max}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {chapter.coins_reward} coins
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={chapter.is_published ? "default" : "secondary"}
                  >
                    {chapter.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="text-lg mb-2">No story chapters yet</p>
            <p className="text-sm">
              Create your first chapter to start building the adventure
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
