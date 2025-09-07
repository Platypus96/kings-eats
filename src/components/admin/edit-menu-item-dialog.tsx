"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { MenuItem } from "@/lib/types";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { addMenuItem, updateMenuItem } from "@/app/actions";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  price: z.coerce.number().min(0, { message: "Price cannot be negative." }),
  available: z.boolean(),
});

interface EditMenuItemDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  item: MenuItem | null;
  onFinished: () => void;
}

export function EditMenuItemDialog({ isOpen, setIsOpen, item, onFinished }: EditMenuItemDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      available: true,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
          name: item.name,
          price: item.price,
          available: item.available
      });
    } else {
      form.reset({
        name: "",
        price: 0,
        available: true,
      });
    }
  }, [item, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const dataToSave = {
        ...values,
        description: item?.description || "",
        imageUrl: item?.imageUrl || `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 100)}`,
    }

    const result = item
      ? await updateMenuItem(item.id, dataToSave)
      : await addMenuItem(dataToSave);

    if (result.success) {
      toast({ title: "Success", description: result.message });
      onFinished();
      setIsOpen(false);
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
          <DialogDescription>{item ? "Make changes to the item details." : "Add a new item to the menu."}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="price" render={({ field }) => (
              <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="available" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5"><FormLabel>Available</FormLabel></div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
