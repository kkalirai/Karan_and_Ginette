import React, { useEffect, useMemo, useState } from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';

interface PROPS extends Omit<ReactDatePickerProps, 'onChange' | 'value'> {
  name: string;
  value?: string | null;
  defaultValue?: string;
  onChange: (key: string, value: any) => void;
  error?: string;
}

const DatePicker = ({ name, onChange, defaultValue, value = null, error, placeholderText, ...props }: PROPS) => {
  const [selectDate, setSelectDate] = useState<Date | null>(null);

  const isError = useMemo(() => {
    return {
      isValid: error ? 'is-invalid' : '',
      message: error,
    };
  }, [error]);

  useEffect(() => {
    setSelectDate(value ? new Date(value) : null);
  }, [value]);

  useEffect(() => {
    if (defaultValue) {
      setSelectDate(new Date(defaultValue));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className={isError.isValid}>
        <ReactDatePicker
          className="form-control"
          calendarClassName="calendardatepicker"
          placeholderText={placeholderText ?? 'Select Date'}
          onChange={date => {
            if (!value) setSelectDate(date);
            onChange(name, date);
          }}
          {...(selectDate ? { selected: selectDate } : {})}
          {...props}
        />
      </div>
      <div className="invalid-feedback">{isError.message}</div>
      <style>
        {`
        .react-datepicker-wrapper{
            width:100%
        }
    //   .react-datepicker__header {
    //     background: #fff;
    //     border: none;
    //   }
    //   .react-datepicker__navigation {
    //     top: 55px;
    //   }
    //   .react-datepicker__current-month {
    //     height: 20px;
    //     font-family: 'Poppins';
    //     font-style: normal;
    //     font-weight: 600;
    //     font-size: 14px;
    //     line-height: 20px;
    //     text-align: center;
    //     text-transform: uppercase;
    //     color: #394352;
    //   }
      
    //   .reactDatePickerCell {
    //     width: 30px;
    //     height: 30px;
    //     border-radius: 20px;
    //     color: #fff;
    //     padding: 1px 2px 0px 1px;
    //   }
    //   .react-datepicker__day--keyboard-selected,
    //   .react-datepicker__day--selected {
    //     @extend .reactDatePickerCell;
    //     background: #0b9545 !important;
    //     color: #fff !important;
    //   }
    //   .react-datepicker__day--highlighted {
    //     @extend .reactDatePickerCell;
    //     background: var(--gray-300, #b5bbc2);
    //     color: #000;
    //   }
    //   .react-datepicker-popper {
    //     inset: auto auto auto auto !important;
    //     position: absolute;
    //     // inset: inherit !important;
    //     transform: none !important;
    //   }
    //   .react-datepicker__children-container {
    //     .react-datepicker-footer {
    //       border-top: #ddd 1px solid;
    //       width: 100%;
    //       margin-bottom: 2%;
    //       left: 0;
    //       z-index: 9;
    //       position: absolute;
    //       bottom: 0;
    //       padding: 4px 12px;
    //     }
    //     button {
    //       margin-top: 2%;
    //     }
    //   }
    //   .react-datepicker__day,
    //   .react-datepicker__day--keyboard-selected {
    //     &:hover {
    //       background-color: #dadde1 !important;
    //       border-radius: 20px;
    //       color: #000;
    //     }
    //   }
  `}
      </style>
    </>
  );
};

export default DatePicker;
