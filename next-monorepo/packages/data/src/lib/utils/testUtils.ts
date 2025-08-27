import {format} from 'date-fns'
export const dateToTestId = (date: Date | string) => {
    return format(date, "yyyy-MM-dd'T'HH:mm");
}