import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, CheckIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Main from '@/components/Main';
import storage from '@/storage';
import remote from '@/remote';
import { Label } from '@/components/ui/label';
import { User } from '@/const';

const formSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
    })
    .min(4)
    .max(20)
    .refine((value) => /^[a-zA-Z0-9_]+$/.test(value), {
      message: 'Username can only contain letters, numbers, and underscores',
    }),
  email: z.string().refine((value) => value === '' || z.string().email()),
});

export default () => {
  const [user, setUser] = useState<User | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  });

  const deleteFormSchema = z.object({
    username: z.string().refine((value) => value === user?.username),
  });
  const deleteForm = useForm<z.infer<typeof deleteFormSchema>>({
    resolver: zodResolver(deleteFormSchema),
    defaultValues: {
      username: '',
    },
  });
  const deleteFormOnSubmit = async () => {
    console.log('deleteFormOnSubmit');
    // await remote.deleteUser();
    chrome.runtime.reload();
  };

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await storage.get('user');
      setUser(storedUser);
      form.setValue('username', storedUser.username);
      form.setValue('email', storedUser.email || '');
    };

    loadUser();
  }, []);

  const onSubmit = async ({ username, email }: z.infer<typeof formSchema>) => {
    const user = await remote.putUser({ username, email });
    await storage.set('user', user);
  };

  return (
    <>
      <Header title="Settings" />
      <Main className="grid gap-4">
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="flex flex-row gap-1">
              Save
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {form.formState.isSubmitSuccessful && (
                <CheckIcon className="mr-2 h-4 w-4" />
              )}
            </Button>
          </form>
        </Form>

        <section>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:text-destructive py-1 px-2 h-7"
              >
                Delete account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete account</DialogTitle>
                <DialogDescription asChild>
                  <Alert variant="destructive" className="text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="w-min">Danger</AlertTitle>
                    <AlertDescription>
                      This action is not reversible. Please be certain.
                    </AlertDescription>
                  </Alert>
                </DialogDescription>
              </DialogHeader>
              <Form {...deleteForm}>
                <form
                  className="grid gap-4"
                  onSubmit={deleteForm.handleSubmit(deleteFormOnSubmit)}
                >
                  <FormField
                    control={deleteForm.control}
                    name="username"
                    render={({ field }) => (
                      <>
                        <FormItem>
                          <FormLabel>
                            Enter your username <b>{user?.username}</b> to
                            continue:
                          </FormLabel>
                          <FormControl>
                            <div className="flex w-full max-w-sm items-center space-x-2">
                              <Input id="usernameDelete" {...field} />
                              <Button type="submit">Delete my account</Button>
                            </div>
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      </>
                    )}
                  />
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </section>
      </Main>
    </>
  );
};
