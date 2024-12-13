'use client';
import React, { memo, useMemo, useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useSearchParams } from 'next/navigation';

import { useCommonReducer } from '@/components/App/reducer';
import DefaultTable from '@/components/Default/Table';
import { useContainerContext } from '@/Layout/Container/context';
import { useRequest } from '@/components/App';

interface NUTRITION {
  food: string;
  nutritionType: string;
}
interface Category {
  name: string;
}

function Index() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { state: globalState } = useContainerContext();
  const { request } = useRequest();
  const searchParams = useSearchParams();

  const clientIdData = searchParams.get('clientId');
  const { state, dispatch } = useCommonReducer({
    selectedCategory: null,
    clientId: null,
  });
  useEffect(() => {
    dispatch({
      clientId: clientIdData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientIdData]);

  const columns = [
    {
      dataField: 'serial',
      text: '#',
      sort: true,
    },
    {
      dataField: 'food',
      text: 'Food',
      sort: true,
    },
    {
      dataField: 'nutritionType',
      text: 'Nutrition Type',
      sort: false,
    },
  ];

  async function fetchCategoryDetails() {
    const res = (await request('getCategories')) as any;

    if (res.data.types) {
      setCategories(res.data.types);
    }
  }

  useEffect(() => {
    fetchCategoryDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNutritiontypesList = useMemo(
    () =>
      globalState?.getNutritiontypesList?.result
        ? globalState?.getNutritiontypesList?.result?.map((nutritiontypes: NUTRITION, index: number) => ({
            serial: index + 1,
            nutritionType: nutritiontypes.nutritionType,
            food: nutritiontypes.food,
          }))
        : [],
    [globalState?.getNutritiontypesList?.result],
  );

  return (
    <>
      <div className="border rounded p-3 mb-3">
        <Dropdown className="ActionDropDown">
          <Dropdown.Toggle id="dropdown-basic">Choose a Category</Dropdown.Toggle>
          <Dropdown.Menu>
            {/* Corrected mapping through categories */}
            {categories.map((category: Category, index) => (
              <Dropdown.Item
                key={index} // Using index as key assuming categories don't have unique ids
                onClick={() => {
                  dispatch({
                    selectedCategory: category.name,
                  });
                }}
              >
                {category.name} {/* Assuming category has a 'name' property */}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        {state.selectedCategory && <p>Selected Category: {state.selectedCategory}</p>}
      </div>
      <DefaultTable
        api={{
          url: 'getNutritiontypesList',
          body: state,
        }}
        search={false}
        columns={columns}
        data={getNutritiontypesList}
        title=""
        placeholder="Search by Food "
      />
    </>
  );
}

export default memo(Index);
