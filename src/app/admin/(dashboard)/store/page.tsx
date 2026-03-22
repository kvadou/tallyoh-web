import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag } from "lucide-react"

export default function StorePage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">
        Store & Rewards
      </h1>
      <Card>
        <CardContent className="py-16 text-center">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-heading font-semibold mb-2">
            Family Store Management
          </p>
          <p className="text-muted-foreground max-w-md mx-auto">
            Manage reward templates, brand partner items, and redemption
            approvals. This section will grow as families start using the Family
            Store.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
