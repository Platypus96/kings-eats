import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const statusStyles: Record<OrderStatus, string> = {
    Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Approved: "bg-green-500/20 text-green-400 border-green-500/30",
    Declined: "bg-red-500/20 text-red-400 border-red-500/30",
    Completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        statusStyles[status],
        className
      )}
    >
      {status}
    </Badge>
  );
}
