import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, TrendingUp, TrendingDown } from "lucide-react"

export default async function EconomyPage() {
  const supabase = await createClient()

  const { data: wallets } = await supabase.from("coin_wallets").select("*")

  const totalBalance = wallets?.reduce((sum, w) => sum + w.balance, 0) ?? 0
  const totalEarned = wallets?.reduce((sum, w) => sum + w.total_earned, 0) ?? 0
  const totalSpent = wallets?.reduce((sum, w) => sum + w.total_spent, 0) ?? 0

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">Coin Economy</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total in Circulation
            </CardTitle>
            <Coins className="w-5 h-5 text-sandy-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold">
              {totalBalance.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Earned (All Time)
            </CardTitle>
            <TrendingUp className="w-5 h-5 text-forest-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold">
              {totalEarned.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Spent (All Time)
            </CardTitle>
            <TrendingDown className="w-5 h-5 text-flag-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold">
              {totalSpent.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>
            Transaction history and economy charts will populate as users earn
            and spend coins.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
