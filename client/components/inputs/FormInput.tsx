import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define the schema using Zod
const formSchema = z.object({
  username: z.string(),
  imgUpload: z.string(),
});

export default function FormInput() {
  const form = useForm<z.infer<typeof formSchema>>({});

  const handleSubmit = () => {};

  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col gap-3"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="username"
            render={(field) => {
              return (
                <FormItem>
                  <FormLabel className="text-white">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="imgUpload"
            render={(field) => {
              return (
                <FormItem>
                  <FormLabel className="text-white">Upload Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      placeholder="upload image"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button size={"sm"} variant={"secondary"} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
