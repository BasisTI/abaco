import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

/**
 * An utility service for date.
 */
@Injectable({
    providedIn: "root"
})
export class JhiDateUtils {

    private readonly _pattern = 'yyyy-MM-dd';

    private readonly _datePipe: DatePipe;

    constructor() {
        this._datePipe = new DatePipe('en');
    }

    /**
     * Method to convert the date time from server into JS date object
     * @param date yyyy-mm-dd h:i:s
     */
    convertDateTimeFromServer(date: string): Date | null {
        if (date) {
            return new Date(date);
        }

        return null;
    }

    /**
     * Method to convert the date from server into JS date object
     * @param date yyyy/mm/dd
     */
    convertLocalDateFromServer(date: string) {
        if (date) {
            return new Date(`${date} 00:00:00`);
        }

        return null;
    }

    /**
     * Method to convert the JS date object into specified date pattern
     */
    convertLocalDateToServer(date: string, pattern = this._pattern) {
        if (date) {
            const newDate = new Date(date);
            return this._datePipe.transform(newDate, pattern);
        } else {
            return null;
        }
    }

    /**
     * Method to get the default date pattern
     */
    dateformat() {
        return this._pattern;
    }

    // TODO Change this method when moving from datetime-local input to NgbDatePicker
    toDate(date: string): Date {

        if (date) {
            const dateParts = date.split(/\D+/);
            const minDateTimeSize = 5;

            if (dateParts.length >= minDateTimeSize) {
                return new Date(date);
            } else {
                return new Date(`${date} 00:00:00`);
            }
        }

        return null;

    }
}
