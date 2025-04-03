
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { groupService } from "@/api";

const AddGroupPopover = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (groupData) => groupService.createGroup(groupData),
    onSuccess: () => {
      toast.success("Group created successfully");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      form.reset();
      setOpen(false);
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to create group: ${error.message || "Unknown error"}`);
    },
  });

  const onSubmit = (data) => {
    // Only send the required fields to the API
    const postableData = {
      name: data.name,
    };
    
    mutate(postableData);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>
          <Plus size={16} className="mr-2" />
          Add Group
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Add New Group</h4>
            <p className="text-sm text-muted-foreground">
              Create a new permission group
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input {...field} required placeholder="Enter group name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Group"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddGroupPopover;
