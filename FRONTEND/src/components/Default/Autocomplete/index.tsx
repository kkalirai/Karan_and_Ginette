import React, { memo, useEffect } from 'react';
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap';

interface data {
  [field: string]: JSX.Element | JSX.Element[] | string | number | boolean;
}
interface PROPS {
  name: string;
  label: string;
  type: string;
  filter?: boolean;
  loading: boolean;
  multiple?: boolean;
  placeholder: string;
  disabled?: boolean;
  data?: data[];
  value?: string;
  values?: MULTIPLEOPTIONS | MULTIPLEOPTIONS[];
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect?: (e: React.MouseEvent<HTMLLIElement>, data: data) => void;
  clearOption?: (e: React.MouseEvent<HTMLElement>) => void;
  getvalue?: (data: data) => string;
  onMultipleSelect?: (data: MULTIPLEOPTIONS[]) => void;
  // filterfrom?: (data: data) => string;
  filterfrom?: (data: data) => string;
  isOptionsEmpty?: boolean;
}
interface MULTIPLEOPTIONS {
  [key: string]: string | number | JSX.Element;
}
function Autcomplete(props: PROPS) {
  const [state, setstate] = React.useState(false);
  const [selected, setselected] = React.useState('');
  const [multipleOptions, setmultipleOptions] = React.useState<MULTIPLEOPTIONS[]>([]);
  const [formValue, setformValue] = React.useState('');
  const containerRef = React.useRef(null) as any;
  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    setstate(!state);
    if (!props?.data?.length) return;
    if (props.onClick) {
      props.onClick(e);
    }
  };

  const removeMultipleOption = (index: number) => {
    multipleOptions.splice(index, 1);
    setmultipleOptions([...multipleOptions]);
    if (props.multiple) {
      if (props.onMultipleSelect) {
        props.onMultipleSelect(multipleOptions);
      }
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setstate(true);
    setformValue(e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const onSelect = (e: React.MouseEvent<HTMLLIElement>, data: data) => {
    if (props.onSelect) {
      const selectValue = props.onSelect(e, data) as any;
      if (selectValue) {
        setselected(selectValue);
        setstate(false);
        if (props.multiple) {
          if (!multipleOptions.some(mp => mp.name === selectValue.name)) {
            if (props.onMultipleSelect) {
              props.onMultipleSelect([...multipleOptions, { ...selectValue }]);
            }
            setmultipleOptions([...multipleOptions, { ...selectValue }]);
          }
        }
      }
    }
  };

  const clearOption = (e: React.MouseEvent<HTMLElement>) => {
    setformValue('');
    if (props.clearOption) {
      props.clearOption(e);
      if (props.multiple) setmultipleOptions([]);
    }
  };

  // const options = () => {
  //   const option = { ...props };
  //   delete option.onSelect;
  //   delete option.data;
  //   delete option.getvalue;
  //   delete option.isOptionsEmpty;
  //   return option;
  // };

  useEffect(() => {
    if (props.value && props.value !== '') {
      setselected(props.value);
    }
    if (props.values) {
      if (props.values && props.values instanceof Array) {
        setmultipleOptions([...props.values]);
      }
    }
    return () => {
      setselected('');
    };
  }, [props.value, props.values]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef?.current?.contains(event.target)) {
        setstate(false);
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef]);

  return (
    <div className="position-relative" style={{ pointerEvents: `${props?.disabled ? 'none' : 'auto'}` }}>
      <Form.Group>
        {/* <Form.Label>{props.label}</Form.Label> */}
        {props.multiple ? (
          <>
            <Form.Label>{props.label}</Form.Label>
            <span className="form-control" style={{ height: 'auto' }} onClick={handleClick}>
              {multipleOptions.length
                ? multipleOptions.map((mp, i) => (
                    <Form.Label className="autocompleteMultipleChip" key={mp.id as string}>
                      {mp.name}
                      <i
                        role={'button'}
                        className="fa fa-times"
                        onClick={e => {
                          e.stopPropagation();
                          removeMultipleOption(i);
                        }}
                      ></i>
                    </Form.Label>
                  ))
                : props.label}
            </span>
            <span>
              <i title="Clear" onClick={clearOption} className="input_icon_close" style={{ top: '70%' }}>
                x
              </i>
            </span>
          </>
        ) : (
          <>
            <Form.Label>{props.label}</Form.Label>
            <InputGroup>
              <InputGroup.Text className="filterTextSearchIcon">
                <i className="fa fa-search"></i>
              </InputGroup.Text>
              <Form.Control
                onClick={handleClick}
                name={props.name}
                placeholder={props.placeholder || props.label}
                type={props.type}
                value={selected || ''}
                className="filteredText"
                readOnly
              />
              <InputGroup.Text>
                <i title="Clear" onClick={clearOption} className="input_icon_close">
                  x
                </i>
              </InputGroup.Text>
            </InputGroup>
          </>
        )}
        {props.loading && (
          <span className="loader" style={{ display: 'flex' }}>
            <p>Fetching</p>
            <Spinner animation="border" size="sm" />
          </span>
        )}
        {props.isOptionsEmpty && (
          <p className="text-helper" style={{ marginLeft: '3px' }}>
            Options Not Found
          </p>
        )}
      </Form.Group>
      {state && (
        <div ref={containerRef} className="custom_autoComplete">
          <div className="custom_autoCompleteDiv">
            <InputGroup className="search-group">
              <InputGroup.Text className="search-icon">
                <span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15.2929 15.2929C15.6834 14.9024 16.3166 14.9024 16.7071 15.2929L20.7071 19.2929C21.0976 19.6834 21.0976 20.3166 20.7071 20.7071C20.3166 21.0976 19.6834 21.0976 19.2929 20.7071L15.2929 16.7071C14.9024 16.3166 14.9024 15.6834 15.2929 15.2929Z"
                      fill="#136BF5"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.5 17C14.0899 17 17 14.0899 17 10.5C17 6.91014 14.0899 4 10.5 4C6.91014 4 4 6.91014 4 10.5C4 14.0899 6.91014 17 10.5 17ZM10.5 19C15.1944 19 19 15.1944 19 10.5C19 5.80557 15.1944 2 10.5 2C5.80557 2 2 5.80557 2 10.5C2 15.1944 5.80557 19 10.5 19Z"
                      fill="#136BF5"
                    ></path>
                  </svg>
                </span>
              </InputGroup.Text>

              <Form.Control
                name={props.name}
                className="searchBox"
                placeholder={'Type to search'}
                type={props.type}
                onChange={handleChange}
                autoComplete="off"
                autoFocus={true}
                value={formValue || ''}
              ></Form.Control>
              <i title="Clear" onClick={() => setformValue('')} className="input_icon_close">
                x
              </i>
            </InputGroup>
            <div className="filterList">
              {!props.loading && props.data && props.data.length ? (
                <ul>
                  {props.filter
                    ? props?.data
                        .filter(fr => new RegExp(formValue, 'gi').test(props.filterfrom?.(fr) as string))
                        .map((fi, i) => (
                          <li onClick={e => onSelect(e, fi)} role="button" key={i}>
                            <span>{props.getvalue?.(fi)}</span>
                          </li>
                        ))
                    : props.data.map((fi, i) => (
                        <li onClick={e => onSelect(e, fi)} role="button" key={i}>
                          <span>{props.getvalue?.(fi)}</span>
                        </li>
                      ))}
                </ul>
              ) : (
                ''
              )}
            </div>
            <div className="footer_custom_autoComplete p-2">
              <div style={{ float: 'right' }}>
                <Button variant="danger" size="sm" onClick={() => setstate(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>
        {`
                    .custom_autoComplete{
                        width: 100%;
                        border-top: none;
                        margin-top: 0px !important;
                        box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.3) !important;
                        border-radius: 1.25rem !important;
                        margin: 5px 0px;
                        padding: 0.2rem;
                        z-index: 20;
                        background: #fff;
                        cursor: pointer;
                        position:absolute;
                    }
                    .custom_autoCompleteDiv{
                      position:relative;
                    }
                    .filterList{
                       max-height: 200px;
                      overflow-y: auto;
                      overflow-x: hidden;
                    }
                    .filterList::-webkit-scrollbar{
                      display:none;
                    }
                    .custom_autoComplete ul {
                        padding: 1px 7px;
                        margin-left:1.2rem;
                    }
                    .custom_autoComplete ul li {
                        padding: 10px 15px 10px 10px;
                        margin-top:2px;
                        //border-bottom: 0.5px solid lightgray;
                        list-style-type:none;
                        border-radius:8px;
                    }
                     .custom_autoComplete ul li:hover {
                       padding: 10px 15px 10px 10px;
                       background:#F0F0F0;
                    }
                    .searchBox{
                      border:none;
                    }
                    .input_icon_close {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        -webkit-transform: translateY(-50%);
                        -moz-transform: translateY(-50%);
                        right: 5px;
                        cursor: pointer;
                        border-radius:50%;
                        background: transparent;
                        padding: 0px 2px;
                        margin-top:-2px;
                        z-index:10;
                    }
                    .loader{
                        font-size: 10px;
                        color: grey;
                        margin-right: 10px;
                        margin-top: 3px;
                    }
                    .text-helper {
                        font-size: 10px;
                        color: #6c757d !important;
                    }  
                    .search-group{
                        padding: 5px 0px;
                        margin: 5px 10px 5px 9px;
                        right: 10px
                    }
                    .search-icon{
                        left: 1rem;
                        position: relative;
                        z-index: 1;
                        top: 0px;
                        background:transparent;
                        border:none;
                      }
                    .form-control:disabled, .form-control[readonly]{
                      background:none; 
                    }
                    .filteredText{
                      /*border: 2px solid blue;*/
                      padding: 10px 40px;
                      font-size: 14px;
                      /*border-radius: 10px !important;*/
                      color: blueviolet;
                    }
                    .filterTextSearchIcon{
                        border-radius: 10px;
                        background: transparent;
                        border: none;
                        border-right: none;
                        position: absolute;
                        left: 0px;
                        margin-top: 6px !important;
                        font-size: 16px;}
                    }
                `}
      </style>
    </div>
  );
}

// const CustomAutomplete = (props: PROPS) => {
//   return React.useMemo(() => Autcomplete(props), [props]);
// };

export default memo(Autcomplete);
