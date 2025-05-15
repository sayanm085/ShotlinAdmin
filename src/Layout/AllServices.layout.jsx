// src/Layout/AllServices.layout.jsx

import React, { useState, useMemo } from 'react'
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { useSwipeable } from 'react-swipeable'
import {
  Edit3, Trash2, Eye, PlusCircle,
  Filter, Search as SearchIcon,
} from 'lucide-react'
import { useServiceContent } from '@/Hooks/useServiceContent'

export default function AllServices() {
  const [inputTerm,  setInputTerm]  = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCtg,  setFilterCtg]  = useState('All')
  const [page,       setPage]       = useState(1)

  // fetch whenever searchTerm, filterCtg, or page changes
  const { data, isLoading, isError } = useServiceContent({
    search:   searchTerm  || undefined,
    category: filterCtg === 'All' ? undefined : filterCtg,
    page,
    limit: 5,
  })

  const services     = data?.newProducts      ?? []
  const pagination   = data?.configProduct    ?? {}
  const totalPages   = pagination.totalPages  ?? 1

  // derive unique categories for filter dropdown
  const availableCategories = useMemo(() => {
    const cats = new Set(services.map(s => s.category))
    return ['All', ...cats]
  }, [services])

  const handlers = useSwipeable({
    onSwipedLeft:  () => console.log('← swipe'),
    onSwipedRight: () => console.log('→ swipe'),
  })

  const handleSearchClick = () => {
    setSearchTerm(inputTerm.trim())
    setPage(1)        // reset to first page on new search
  }

  if (isLoading) return <p className="p-6 text-center">Loading services…</p>
  if (isError)   return <p className="p-6 text-center text-red-600">Error loading services.</p>

  return (
    <div className="space-y-4 p-4 md:p-6 lg:p-8" {...handlers}>
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-9"
              value={inputTerm}
              onChange={e => setInputTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleSearchClick}>Search</Button>

          {/* Category filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                {filterCtg}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {availableCategories.map(cat => (
                <DropdownMenuItem
                  key={cat}
                  onClick={() => {
                    setFilterCtg(cat)
                    setPage(1)   // reset to first page on filter change
                  }}
                >
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Add Service button */}
        <a href="/dashboard/servicesupload">
        <Button className="flex items-center gap-2">
          <PlusCircle size={18} />
          Add Service
        </Button>
        </a>
      </div>

      <Separator />

      {/* Grid or empty state */}
      {services.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map(svc => (
              <ServiceCard
                key={svc.id}
                service={{
                  id: svc.id,
                  title: svc.title,
                  category: svc.category,
                  description: svc.description || '',
                  image: svc.image,
                }}
                onDelete={() => console.log('delete', svc.id)}
              />
            ))}
          </div>

          {/* Pagination controls */}
          <div className="flex justify-center items-center space-x-4 mt-6">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <span>Page {page} of {totalPages}</span>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <p className="p-6 text-center text-gray-500">
          {searchTerm
            ? 'This searching service is invalid'
            : 'No services to display.'}
        </p>
      )}
    </div>
  )
}

function ServiceCard({ service, onDelete }) {
  return (
    <div className="bg-white shadow-sm rounded-md hover:scale-[1.01] transition-transform">
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
        <div className="flex gap-2">

          <a href={`/dashboard/servicesedit/${service.id}`}>
          {/* Edit button */}
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
          </a>
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="default" size="sm" className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> View
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">View more info</p>
          </TooltipContent>
        </Tooltip>
      </CardFooter>
    </div>
  )
}
