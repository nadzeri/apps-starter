"use client";

import * as React from "react";

import { format, Locale } from "date-fns";
import { enUS, zhTW } from "date-fns/locale";
import { CaptionProps, DayPicker, useNavigation } from "react-day-picker";
import { cn } from "../utils";
import { Button, buttonVariants } from "./button";
import { ChevronLeft, ChevronRight } from "./icons";
import { useFeatureFlagEnabled } from "#lib/posthog";
export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const availableLocales: { [key: string]: Locale } = {
  en: enUS,
  "zh-TW": zhTW,
};

function Calendar({ className, classNames, showOutsideDays = true, locale, ...props }: CalendarProps) {
  const isLanguageTranslatorEnabled = useFeatureFlagEnabled("language-translator");
  const language = isLanguageTranslatorEnabled ? localStorage.getItem("language") || "en" : "en";

  const { components, ...restProps} = props;
  return (
    <DayPicker
      locale={availableLocales[language]}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4  w-full",
        caption: "flex justify-center pt-1 items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"),
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] flex-1",
        row: "flex w-full",
        cell: "h-9 w-9 text-center text-sm p-0 relative rounded [&:has([aria-selected].day-outside)]:bg-accent [&:has([aria-selected])]:bg-primary [&:has([aria-selected])]:text-primary-foreground focus-within:relative focus-within:z-20 flex-1",
        day: cn(buttonVariants({ variant: "ghost" }), "p-1.5 rounded font-normal w-full"),
        day_range_end: "day-range-end",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent",
        day_outside: "day-outside text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption: (props) => CustomCaption({ ...props, language }),
        ...components
      }}
      {...restProps}
    />
  );
}
Calendar.displayName = "Calendar";

function CustomCaption(props: CaptionProps & { language?: string}) {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();
  const language = props.language || "en";
  return (
    <div className="flex items-center justify-between gap-2 self-stretch border-b border-slate-100">
      <Button type="button" variant="ghost" className="h-auto p-1" disabled={!previousMonth} onClick={() => previousMonth && goToMonth(previousMonth)}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="text-sm font-semibold">{format(props.displayMonth, "MMMM yyy", { locale: availableLocales[language] })}</div>
      <Button type="button" variant="ghost" className="h-auto p-1" disabled={!nextMonth} onClick={() => nextMonth && goToMonth(nextMonth)}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export { Calendar };
