import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderManagement } from "./order-management";
import { MenuManagement } from "./menu-management";

export function AdminDashboardTabs() {
  return (
    <Tabs defaultValue="orders">
      <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
        <TabsTrigger value="orders">Order Management</TabsTrigger>
        <TabsTrigger value="menu">Menu Management</TabsTrigger>
      </TabsList>
      <TabsContent value="orders">
        <OrderManagement />
      </TabsContent>
      <TabsContent value="menu">
        <MenuManagement />
      </TabsContent>
    </Tabs>
  );
}
