import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useSwipeable } from "react-swipeable";
import { Edit3, Trash2, Eye, PlusCircle, Filter, Search } from "lucide-react";

/**
 * DEMO DATA
 * Replace with your actual services data, fetched from an API or server.
 */
const demoServices = [
  {
    id: 1,
    title: "TripSet — Travel Agency",
    category: "Travel Agency",
    description:
      "An all-in-one travel solution for booking flights, hotels, and more.",
    image: "https://res.cloudinary.com/shotlin/image/upload/f_auto,q_auto:low,w_500/c_fill,dpr_auto,f_avif,q_auto:eco,w_800/v1/images/1738250358896?_a=BAMCkGa40",
  },
  {
    id: 2,
    title: "Bombon — SaaS & Finance Agency",
    category: "SaaS & Finance",
    description:
      "Manage your finances with this powerful SaaS solution for small businesses.",
    image: "https://res.cloudinary.com/shotlin/image/upload/f_auto,q_auto:low,w_500/c_fill,dpr_auto,f_avif,q_auto:eco,w_800/v1/images/1738251095336?_a=BAMCkGa40",
  },
  {
    id: 3,
    title: "Qupe — SaaS & Startup",
    category: "SaaS & Startup",
    description:
      "Scale your startup using robust solutions and advanced analytics.",
    image: "https://res.cloudinary.com/shotlin/image/upload/f_auto,q_auto:low,w_500/c_fill,dpr_auto,f_avif,q_auto:eco,w_800/v1/images/1738251787317?_a=BAMCkGa40",
  },
  {
    id: 4,
    title: "Logo Branding",
    category: "Design",
    description:
      "Professional branding and logo design for your growing business.",
    image: "https://res.cloudinary.com/shotlin/image/upload/f_auto,q_auto:low,w_500/c_fill,dpr_auto,f_avif,q_auto:eco,w_800/v1/images/1738253235765?_a=BAMCkGa40",
  },
];

export default function AllServices() {
  const [services, setServices] = useState(demoServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Optional swipe-based navigation
  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
  });

  useEffect(() => {
    // Fetch services from an API if needed:
    // fetch("API_ENDPOINT")
    //   .then((res) => res.json())
    //   .then((data) => setServices(data));
  }, []);

  function handleSwipe(direction) {
    // Example: load more services or change page
    console.log(`Swiped ${direction} - you could load more services here!`);
  }

  /**
   * Filter + Search logic:
   * 1) Check if the user selected a category other than "All"
   * 2) Search by title or description using the searchTerm
   */
  const filteredServices = services.filter((service) => {
    const matchesCategory =
      filterCategory === "All" || service.category === filterCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Handler for removing a service from the state (demo only)
  const handleDeleteService = (id) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
  };

  return (
    <div
      className="space-y-4 p-4 md:p-6 lg:p-8"
      {...handlers} // attaches swipe gestures to this container
    >
      {/* Top Section: Search, Filter, and Add Service */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Search + Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search services..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                {filterCategory === "All" ? "Filter" : filterCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterCategory("All")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterCategory("Travel Agency")}
              >
                Travel Agency
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterCategory("SaaS & Finance")}
              >
                SaaS & Finance
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterCategory("SaaS & Startup")}
              >
                SaaS & Startup
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory("Design")}>
                Design
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Add Service Button */}
        <Button className="flex items-center gap-2">
          <PlusCircle size={18} />
          Add Service
        </Button>
      </div>

      <Separator />

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onDelete={() => handleDeleteService(service.id)}
          />
        ))}

        {filteredServices.length === 0 && (
          <p className="text-sm text-gray-500 col-span-full">
            No services found. Try changing your filter or search.
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * SERVICE CARD COMPONENT
 * Displays an image, title, description, and action buttons.
 */
function ServiceCard({ service, onDelete }) {
  return (
    <div  className="bg-white shadow-sm rounded-md transition-transform duration-200 hover:scale-[1.01]">
      <CardHeader className="p-0">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-auto object-cover rounded-t-md"
          loading="lazy"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-base font-semibold">{service.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {service.category}
        </CardDescription>
        <p className="text-sm text-gray-500 mt-3 line-clamp-3">
          {service.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 flex items-center justify-between">
        {/* Left: Edit & Delete */}
        <div className="flex gap-2">
          {/* Edit button with Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="p-2">
                <Edit3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Edit Service</p>
            </TooltipContent>
          </Tooltip>

          {/* Delete button with Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="p-2"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Delete Service</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right: View Details */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="default" size="sm" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>View</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">View more info</p>
          </TooltipContent>
        </Tooltip>
      </CardFooter>
    </div>
  );
}
