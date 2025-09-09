import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderManagement } from "./order-management";
import { MenuManagement } from "./menu-management";
import { CanteenSettings } from "./canteen-settings";

export function AdminDashboardTabs() {
  return (
    <Tabs defaultValue="orders">
      <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
        <TabsTrigger value="orders">Order Management</TabsTrigger>
        <TabsTrigger value="menu">Menu Management</TabsTrigger>
        <TabsTrigger value="settings">Canteen Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="orders">
        <OrderManagement />
      </TabsContent>
      <TabsContent value="menu">
        <MenuManagement />
      </TabsContent>
      <TabsContent value="settings">
        <CanteenSettings />
      </TabsContent>
    </Tabs>
  );
}
