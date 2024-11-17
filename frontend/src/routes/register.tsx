import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zz } from "@/utils/zod/zz";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthService } from "@/stores/auth.service";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  Field,
} from "@/components/ui/form";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";

const loginSchema = zz.object({
  email: zz.string().email(),
  password: zz.string().min(6),
  firstName: zz.string().min(2),
  lastName: zz.string().min(2),
});

export const Page = () => {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const form = useForm<zz.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (v: zz.infer<typeof loginSchema>) => {
    const res = await AuthService.register(v);
    if (res) {
      navigate({
        to: search.redirect ?? "/",
      });
    }
  };

  const disabled = form.formState.isSubmitting;

  return (
    <Card className="m-auto max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Регистрация</CardTitle>
        <CardDescription>
          Введите информацию для создания аккаунта
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={disabled}
                        placeholder="Иван"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Фамилия</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={disabled}
                        placeholder="Иванов"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Почта</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={disabled}
                      placeholder="me@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={disabled} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={disabled}>
              Создать аккаунт
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Уже есть аккаунт?{" "}
            <Link to="/login" search={search} className="underline">
              Войти
            </Link>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export const Route = createFileRoute("/register")({
  component: () => <Page />,
  validateSearch: zodSearchValidator(
    zz.object({
      redirect: fallback(zz.string().optional(), undefined),
    }),
  ),
});
