import moment, { Moment } from 'moment';
import React from 'react';
import { Form } from 'react-bootstrap';

import { useCommonReducer } from '@/components/App/reducer';
import { getTimeSlots } from '@/utils/helpers';

interface PROPS {
  onSelect: (time: Date) => void;
  label: string;
  value?: Moment;
}
function TimeSlotPicker(props: PROPS) {
  const { state, dispatch } = useCommonReducer();
  const handleDateClick = () => {
    dispatch({ showTimeSlotList: !state?.showTimeSlotList });
  };
  const handleTimeSlotChange = (time: Date) => {
    dispatch({ showTimeSlotList: false, timeSlotValue: moment(time).format('hh:mm A') });
    props.onSelect(time);
  };

  return (
    <div>
      <Form.Group>
        <Form.Label>{props.label}</Form.Label>
        <Form.Control
          value={moment(props?.value).format('hh:mm A') || '--:-- --'}
          onChange={() => null}
          onClick={handleDateClick}
          type="text"
          placeholder="Schedule Time"
        />
        {state?.showTimeSlotList ? (
          <div className="schedulerTimer">
            {getTimeSlots()?.map(mp => (
              <ul key={mp.formattedTime} onClick={() => handleTimeSlotChange(mp.currentTime)}>
                <li>
                  <p>{mp.formattedTime}</p>
                </li>
              </ul>
            ))}
          </div>
        ) : null}
        {state?.timeSlotValue ? (
          <Form.Text> This scheduler is scheduled at {state?.timeSlotValue} Each day</Form.Text>
        ) : null}
      </Form.Group>
    </div>
  );
}

export default TimeSlotPicker;
