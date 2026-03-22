import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function UsersPage() {
  const supabase = await createClient()

  const { data: families } = await supabase
    .from("families")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: users } = await supabase
    .from("users")
    .select("*, coin_wallets(*)")
    .order("created_at", { ascending: false })

  const roleColors: Record<string, string> = {
    parent: "bg-[#36679c]/10 text-[#36679c]",
    child: "bg-coin-gold text-sandy-gold",
    admin: "bg-tech-purple/10 text-tech-purple",
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">Users & Families</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Families
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold">
              {families?.length ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Parents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold">
              {users?.filter((u) => u.role === "parent").length ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Children
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold">
              {users?.filter((u) => u.role === "child").length ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {users && users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Coins</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.display_name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={roleColors[user.role] ?? ""}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.age ?? "—"}</TableCell>
                    <TableCell>
                      {user.coin_wallets?.[0]?.balance ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No users yet. Users will appear here when they sign up via the iOS
              app.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
