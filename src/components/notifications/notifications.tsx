"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import type { Notification } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { markNotificationAsRead } from "@/app/actions";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const isInitialLoad = useRef(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // This effect runs on the client, so we can initialize Audio here
    audioRef.current = new Audio('/notification.mp3');
  }, [])

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/notifications`),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: Notification[] = [];
      let count = 0;
      let hasNewUnread = false;

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          if (!data.read && !isInitialLoad.current) {
            hasNewUnread = true;
          }
        }
      });
      
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Notification, 'id'>;
        if (!data.read) {
          count++;
        }
        notifs.push({ id: doc.id, ...data });
      });

      setNotifications(notifs);
      setUnreadCount(count);
      
      if (hasNewUnread) {
          if (navigator.vibrate) {
              navigator.vibrate(200); // Vibrate for 200ms
          }
          if (audioRef.current) {
            audioRef.current.play().catch(error => {
                console.log("Audio playback failed:", error);
            });
          }
      }
      
      isInitialLoad.current = false;
    });

    return () => {
        isInitialLoad.current = true;
        unsubscribe();
    }
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user) return;
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    await markNotificationAsRead(user.uid, notificationId);
  };
  
  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    // Optimistic update
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    // Update in backend
    notifications.forEach(async (n) => {
        if (!n.read) {
            await markNotificationAsRead(user.uid, n.id);
        }
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Mail className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
           <span className="sr-only">Open notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
         <div className="flex items-center justify-between p-4 border-b">
            <h4 className="font-medium">Notifications</h4>
            {unreadCount > 0 && (
                 <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                    <Check className="mr-2 h-4 w-4" /> Mark all as read
                </Button>
            )}
        </div>
        <ScrollArea className="h-96">
            {notifications.length > 0 ? (
                <div className="divide-y">
                    {notifications.map((n) => (
                        <div key={n.id} className={cn("p-4 hover:bg-accent", !n.read && "bg-accent/50")}>
                           <Link href="/orders" className="block">
                                <p className="text-sm">{n.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {n.createdAt ? formatDistanceToNow(n.createdAt.toDate(), { addSuffix: true }) : ''}
                                </p>
                           </Link>
                           {!n.read && (
                             <Button variant="link" size="sm" className="p-0 h-auto mt-2" onClick={(e) => { e.stopPropagation(); handleMarkAsRead(n.id)}}>Mark as read</Button>
                           )}
                        </div>
                    ))}
                </div>
            ): (
                <p className="text-center text-sm text-muted-foreground py-16">
                    You have no new notifications.
                </p>
            )}

        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
