import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { CalendarIcon, ArrowUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { fetchTransactions, Transaction } from "@/lib/services/transactions";
import { DashboardHeader } from "./DashboardHeader/DashboardHeader";

type SortField = "date" | "amount";
type SortOrder = "asc" | "desc";

export default function PaymentDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({
    from: new Date(2023, 4, 1),
    to: new Date(2023, 4, 31),
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const itemsPerPage = 5;

  const fetchData = useCallback(async () => {
    if (!dateRange.from) {
      return;
    }

    setError(null);
    try {
      const result = await fetchTransactions(
        dateRange.from,
        dateRange.to || new Date()
      );
      setTransactions(result);
      setCurrentPage(1);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch transactions. Please try again.");
    }
  }, [dateRange?.from, dateRange?.to]);

  useEffect(() => {
    fetchData();
  }, [dateRange, fetchData]);

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortField === "date") {
      return sortOrder === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
    }
  });

  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const FIRST_PAGE = 1;
  const LAST_PAGE = totalPages;

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  const handlePreviousClick = () => {
    if (currentPage > FIRST_PAGE) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < LAST_PAGE) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (pageIndex: number) => {
    setCurrentPage(pageIndex + 1);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <DashboardHeader
        title="Payment Dashboard"
        description="View your recent transactions."
      />
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(newDateRange) => {
                  if (!newDateRange) {
                    return;
                  }

                  setDateRange(newDateRange);
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={fetchData}>Refresh</Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Transactions: {totalTransactions}</p>
            <p>Total Amount: ${totalAmount.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Table>
          <TableCaption>A list of your recent transactions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("date")}>
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort("amount")}>
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="text-right">
                  ${transaction.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={handlePreviousClick} />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => handlePageClick(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={handleNextClick} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
}
