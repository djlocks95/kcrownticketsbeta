import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { Employee } from "@shared/schema";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Briefcase, User, Users, DollarSign, Edit, Save, Trash2 } from "lucide-react";

export default function EmployeeManager() {
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "agent",
    commissionPercent: 10
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch employees
  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ["/api/employees"],
    queryFn: () => apiRequest<Employee[]>("/api/employees")
  });

  // Fetch monthly profit data
  const { data: profitData, isLoading: isLoadingProfit } = useQuery({
    queryKey: ["/api/profit", currentYear, currentMonth],
    queryFn: () => apiRequest(`/api/profit/${currentYear}/${currentMonth}`)
  });

  // Create employee mutation
  const createEmployeeMutation = useMutation({
    mutationFn: (newEmployee: Omit<Employee, "id">) => {
      return apiRequest("/api/employees", {
        method: "POST",
        body: JSON.stringify(newEmployee),
        headers: {
          "Content-Type": "application/json"
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      toast({
        title: "Employee created",
        description: "The employee has been added successfully.",
      });
      setIsAddEmployeeOpen(false);
      setNewEmployee({
        name: "",
        email: "",
        phone: "",
        role: "agent",
        commissionPercent: 10
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create employee: ${error}`,
        variant: "destructive"
      });
    }
  });

  // Update employee mutation
  const updateEmployeeMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number, updates: Partial<Employee> }) => {
      return apiRequest(`/api/employees/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
        headers: {
          "Content-Type": "application/json"
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      toast({
        title: "Employee updated",
        description: "The employee has been updated successfully.",
      });
      setIsEditEmployeeOpen(false);
      setSelectedEmployee(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update employee: ${error}`,
        variant: "destructive"
      });
    }
  });

  const handleCreateEmployee = () => {
    createEmployeeMutation.mutate(newEmployee);
  };

  const handleUpdateEmployee = () => {
    if (selectedEmployee) {
      updateEmployeeMutation.mutate({
        id: selectedEmployee.id,
        updates: selectedEmployee
      });
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditEmployeeOpen(true);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentYear(parseInt(e.target.value));
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Employee Management</h1>
          <Button onClick={() => setIsAddEmployeeOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>

        <Tabs defaultValue="employees" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Employee List</CardTitle>
                <CardDescription>
                  Manage your agents and employees who receive commissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingEmployees ? (
                  <div className="flex justify-center py-8">Loading employees...</div>
                ) : employees.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No employees found. Add your first employee to get started.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Commission %</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">{employee.name}</TableCell>
                          <TableCell>{employee.role}</TableCell>
                          <TableCell>
                            {employee.email && <div>{employee.email}</div>}
                            {employee.phone && <div>{employee.phone}</div>}
                          </TableCell>
                          <TableCell>{employee.commissionPercent}%</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${employee.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {employee.active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleEditEmployee(employee)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Commission Report</CardTitle>
                <CardDescription>
                  View profit distribution and commission calculations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="month">Month</Label>
                    <select
                      id="month"
                      className="w-full p-2 border rounded-md"
                      value={currentMonth}
                      onChange={handleMonthChange}
                    >
                      <option value="1">January</option>
                      <option value="2">February</option>
                      <option value="3">March</option>
                      <option value="4">April</option>
                      <option value="5">May</option>
                      <option value="6">June</option>
                      <option value="7">July</option>
                      <option value="8">August</option>
                      <option value="9">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <select
                      id="year"
                      className="w-full p-2 border rounded-md"
                      value={currentYear}
                      onChange={handleYearChange}
                    >
                      {[...Array(10)].map((_, i) => {
                        const year = new Date().getFullYear() - 5 + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {isLoadingProfit ? (
                  <div className="flex justify-center py-8">Loading profit data...</div>
                ) : !profitData ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No profit data available for this period.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Revenue
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">${profitData.totalRevenue.toFixed(2)}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Net Profit
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">${profitData.profit.toFixed(2)}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Commissions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            ${Object.values(profitData.commissions).reduce((a, b) => a + b, 0).toFixed(2)}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Commission Distribution</h3>
                      {Object.keys(profitData.commissions).length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          No commissions to distribute for this period.
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Agent</TableHead>
                              <TableHead className="text-right">Commission Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(profitData.commissions).map(([agent, amount]) => (
                              <TableRow key={agent}>
                                <TableCell className="font-medium">{agent}</TableCell>
                                <TableCell className="text-right">${amount.toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Employee Dialog */}
        <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Add a new employee or agent who will receive commission
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  placeholder="Employee Name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="col-span-3"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  placeholder="Email Address"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  className="col-span-3"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  placeholder="Phone Number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <select
                  id="role"
                  className="col-span-3 w-full p-2 border rounded-md"
                  value={newEmployee.role}
                  onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                >
                  <option value="agent">Agent</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="commission" className="text-right">
                  Commission %
                </Label>
                <Input
                  id="commission"
                  type="number"
                  min="0"
                  max="100"
                  className="col-span-3"
                  value={newEmployee.commissionPercent}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      commissionPercent: parseFloat(e.target.value) || 0
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateEmployee} disabled={createEmployeeMutation.isPending}>
                {createEmployeeMutation.isPending ? "Creating..." : "Create Employee"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Employee Dialog */}
        <Dialog open={isEditEmployeeOpen} onOpenChange={setIsEditEmployeeOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>
                Update employee information and commission rate
              </DialogDescription>
            </DialogHeader>
            {selectedEmployee && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    className="col-span-3"
                    value={selectedEmployee.name}
                    onChange={(e) =>
                      setSelectedEmployee({ ...selectedEmployee, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    className="col-span-3"
                    value={selectedEmployee.email || ""}
                    onChange={(e) =>
                      setSelectedEmployee({ ...selectedEmployee, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="edit-phone"
                    className="col-span-3"
                    value={selectedEmployee.phone || ""}
                    onChange={(e) =>
                      setSelectedEmployee({ ...selectedEmployee, phone: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-role" className="text-right">
                    Role
                  </Label>
                  <select
                    id="edit-role"
                    className="col-span-3 w-full p-2 border rounded-md"
                    value={selectedEmployee.role || "agent"}
                    onChange={(e) =>
                      setSelectedEmployee({ ...selectedEmployee, role: e.target.value })
                    }
                  >
                    <option value="agent">Agent</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-commission" className="text-right">
                    Commission %
                  </Label>
                  <Input
                    id="edit-commission"
                    type="number"
                    min="0"
                    max="100"
                    className="col-span-3"
                    value={selectedEmployee.commissionPercent || 0}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        commissionPercent: parseFloat(e.target.value) || 0
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <select
                    id="edit-status"
                    className="col-span-3 w-full p-2 border rounded-md"
                    value={selectedEmployee.active ? 1 : 0}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        active: parseInt(e.target.value) === 1 ? 1 : 0
                      })
                    }
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleUpdateEmployee} disabled={updateEmployeeMutation.isPending}>
                {updateEmployeeMutation.isPending ? "Updating..." : "Update Employee"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}