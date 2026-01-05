
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useParams } from 'next/navigation'
import { translations } from '@/lib/translations'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
// Серверний екшен: створює ліда і надсилає сповіщення в Telegram
import { createLeadFromForm } from "@/app/actions"

export function OrderForm() {
  const { toast } = useToast()
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const t = (translations as any)[locale] || translations.ua;

  const formSchema = z.object({
    name: z.string().min(2, {
      message: t.formErrorNameTooShort,
    }),
    contact: z.string().min(5, {
        message: t.formErrorContactInvalid,
    }),
    description: z.string().min(10, {
        message: t.formErrorDescTooShort,
    }).max(500, {
        message: t.formErrorDescTooLong,
    })
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
      description: "",
    },
  })

  // Надсилання форми: відправляємо на сервер для створення ліда
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await createLeadFromForm({
        name: values.name,
        contact: values.contact,
        description: values.description,
        locale: locale,
      })
      if (res?.success) {
        // Успішно: показуємо тост і очищаємо форму
        toast({
          title: t.formSuccessTitle,
          description: t.formSuccessDesc,
        })
        form.reset();
      } else {
        // Помилка сервера/валідації
        toast({
          variant: "destructive",
          title: t.errorTitle,
          description: res?.error || t.formErrorSubmit,
        })
      }
    } catch (e) {
      // Форс-мажор: мережеві/інші помилки
      toast({ variant: "destructive", title: t.errorTitle, description: t.formErrorGeneral })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.formNameLabel}</FormLabel>
              <FormControl>
                <Input placeholder={t.formNamePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.formContactLabel}</FormLabel>
              <FormControl>
                <Input placeholder={t.formContactPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.formDescLabel}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t.formDescPlaceholder}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">{t.formSubmitButton}</Button>
      </form>
    </Form>
  )
}
