// src/Layout/AllCustomers.layout.jsx

import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, Check, X } from "lucide-react";
import { useFetchUsers } from "@/Hooks/CustomersData";

/**
 * Custom hook: synchronizes state with URL params and pushes each change
 */
function useHistoryState() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // parse from URL
  const searchTerm = searchParams.get("search") || "";
  const page       = parseInt(searchParams.get("page"), 10) || 1;
  const unverified = searchParams.get("unverified") === "true";
  const period     = searchParams.get("period") || "";

  // whenever URL changes (back/forward), sync nothing else needed here—
  // component will re-render with new parsed values

  // updater function: merge new fields into URL and push history entry
  const update = ({ searchTerm, page, unverified, period }) => {
    const params = new URLSearchParams();
    if (searchTerm)  params.set("search",    searchTerm);
    if (page > 1)    params.set("page",      String(page));
    if (unverified)  params.set("unverified","true");
    if (period)      params.set("period",    period);

    navigate(`/dashboard/customerslist?${params.toString()}`, {
      replace: false, // always push a new entry
    });
  };

  return { searchTerm, page, unverified, period, update };
}

export default function AllCustomers() {
  const { searchTerm, page, unverified, period, update } = useHistoryState();
  const [inputTerm, setInputTerm] = React.useState(searchTerm);

  const pageSize = 10;

  // fetch
  const {
    data = { users: [], totalPages: 1 },
    isLoading,
    isError,
  } = useFetchUsers({
    search:     searchTerm || undefined,
    page,
    limit:      pageSize,
    unverified: unverified ? true : undefined,
    period:     period || undefined,
  });
  const { users, totalPages } = data;

  // keep inputTerm in sync when URL changes
  useEffect(() => {
    setInputTerm(searchTerm);
  }, [searchTerm]);

  // handlers
  const onSearch = () => {
    update({ searchTerm: inputTerm.trim(), page: 1, unverified, period });
  };
  const onPage   = (p) => update({ searchTerm, page: p, unverified, period });
  const onToggleUnverified = (u) =>
    update({ searchTerm, page: 1, unverified: u, period });
  const onPeriod = (pr) =>
    update({ searchTerm, page: 1, unverified, period: pr });

  if (isLoading) {
    return (
      <Card className="shadow-sm bg-white">
        <CardHeader className="bg-white border-b p-6 flex items-center justify-between rounded-t-md">
          <CardTitle className="text-2xl font-bold text-gray-900">
            All Customers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex items-center justify-center">
          <Spinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm bg-white">
      <CardHeader className="bg-white border-b p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <CardTitle className="text-2xl font-bold text-gray-900">
          All Customers
        </CardTitle>
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <Input
            placeholder="Search by name, username, or email..."
            className="w-64"
            value={inputTerm}
            onChange={(e) => setInputTerm(e.target.value)}
          />
          <Button onClick={onSearch}>Search</Button>

          {/* Unverified Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={unverified ? "default" : "outline"}>
                {unverified ? "Unverified Only" : "All Users"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onToggleUnverified(false)}>
                All Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleUnverified(true)}>
                Unverified Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Period Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={period ? "default" : "outline"}>
                {period || "Any Time"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onPeriod("")}>
                Any Time
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPeriod("30d")}>
                Last 30 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPeriod("1y")}>
                Last Year
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {isError && (
        <div className="p-6 text-center text-red-500">
          An error occurred while fetching customers.
        </div>
      )}

      {!isError && (
        <CardContent className="p-6 overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="border-b bg-white">
              <tr>
                {[
                  "Customer",
                  "Username",
                  "Email",
                  "Registered",
                  "Verified",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={u.avatar} alt={u.fullName} />
                        <AvatarFallback>
                          {u.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-900">
                        {u.fullName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {u.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {u.isVerified ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="p-1">
                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    {searchTerm
                      ? `No customers found for “${searchTerm}”.`
                      : "No customers to display."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => onPage(page - 1)}
              >
                Prev
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i + 1}
                  variant={i + 1 === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => onPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
