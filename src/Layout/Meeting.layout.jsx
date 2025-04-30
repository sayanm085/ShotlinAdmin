import React from "react";
// Shadcn UI components (adjust import paths to match your setup)
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// You can use lucide-react icons or any icon library
import { VideoIcon, VideoOffIcon, MoreHorizontal } from "lucide-react";

/**
 * Main component replicating the meeting page layout.
 */
export default function MeetingPage() {
  // Example data for "Today" meetings
  const todayMeetings = [
    {
      id: 1,
      iconColor: "bg-pink-100 text-pink-600", // For the top-left icon background
      title: "UI/UX Design Team Meeting",
      description: "Short info about the meeting: consectetur adipiscing elit...",
      participants: [
        { name: "Alice", src: "/avatars/alice.png" },
        { name: "Bob", src: "/avatars/bob.png" },
        { name: "Charlie", src: "/avatars/charlie.png" },
      ],
    },
    {
      id: 2,
      iconColor: "bg-green-100 text-green-600",
      title: "UI/UX Design Team Meeting",
      description: "Short info about the meeting: consectetur adipiscing elit...",
      participants: [
        { name: "Daniel", src: "/avatars/daniel.png" },
        { name: "Eve", src: "/avatars/eve.png" },
      ],
    },
    {
      id: 3,
      iconColor: "bg-purple-100 text-purple-600",
      title: "UI/UX Design Team Meeting",
      description: "Short info about the meeting: consectetur adipiscing elit...",
      participants: [
        { name: "Fay", src: "/avatars/fay.png" },
        { name: "Grace", src: "/avatars/grace.png" },
        { name: "Henry", src: "/avatars/henry.png" },
      ],
    },
  ];

  // Example data for "14 July" meetings
  const julyMeetings = [
    {
      id: 4,
      iconColor: "bg-blue-100 text-blue-600",
      title: "UI/UX Design Team Meeting",
      description: "Short info about the meeting: consectetur adipiscing elit...",
      participants: [
        { name: "Alice", src: "/avatars/alice.png" },
        { name: "Bob", src: "/avatars/bob.png" },
      ],
    },
    {
      id: 5,
      iconColor: "bg-yellow-100 text-yellow-600",
      title: "UI/UX Design Team Meeting",
      description: "Short info about the meeting: consectetur adipiscing elit...",
      participants: [
        { name: "Carol", src: "/avatars/carol.png" },
        { name: "Daniel", src: "/avatars/daniel.png" },
        { name: "Eve", src: "/avatars/eve.png" },
      ],
    },
    {
      id: 6,
      iconColor: "bg-red-100 text-red-600",
      title: "UI/UX Design Team Meeting",
      description: "Short info about the meeting: consectetur adipiscing elit...",
      participants: [
        { name: "Fay", src: "/avatars/fay.png" },
        { name: "Grace", src: "/avatars/grace.png" },
        { name: "Henry", src: "/avatars/henry.png" },
        { name: "Irene", src: "/avatars/irene.png" },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs for "Meeting" & "Room" */}
      <Tabs defaultValue="meeting">
        {/* Top bar: Tab triggers on the left, plus action buttons on the right */}
        <div className="flex items-center justify-between w-full gap-4 flex-wrap">
          <TabsList className="flex">
            <TabsTrigger value="meeting">Meeting</TabsTrigger>
            <TabsTrigger value="room">Room</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" className="font-semibold">
              + Add New Meeting
            </Button>
            <Button className="font-semibold">+ Instant Meeting</Button>
          </div>
        </div>

        {/* A separator below the tab bar */}
        <Separator className="my-2" />

        {/* "Meeting" tab content */}
        <TabsContent value="meeting" className="space-y-10">
          {/* Today section */}
          <section>
            <h2 className="scroll-m-20 text-xl font-semibold">Today</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-4">
              {todayMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          </section>

          {/* 14 July section */}
          <section>
            <h2 className="scroll-m-20 text-xl font-semibold">14 July</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-4">
              {julyMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          </section>
        </TabsContent>

        {/* "Room" tab content */}
        <TabsContent value="room" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Here you can manage or create rooms...
          </p>
          {/* Add your "Room" content here */}
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * A reusable MeetingCard component reflecting each meeting's details.
 */
function MeetingCard({ meeting }) {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        {/* Top row: Icon + Title + Possibly an overflow menu */}
        <div className="flex items-start justify-between">
          {/* Icon Circle */}
          <div className={`h-8 w-8 flex items-center justify-center rounded-full ${meeting.iconColor}`}>
            <VideoIcon size={16} />
          </div>
          {/* Optional menu or actions on the top-right */}
          <MoreHorizontal className="text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>
        {/* Title & Description */}
        <CardTitle className="text-base mt-2">
          {meeting.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {meeting.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {/* Could place date/time, or second icon if needed */}
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <ClockInfo />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-2">
        {/* Participants Avatars */}
        <div className="flex -space-x-2 overflow-hidden">
          {meeting.participants.map((p, index) => (
            <Avatar key={index} className="h-8 w-8 border-2 border-white">
              <AvatarImage src={p.src} alt={p.name} />
              <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        {/* Join Meeting Button */}
        <Button
          variant="default"
          className="bg-black hover:bg-black/90 text-white w-full mt-1"
        >
          Join Meeting
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * Example sub-component representing meeting time or other info.
 * Replace with real data or remove if not needed.
 */
function ClockInfo() {
  return (
    <>
      <VideoOffIcon size={14} className="text-gray-400" />
      <span>8:00 - 10:00 AM</span>
    </>
  );
}
