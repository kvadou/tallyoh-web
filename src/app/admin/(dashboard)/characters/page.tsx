import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function CharactersPage() {
  const supabase = await createClient()
  const { data: characters } = await supabase
    .from("characters")
    .select("*")
    .order("sort_order")

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">Characters</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {characters?.map((char) => (
          <Card key={char.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: char.accent_color }}
                  />
                  {char.name}
                </CardTitle>
                {char.is_unlockable && (
                  <Badge variant="secondary">Unlockable</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Species:</span>{" "}
                {char.species}
              </div>
              <div>
                <span className="text-muted-foreground">Role:</span>{" "}
                {char.role}
              </div>
              <div>
                <span className="text-muted-foreground">Personality:</span>{" "}
                {char.personality}
              </div>
              <div className="pt-1 italic text-muted-foreground">
                &ldquo;{char.catchphrase}&rdquo;
              </div>
            </CardContent>
          </Card>
        )) ?? (
          <p className="text-muted-foreground col-span-full">
            No characters found. Run the database migration to seed characters.
          </p>
        )}
      </div>
    </div>
  )
}
