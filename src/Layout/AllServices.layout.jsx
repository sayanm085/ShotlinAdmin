// src/Layout/AllServices.layout.jsx

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
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
import {
  useServiceContent,
  useDeleteProduct,
} from '@/Hooks/useServiceContent'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

/**
 * Custom hook to keep `searchTerm` & `page` in URL and push history entries
 */
function useHistoryState() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // parse current values from URL
  const searchTerm = searchParams.get('search') || ''
  const page       = parseInt(searchParams.get('page'), 10) || 1

  // update URL (always pushes a new history entry)
  const update = ({ searchTerm: newSearch, page: newPage }) => {
    const params = new URLSearchParams()
    if (newSearch) params.set('search', newSearch)
    if (newPage > 1) params.set('page', String(newPage))
    navigate(`/dashboard/serviceslist?${params.toString()}`, { replace: false })
  }

  return { searchTerm, page, update }
}

export default function AllServices() {
  // URL-driven state & updater
  const { searchTerm, page, update } = useHistoryState()

  // local-only states
  const [inputTerm, setInputTerm]   = useState(searchTerm)
  const [filterCtg,  setFilterCtg]  = useState('All')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDeleteId,  setToDeleteId]  = useState(null)

  // fetch list
  const { data, isLoading, isError } = useServiceContent({
    search:   searchTerm || undefined,
    category: filterCtg === 'All' ? undefined : filterCtg,
    page,
    limit: 5,
  })

  const services   = data?.newProducts   ?? []
  const totalPages = data?.configProduct?.totalPages ?? 1

  // derive categories
  const availableCategories = useMemo(() => {
    const cats = new Set(services.map(s => s.category))
    return ['All', ...cats]
  }, [services])

  // sync inputTerm when URL-driven searchTerm changes
  useEffect(() => {
    setInputTerm(searchTerm)
  }, [searchTerm])

  // swipe handlers (if needed)
  const handlers = useSwipeable({
    onSwipedLeft:  () => console.log('← swipe'),
    onSwipedRight: () => console.log('→ swipe'),
  })

  // delete mutation
  const { mutate: deleteService, isLoading: deleting } = useDeleteProduct()

  function askDelete(id) {
    setToDeleteId(id)
    setConfirmOpen(true)
  }

  function confirmDelete() {
    deleteService(toDeleteId, {
      onSuccess: () => setConfirmOpen(false),
    })
  }

  // handlers that update URL + history
  const handleSearchClick = () => {
    update({ searchTerm: inputTerm.trim(), page: 1 })
  }

  const handlePageChange = (newPage) => {
    update({ searchTerm, page: newPage })
  }

  // category filter stays local, but resets page in URL
  const handleCategoryChange = (cat) => {
    setFilterCtg(cat)
    update({ searchTerm, page: 1 })
  }

  if (isLoading) return <p className="p-6 text-center">Loading services…</p>
  if (isError)   return <p className="p-6 text-center text-red-600">Error loading services.</p>

  return (
    <>
      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete service?</DialogTitle>
          </DialogHeader>
          <p className="py-2">Are you sure you want to delete this service?</p>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              No
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting…' : 'Yes, delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-4 p-4 md:p-6 lg:p-8" {...handlers}>
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <a href="/dashboard/servicesupload">
            <Button className="flex items-center gap-2">
              <PlusCircle size={18} />
              Add Service
            </Button>
          </a>
        </div>

        <Separator />

        {services.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map(svc => (
                <ServiceCard
                  key={svc.id}
                  service={svc}
                  onDelete={() => askDelete(svc.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Prev
              </Button>
              <span>Page {page} of {totalPages}</span>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
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
    </>
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
              <Button variant="outline" size="sm" className="p-2" onClick={onDelete}>
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
