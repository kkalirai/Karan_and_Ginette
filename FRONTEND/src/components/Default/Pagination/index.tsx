import { Box, MenuItem, Pagination, TextField } from '@mui/material';
import { FC, useCallback } from 'react';

interface PaginationProps {
  dispatch: any;
  state: any;
  data: any;
}

const CustomPagination: FC<PaginationProps> = ({ state, data, ...props }) => {
  console.log('🚀 ~ { state, ...props }:', { state, ...props });
  const onPageChange = useCallback(
    (_event: React.ChangeEvent<unknown>, value: number) => {
      console.log('🚀 ~ onPageChange ~ page:', value);
      props?.dispatch({
        type: 'SET_DATA',
        data: {
          currentPage: value,
        },
      });
    },
    [state, props.dispatch, data],
  );

  const onChangeRecordPerPage = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const limit = parseInt(event.target.value, 10);
      props?.dispatch({
        type: 'SET_DATA',
        data: {
          limit: limit,
        },
      });
    },
    [state, props.dispatch, data],
  );

  return (
    <Box display="flex" alignItems="center" justifyContent="flex-end" gap={2}>
      <Pagination
        count={Math.ceil(state.totalSize/state.limit)}
        defaultPage={state.currentPage}
        onChange={onPageChange}
        variant="outlined"
        shape="rounded"
      />
      <TextField
        id="rows-per-page-select"
        select
        label="Rows Per Page"
        value={state.limit ? state.limit : 10}
        onChange={onChangeRecordPerPage}
        variant="outlined"
        size="small"
        sx={{ minWidth: 120 }}
      >
        {[10, 25, 50, 100].map(option => (
          <MenuItem key={option.toString()} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default CustomPagination;
